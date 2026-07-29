import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
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

import { User } from './modules/users/entities/user.entity';
import { Workout } from './modules/workouts/entities/workout.entity';
import { Exercise } from './modules/exercises/entities/exercise.entity';
import { Goal } from './modules/goals/entities/goal.entity';
import { TrainerAthleteRelation } from './modules/trainer-athletes/entities/trainer-athlete-relation.entity';
import { EvolutionPhoto } from './modules/evolution-photos/entities/evolution-photo.entity';
import { PhysicalEvaluation } from './modules/physical-evaluations/entities/physical-evaluation.entity';

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
          entities: [User, Workout, Exercise, Goal, TrainerAthleteRelation, EvolutionPhoto, PhysicalEvaluation],
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
    AuthModule,
    UsersModule,
    WorkoutsModule,
    ExercisesModule,
    GoalsModule,
    AnalyticsModule,
    TrainerAthletesModule,
    EvolutionPhotosModule,
    PhysicalEvaluationsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
