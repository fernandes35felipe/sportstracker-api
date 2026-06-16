import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Workout } from '../workouts/entities/workout.entity';
import { Goal } from '../goals/entities/goal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, Goal])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
