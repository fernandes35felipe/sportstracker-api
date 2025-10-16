import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Goal, GoalDocument } from './schemas/goal.schema';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
  ) {}

  async create(createGoalDto: CreateGoalDto, userId: string): Promise<Goal> {
    const createdGoal = new this.goalModel({
      ...createGoalDto,
      userId,
    });

    return createdGoal.save();
  }

  async findAll(userId: string): Promise<Goal[]> {
    return this.goalModel
      .find({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalModel.findById(id).exec();

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return goal;
  }

  async update(id: string, updateGoalDto: UpdateGoalDto, userId: string): Promise<Goal> {
    const goal = await this.goalModel.findById(id);

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updatedGoal = await this.goalModel
      .findByIdAndUpdate(id, updateGoalDto, { new: true })
      .exec();

    return updatedGoal;
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.goalModel.findById(id);

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.goalModel.findByIdAndDelete(id).exec();
  }

  async updateProgress(id: string, current: number, userId: string): Promise<Goal> {
    const goal = await this.goalModel.findById(id);

    if (!goal) {
      throw new NotFoundException('Goal not found');
    }

    if (goal.userId.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }

    goal.current = current;

    if (current >= goal.target) {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }

    return goal.save();
  }

  async findByStatus(userId: string, status: string): Promise<Goal[]> {
    return this.goalModel
      .find({ userId, status, isActive: true })
      .sort({ createdAt: -1 })
      .exec();
  }
}