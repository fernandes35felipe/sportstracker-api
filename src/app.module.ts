import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { WorkoutsModule } from './modules/workouts/workouts.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { GoalsModule } from './modules/goals/goals.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: 'mongodb+srv://admin:Swordfish35@cluster0.ojl4sve.mongodb.net/?retryWrites=true&w=majority&appname=Cluster0/sportstracker'
      }),
      inject: [ConfigService],
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