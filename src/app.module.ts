import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { GoalsModule } from './modules/goals/goals.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

import { User } from './modules/users/entities/user.entity';
import { Workout } from './modules/workouts/entities/workout.entity';
import { Exercise } from './modules/exercises/entities/exercise.entity';
import { Goal } from './modules/goals/entities/goal.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '151.243.218.59',
      port: 5432,
      username: 'postgres',
      password: 'r2d2pyx4*',
      database: 'zeni_wallet',
      entities: [User, Workout, Exercise, Goal],
      synchronize: true,
      ssl: false,
    }),
    AuthModule,
    UsersModule,
    WorkoutsModule,
    ExercisesModule,
    GoalsModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
