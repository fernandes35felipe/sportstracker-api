import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise) private exerciseRepo: Repository<Exercise>,
  ) {}

  async create(createExerciseDto: CreateExerciseDto, userId?: string): Promise<Exercise> {
    const exercise = this.exerciseRepo.create({
      ...createExerciseDto,
      createdById: userId ?? null,
      isCustom: !!userId,
    });
    return this.exerciseRepo.save(exercise);
  }

  async findAll(userId?: string): Promise<Exercise[]> {
    if (userId) {
      return this.exerciseRepo
        .createQueryBuilder('exercise')
        .where('exercise.isActive = true')
        .andWhere(
          '(exercise.isCustom = false OR (exercise.isCustom = true AND exercise.createdById = :userId))',
          { userId },
        )
        .orderBy('exercise.createdAt', 'DESC')
        .getMany();
    }
    return this.exerciseRepo.find({ where: { isActive: true, isCustom: false } });
  }

  async findMyLibrary(userId: string): Promise<Exercise[]> {
    return this.exerciseRepo.find({
      where: { createdById: userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepo.findOne({ where: { id } });
    if (!exercise) throw new NotFoundException('Exercise not found');
    return exercise;
  }

  async findByCategory(category: string, userId?: string): Promise<Exercise[]> {
    if (userId) {
      return this.exerciseRepo
        .createQueryBuilder('exercise')
        .where('exercise.isActive = true')
        .andWhere('exercise.category = :category', { category })
        .andWhere(
          '(exercise.isCustom = false OR (exercise.isCustom = true AND exercise.createdById = :userId))',
          { userId },
        )
        .getMany();
    }
    return this.exerciseRepo.find({ where: { category, isActive: true, isCustom: false } });
  }

  async update(id: string, updateExerciseDto: UpdateExerciseDto, userId: string): Promise<Exercise> {
    const exercise = await this.exerciseRepo.findOne({ where: { id } });
    if (!exercise) throw new NotFoundException('Exercise not found');

    if (exercise.isCustom && exercise.createdById !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este exercício');
    }

    Object.assign(exercise, updateExerciseDto);
    return this.exerciseRepo.save(exercise);
  }

  async remove(id: string, userId: string): Promise<void> {
    const exercise = await this.exerciseRepo.findOne({ where: { id } });
    if (!exercise) throw new NotFoundException('Exercise not found');

    if (exercise.isCustom && exercise.createdById !== userId) {
      throw new ForbiddenException('Você não tem permissão para excluir este exercício');
    }

    await this.exerciseRepo.delete(id);
  }
}
