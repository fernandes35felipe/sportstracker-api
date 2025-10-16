import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Exercise, ExerciseDocument } from './schemas/exercise.schema';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectModel(Exercise.name) private exerciseModel: Model<ExerciseDocument>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto, userId?: string): Promise<Exercise> {
    const createdExercise = new this.exerciseModel({
      ...createExerciseDto,
      createdBy: userId,
    });

    return createdExercise.save();
  }

  async findAll(userId?: string): Promise<Exercise[]> {
    const query: any = { isActive: true };
    
    if (userId) {
      query.$or = [
        { isCustom: false },
        { isCustom: true, createdBy: userId }
      ];
    } else {
      query.isCustom = false;
    }

    return this.exerciseModel.find(query).exec();
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseModel.findById(id).exec();
    
    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }

  async findByCategory(category: string, userId?: string): Promise<Exercise[]> {
    const query: any = { category, isActive: true };
    
    if (userId) {
      query.$or = [
        { isCustom: false },
        { isCustom: true, createdBy: userId }
      ];
    } else {
      query.isCustom = false;
    }

    return this.exerciseModel.find(query).exec();
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.exerciseModel
      .findByIdAndUpdate(id, updateExerciseDto, { new: true })
      .exec();

    if (!exercise) {
      throw new NotFoundException('Exercise not found');
    }

    return exercise;
  }

  async remove(id: string): Promise<void> {
    const result = await this.exerciseModel.findByIdAndDelete(id).exec();
    
    if (!result) {
      throw new NotFoundException('Exercise not found');
    }
  }
}