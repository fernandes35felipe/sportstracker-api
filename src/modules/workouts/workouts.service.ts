import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Workout, WorkoutDocument } from './schemas/workout.schema';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<WorkoutDocument>,
  ) {}

  async create(createWorkoutDto: CreateWorkoutDto, userId: string): Promise<Workout> {
    const createdWorkout = new this.workoutModel({
      ...createWorkoutDto,
      createdBy: userId,
    });

    return createdWorkout.save();
  }

  async findAll(userId: string, userRole: string): Promise<Workout[]> {
    if (userRole === 'trainer') {
      return this.workoutModel
        .find({ createdBy: userId })
        .populate('createdBy', 'name email')
        .populate('assignedTo', 'name email')
        .exec();
    }

    return this.workoutModel
      .find({ assignedTo: userId })
      .populate('createdBy', 'name email')
      .exec();
  }

  async findOne(id: string, userId: string, userRole: string): Promise<Workout> {
    const workout = await this.workoutModel
      .findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .exec();

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (userRole === 'trainer' && workout.createdBy._id.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === 'athlete' && !workout.assignedTo.some(id => id.toString() === userId)) {
      throw new ForbiddenException('Access denied');
    }

    return workout;
  }

  async update(id: string, updateWorkoutDto: UpdateWorkoutDto, userId: string, userRole: string): Promise<Workout> {
    const workout = await this.workoutModel.findById(id);

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (userRole === 'trainer' && workout.createdBy.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updatedWorkout = await this.workoutModel
      .findByIdAndUpdate(id, updateWorkoutDto, { new: true })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .exec();

    return updatedWorkout;
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const workout = await this.workoutModel.findById(id);

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (userRole === 'trainer' && workout.createdBy.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.workoutModel.findByIdAndDelete(id).exec();
  }

  async markAsCompleted(id: string, userId: string): Promise<Workout> {
    const workout = await this.workoutModel.findById(id);

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    if (!workout.assignedTo.some(assignedId => assignedId.toString() === userId)) {
      throw new ForbiddenException('Access denied');
    }

    workout.completed = true;
    workout.completedAt = new Date();

    return workout.save();
  }
}