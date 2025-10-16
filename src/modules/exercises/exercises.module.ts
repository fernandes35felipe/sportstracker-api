import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ExercisesService } from './exercises.service';
import { ExercisesController } from './exercises.controller';
import { Exercise, ExerciseSchema } from './schemas/exercise.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exercise.name, schema: ExerciseSchema }]),
  ],
  controllers: [ExercisesController],
  providers: [ExercisesService],
  exports: [ExercisesService],
})
export class ExercisesModule {}