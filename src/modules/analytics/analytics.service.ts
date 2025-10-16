import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Workout, WorkoutDocument } from '../workouts/schemas/workout.schema';
import { Goal, GoalDocument } from '../goals/schemas/goal.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Workout.name) private workoutModel: Model<WorkoutDocument>,
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
  ) {}

  async getUserStats(userId: string) {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalWorkouts,
      completedWorkouts,
      weekWorkouts,
      monthWorkouts,
      totalGoals,
      completedGoals,
      activeGoals,
    ] = await Promise.all([
      this.workoutModel.countDocuments({ assignedTo: userId }),
      this.workoutModel.countDocuments({ assignedTo: userId, completed: true }),
      this.workoutModel.countDocuments({
        assignedTo: userId,
        completed: true,
        completedAt: { $gte: startOfWeek },
      }),
      this.workoutModel.countDocuments({
        assignedTo: userId,
        completed: true,
        completedAt: { $gte: startOfMonth },
      }),
      this.goalModel.countDocuments({ userId }),
      this.goalModel.countDocuments({ userId, status: 'completed' }),
      this.goalModel.countDocuments({ userId, status: 'active' }),
    ]);

    return {
      workouts: {
        total: totalWorkouts,
        completed: completedWorkouts,
        thisWeek: weekWorkouts,
        thisMonth: monthWorkouts,
        completionRate: totalWorkouts > 0 ? (completedWorkouts / totalWorkouts) * 100 : 0,
      },
      goals: {
        total: totalGoals,
        completed: completedGoals,
        active: activeGoals,
        completionRate: totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0,
      },
    };
  }

  async getWorkoutTrends(userId: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const workouts = await this.workoutModel
      .find({
        assignedTo: userId,
        completed: true,
        completedAt: { $gte: startDate },
      })
      .sort({ completedAt: 1 })
      .exec();

    const dailyStats = workouts.reduce((acc, workout) => {
      const date = new Date(workout.completedAt).toISOString().split('T')[0];
      
      if (!acc[date]) {
        acc[date] = { count: 0, categories: {} };
      }
      
      acc[date].count++;
      acc[date].categories[workout.category] = (acc[date].categories[workout.category] || 0) + 1;
      
      return acc;
    }, {});

    return dailyStats;
  }

  async getGoalProgress(userId: string) {
    const goals = await this.goalModel
      .find({ userId, isActive: true })
      .sort({ createdAt: -1 })
      .exec();

    return goals.map(goal => ({
      id: goal._id,
      title: goal.title,
      category: goal.category,
      progress: goal.target > 0 ? (goal.current / goal.target) * 100 : 0,
      current: goal.current,
      target: goal.target,
      unit: goal.unit,
      status: goal.status,
    }));
  }

  async getCategoryDistribution(userId: string) {
    const workouts = await this.workoutModel
      .find({ assignedTo: userId, completed: true })
      .exec();

    const distribution = workouts.reduce((acc, workout) => {
      acc[workout.category] = (acc[workout.category] || 0) + 1;
      return acc;
    }, {});

    return distribution;
  }
}