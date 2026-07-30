import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as webpush from 'web-push';

@Injectable()
export class WorkoutNotificationsService {
  private readonly logger = new Logger(WorkoutNotificationsService.name);
  private readonly vapidReady: boolean;

  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private config: ConfigService,
  ) {
    const publicKey = this.config.get<string>('VAPID_PUBLIC_KEY');
    const privateKey = this.config.get<string>('VAPID_PRIVATE_KEY');
    const subject = this.config.get<string>('VAPID_SUBJECT') || 'mailto:noreply@zeni.app';

    if (publicKey && privateKey) {
      webpush.setVapidDetails(subject, publicKey, privateKey);
      this.vapidReady = true;
    } else {
      this.logger.warn('VAPID keys not set — push notifications disabled');
      this.vapidReady = false;
    }
  }

  async notifyWorkoutAssigned(
    workoutId: string,
    workoutName: string,
    trainerName: string,
    athleteIds: string[],
  ): Promise<void> {
    if (!athleteIds.length) return;

    const title = 'Novo treino disponível!';
    const message = `"${workoutName}" foi prescrito por ${trainerName}.`;

    // In-app notification (shared notifications table)
    for (const userId of athleteIds) {
      try {
        await this.dataSource.query(
          `INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, 'workout_assigned', false, NOW())`,
          [userId, title, message],
        );
      } catch (e) {
        this.logger.warn(`Failed in-app notification for ${userId}: ${e.message}`);
      }
    }

    if (!this.vapidReady) return;

    // Web-push to each athlete's subscriptions
    const placeholders = athleteIds.map((_, i) => `$${i + 1}`).join(', ');
    const subs: any[] = await this.dataSource.query(
      `SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id IN (${placeholders}) AND is_active = true`,
      athleteIds,
    );

    const payload = JSON.stringify({
      title,
      body: message,
      url: '/sports/workouts',
      data: { workoutId },
    });

    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
        );
      } catch (e) {
        if (e.statusCode === 410 || e.statusCode === 404) {
          await this.dataSource.query(
            `UPDATE push_subscriptions SET is_active = false WHERE endpoint = $1`,
            [sub.endpoint],
          );
        } else {
          this.logger.warn(`Push failed for ${sub.endpoint}: ${e.message}`);
        }
      }
    }
  }
}
