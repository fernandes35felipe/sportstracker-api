import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Workout } from '../workouts/entities/workout.entity';
import { Goal } from '../goals/entities/goal.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Workout) private workoutRepo: Repository<Workout>,
    @InjectRepository(Goal) private goalRepo: Repository<Goal>,
  ) {}

  async getUserStats(userId: string) {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const base = () =>
      this.workoutRepo
        .createQueryBuilder('workout')
        .innerJoin('workout.assignedTo', 'u', 'u.id = :userId', { userId });

    const [
      totalWorkouts,
      completedWorkouts,
      weekWorkouts,
      monthWorkouts,
      totalGoals,
      completedGoals,
      activeGoals,
    ] = await Promise.all([
      base().getCount(),
      base().andWhere('workout.completed = true').getCount(),
      base()
        .andWhere('workout.completed = true')
        .andWhere('workout.completedAt >= :startOfWeek', { startOfWeek })
        .getCount(),
      base()
        .andWhere('workout.completed = true')
        .andWhere('workout.completedAt >= :startOfMonth', { startOfMonth })
        .getCount(),
      this.goalRepo.count({ where: { userId } }),
      this.goalRepo.count({ where: { userId, status: 'completed' } }),
      this.goalRepo.count({ where: { userId, status: 'active' } }),
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

  async getWorkoutTrends(userId: string, days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const workouts = await this.workoutRepo
      .createQueryBuilder('workout')
      .innerJoin('workout.assignedTo', 'u', 'u.id = :userId', { userId })
      .where('workout.completed = true')
      .andWhere('workout.completedAt >= :startDate', { startDate })
      .orderBy('workout.completedAt', 'ASC')
      .getMany();

    return workouts.reduce((acc, workout) => {
      const date = new Date(workout.completedAt).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { count: 0, categories: {} };
      acc[date].count++;
      acc[date].categories[workout.category] = (acc[date].categories[workout.category] || 0) + 1;
      return acc;
    }, {});
  }

  async getGoalProgress(userId: string) {
    const goals = await this.goalRepo.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });

    return goals.map(goal => ({
      id: goal.id,
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
    const workouts = await this.workoutRepo
      .createQueryBuilder('workout')
      .innerJoin('workout.assignedTo', 'u', 'u.id = :userId', { userId })
      .where('workout.completed = true')
      .getMany();

    return workouts.reduce((acc, workout) => {
      acc[workout.category] = (acc[workout.category] || 0) + 1;
      return acc;
    }, {});
  }
}
