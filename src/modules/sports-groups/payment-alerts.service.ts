import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class PaymentAlertsService {
  private readonly logger = new Logger(PaymentAlertsService.name);

  constructor(@InjectDataSource() private dataSource: DataSource) {}

  @Cron('0 8 * * *')
  async checkUpcomingPayments() {
    this.logger.log('Running daily alerts check...');
    try {
      await this.alertPaymentsIn(3);
      await this.alertPaymentsIn(7);
      await this.alertUpcomingEvaluations();
      await this.checkBirthdays();
    } catch (e) {
      this.logger.error('Daily alerts failed', e);
    }
  }

  private async alertPaymentsIn(days: number) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);
    const dateStr = targetDate.toISOString().split('T')[0];

    const members: any[] = await this.dataSource.query(
      `
      SELECT
        m.id,
        m.user_id,
        m.fictional_name,
        m.next_payment_date,
        m.plan_name,
        m.plan_value,
        g.name AS group_name
      FROM sports_group_members m
      JOIN sports_groups g ON g.id = m.group_id
      WHERE m.next_payment_date = $1
        AND m.user_id IS NOT NULL
        AND (m.payment_status IS NULL OR m.payment_status != 'pago')
      `,
      [dateStr],
    );

    if (!members.length) return;

    for (const m of members) {
      const title =
        days === 0
          ? `Pagamento vence hoje — ${m.group_name}`
          : `Pagamento vence em ${days} dias — ${m.group_name}`;
      const message = m.plan_name
        ? `Plano "${m.plan_name}"${m.plan_value ? ` (R$ ${Number(m.plan_value).toFixed(2)})` : ''} vence em ${dateStr}.`
        : `Seu pagamento no grupo "${m.group_name}" vence em ${dateStr}.`;

      try {
        await this.dataSource.query(
          `INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, 'payment_alert', false, NOW())
           ON CONFLICT DO NOTHING`,
          [m.user_id, title, message],
        );
      } catch (e) {
        this.logger.warn(`Payment alert insert failed for user ${m.user_id}: ${e.message}`);
      }
    }

    this.logger.log(`Sent ${members.length} payment alert(s) for +${days}d`);
  }

  private async alertUpcomingEvaluations() {
    const in7 = new Date();
    in7.setDate(in7.getDate() + 7);
    const dateStr = in7.toISOString().split('T')[0];

    // Notify the athlete themselves and their trainer
    const athletes: any[] = await this.dataSource.query(
      `SELECT id, full_name, trainer_id, next_evaluation_date FROM users
       WHERE next_evaluation_date = $1 AND role = 'athlete'`,
      [dateStr],
    );

    for (const a of athletes) {
      const title = 'Avaliação física em 7 dias';
      const message = `A reavaliação física de ${a.full_name ?? 'um atleta'} está agendada para ${dateStr}.`;

      // Notify athlete
      try {
        await this.dataSource.query(
          `INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, 'evaluation_reminder', false, NOW())
           ON CONFLICT DO NOTHING`,
          [a.id, 'Sua avaliação física está chegando!', `Sua reavaliação física está marcada para ${dateStr}.`],
        );
      } catch (e) {
        this.logger.warn(`Evaluation alert for athlete ${a.id}: ${e.message}`);
      }

      // Notify trainer
      if (a.trainer_id) {
        try {
          await this.dataSource.query(
            `INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
             VALUES (gen_random_uuid(), $1, $2, $3, 'evaluation_reminder', false, NOW())
             ON CONFLICT DO NOTHING`,
            [a.trainer_id, title, message],
          );
        } catch (e) {
          this.logger.warn(`Evaluation alert for trainer ${a.trainer_id}: ${e.message}`);
        }
      }
    }

    if (athletes.length) this.logger.log(`Sent ${athletes.length} evaluation reminder(s)`);
  }

  private async checkBirthdays() {
    const in7 = new Date();
    in7.setDate(in7.getDate() + 7);
    // Match month-day only (ignore year)
    const month = String(in7.getMonth() + 1).padStart(2, '0');
    const day = String(in7.getDate()).padStart(2, '0');

    const athletes: any[] = await this.dataSource.query(
      `SELECT id, full_name, trainer_id, birth_date FROM users
       WHERE role = 'athlete'
         AND birth_date IS NOT NULL
         AND TO_CHAR(birth_date::date, 'MM-DD') = $1`,
      [`${month}-${day}`],
    );

    for (const a of athletes) {
      if (!a.trainer_id) continue;
      const title = `🎂 Aniversário de ${a.full_name ?? 'um atleta'} em 7 dias!`;
      const message = `${a.full_name ?? 'Seu atleta'} faz aniversário em 7 dias (${a.birth_date}). Aproveite para enviar uma mensagem especial!`;
      try {
        await this.dataSource.query(
          `INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at)
           VALUES (gen_random_uuid(), $1, $2, $3, 'birthday_alert', false, NOW())
           ON CONFLICT DO NOTHING`,
          [a.trainer_id, title, message],
        );
      } catch (e) {
        this.logger.warn(`Birthday alert for trainer ${a.trainer_id}: ${e.message}`);
      }
    }

    if (athletes.length) this.logger.log(`Sent ${athletes.length} birthday alert(s)`);
  }
}
