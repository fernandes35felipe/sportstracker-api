import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { WorkoutNotificationsService } from './workout-notifications.service';
import { Workout } from './entities/workout.entity';
import { WorkoutExerciseLog } from './entities/workout-exercise-log.entity';
import { User } from '../users/entities/user.entity';
import { Exercise } from '../exercises/entities/exercise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, WorkoutExerciseLog, User, Exercise])],
  controllers: [WorkoutsController],
  providers: [WorkoutsService, WorkoutNotificationsService],
  exports: [WorkoutsService],
})
export class WorkoutsModule {}
