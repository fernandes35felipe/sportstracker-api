import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Goal } from './entities/goal.entity';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private goalRepo: Repository<Goal>,
  ) {}

  async create(createGoalDto: CreateGoalDto, userId: string): Promise<Goal> {
    const goal = this.goalRepo.create({ ...createGoalDto, userId });
    return this.goalRepo.save(goal);
  }

  async findAll(userId: string): Promise<Goal[]> {
    return this.goalRepo.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Goal> {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    if (goal.userId !== userId) throw new ForbiddenException('Access denied');
    return goal;
  }

  async update(id: string, updateGoalDto: UpdateGoalDto, userId: string): Promise<Goal> {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    if (goal.userId !== userId) throw new ForbiddenException('Access denied');

    Object.assign(goal, updateGoalDto);
    return this.goalRepo.save(goal);
  }

  async remove(id: string, userId: string): Promise<void> {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    if (goal.userId !== userId) throw new ForbiddenException('Access denied');
    await this.goalRepo.delete(id);
  }

  async updateProgress(id: string, current: number, userId: string): Promise<Goal> {
    const goal = await this.goalRepo.findOne({ where: { id } });
    if (!goal) throw new NotFoundException('Goal not found');
    if (goal.userId !== userId) throw new ForbiddenException('Access denied');

    goal.current = current;
    if (current >= goal.target) {
      goal.status = 'completed';
      goal.completedAt = new Date();
    }

    return this.goalRepo.save(goal);
  }

  async findByStatus(userId: string, status: string): Promise<Goal[]> {
    return this.goalRepo.find({
      where: { userId, status, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }
}
