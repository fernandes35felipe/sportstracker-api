import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { GoalsModule } from './modules/goals/goals.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { TrainerAthletesModule } from './modules/trainer-athletes/trainer-athletes.module';
import { EvolutionPhotosModule } from './modules/evolution-photos/evolution-photos.module';
import { PhysicalEvaluationsModule } from './modules/physical-evaluations/physical-evaluations.module';
import { SportsGroupsModule } from './modules/sports-groups/sports-groups.module';

import { User } from './modules/users/entities/user.entity';
import { Workout } from './modules/workouts/entities/workout.entity';
import { WorkoutExerciseLog } from './modules/workouts/entities/workout-exercise-log.entity';
import { Exercise } from './modules/exercises/entities/exercise.entity';
import { Goal } from './modules/goals/entities/goal.entity';
import { TrainerAthleteRelation } from './modules/trainer-athletes/entities/trainer-athlete-relation.entity';
import { EvolutionPhoto } from './modules/evolution-photos/entities/evolution-photo.entity';
import { PhysicalEvaluation } from './modules/physical-evaluations/entities/physical-evaluation.entity';
import { SportsGroup } from './modules/sports-groups/entities/sports-group.entity';
import { SportsGroupMember } from './modules/sports-groups/entities/sports-group-member.entity';
import { SportsGroupClass } from './modules/sports-groups/entities/sports-group-class.entity';
import { SportsGroupSession } from './modules/sports-groups/entities/sports-group-session.entity';
import { SportsGroupSessionFeedback } from './modules/sports-groups/entities/sports-group-session-feedback.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60000, limit: 100 },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        const base = {
          type: 'postgres' as const,
          entities: [
            User, Workout, WorkoutExerciseLog, Exercise, Goal, TrainerAthleteRelation,
            EvolutionPhoto, PhysicalEvaluation,
            SportsGroup, SportsGroupMember, SportsGroupClass, SportsGroupSession,
            SportsGroupSessionFeedback,
          ],
          synchronize: true,
          ssl: false,
          retryAttempts: 5,
          retryDelay: 3000,
        };
        if (url) {
          return { ...base, url };
        }
        return {
          ...base,
          host: config.get<string>('DATABASE_HOST'),
          port: config.get<number>('DATABASE_PORT'),
          username: config.get<string>('DATABASE_USER'),
          password: config.get<string>('DATABASE_PASSWORD'),
          database: config.get<string>('DATABASE_NAME'),
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    WorkoutsModule,
    ExercisesModule,
    GoalsModule,
    AnalyticsModule,
    TrainerAthletesModule,
    EvolutionPhotosModule,
    PhysicalEvaluationsModule,
    SportsGroupsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async onApplicationBootstrap() {
    // Safety net: ensure sports-API-specific columns exist even if the users table
    // was created by another service (wallet/planner) before this API restarted.
    // synchronize:true handles new deploys, but this covers the "stale connection
    // after DB wipe" scenario where sync already ran against an older schema.
    const safeAlter = async (sql: string) => {
      try { await this.dataSource.query(sql); } catch { /* column already exists */ }
    };

    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR DEFAULT 'athlete'`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_trainer BOOLEAN DEFAULT false`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS weight FLOAT`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS height FLOAT`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS trainer_id UUID`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS pix_key VARCHAR`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE`);
    await safeAlter(`ALTER TABLE users ADD COLUMN IF NOT EXISTS next_evaluation_date DATE`);
    await safeAlter(`ALTER TABLE users ALTER COLUMN password DROP NOT NULL`);

    console.log('[Sports API] Bootstrap done.');
  }
}
