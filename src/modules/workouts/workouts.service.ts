import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Workout } from './entities/workout.entity';
import { User } from '../users/entities/user.entity';
import { Exercise } from '../exercises/entities/exercise.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout) private workoutRepo: Repository<Workout>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Exercise) private exerciseRepo: Repository<Exercise>,
  ) {}

  async create(createWorkoutDto: CreateWorkoutDto, userId: string, userRole: string): Promise<Workout> {
    const { assignedTo: assignedToIds, ...rest } = createWorkoutDto;

    const workout = this.workoutRepo.create({ ...rest, createdById: userId });

    let assignedUsers = assignedToIds?.length
      ? await this.userRepo.findBy({ id: In(assignedToIds) })
      : [];

    // Athletes auto-assign themselves so they can track and complete their own workouts
    if (userRole !== 'trainer' && !assignedUsers.some(u => u.id === userId)) {
      const self = await this.userRepo.findOne({ where: { id: userId } });
      if (self) assignedUsers = [self, ...assignedUsers];
    }

    workout.assignedTo = assignedUsers;
    return this.workoutRepo.save(workout);
  }

  async findAll(userId: string, userRole: string): Promise<Workout[]> {
    if (userRole === 'trainer') {
      return this.workoutRepo.find({
        where: { createdById: userId },
        relations: { createdBy: true, assignedTo: true },
      });
    }

    // Athletes see workouts assigned to them AND workouts they created themselves
    const [assigned, selfCreated] = await Promise.all([
      this.workoutRepo
        .createQueryBuilder('workout')
        .leftJoinAndSelect('workout.createdBy', 'creator')
        .innerJoin('workout.assignedTo', 'assigned', 'assigned.id = :userId', { userId })
        .getMany(),
      this.workoutRepo.find({
        where: { createdById: userId },
        relations: { createdBy: true, assignedTo: true },
      }),
    ]);

    const seen = new Set<string>();
    return [...assigned, ...selfCreated].filter((w) => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    });
  }

  async findOne(id: string, userId: string, userRole: string): Promise<Workout> {
    const workout = await this.workoutRepo.findOne({
      where: { id },
      relations: { createdBy: true, assignedTo: true },
    });

    if (!workout) throw new NotFoundException('Workout not found');

    if (userRole === 'trainer' && workout.createdById !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === 'athlete' && !workout.assignedTo.some(u => u.id === userId)) {
      throw new ForbiddenException('Access denied');
    }

    return workout;
  }

  async update(
    id: string,
    updateWorkoutDto: UpdateWorkoutDto,
    userId: string,
    userRole: string,
  ): Promise<Workout> {
    const workout = await this.workoutRepo.findOne({
      where: { id },
      relations: { assignedTo: true },
    });

    if (!workout) throw new NotFoundException('Workout not found');

    if (userRole === 'trainer' && workout.createdById !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { assignedTo: assignedToIds, ...rest } = updateWorkoutDto;
    Object.assign(workout, rest);

    if (assignedToIds !== undefined) {
      workout.assignedTo = assignedToIds.length
        ? await this.userRepo.findBy({ id: In(assignedToIds) })
        : [];
    }

    await this.workoutRepo.save(workout);

    return this.workoutRepo.findOne({
      where: { id },
      relations: { createdBy: true, assignedTo: true },
    });
  }

  async remove(id: string, userId: string, userRole: string): Promise<void> {
    const workout = await this.workoutRepo.findOne({ where: { id } });

    if (!workout) throw new NotFoundException('Workout not found');

    if (userRole === 'trainer' && workout.createdById !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.workoutRepo.delete(id);
  }

  async addExerciseFromLibrary(
    workoutId: string,
    exerciseId: string,
    details: { sets: number; reps: string; rest?: string; notes?: string },
    userId: string,
    userRole: string,
  ): Promise<Workout> {
    const workout = await this.workoutRepo.findOne({
      where: { id: workoutId },
      relations: { assignedTo: true },
    });
    if (!workout) throw new NotFoundException('Treino não encontrado');

    if (userRole === 'trainer' && workout.createdById !== userId) {
      throw new ForbiddenException('Apenas o criador do treino pode adicionar exercícios');
    }

    const exercise = await this.exerciseRepo.findOne({ where: { id: exerciseId } });
    if (!exercise) throw new NotFoundException('Exercício não encontrado na biblioteca');

    const item = {
      exerciseId: exercise.id,
      name: exercise.name,
      sets: details.sets,
      reps: details.reps,
      rest: details.rest,
      notes: details.notes,
    };

    workout.exercises = [...(workout.exercises ?? []), item];
    return this.workoutRepo.save(workout);
  }

  async removeExerciseFromWorkout(
    workoutId: string,
    exerciseIndex: number,
    userId: string,
    userRole: string,
  ): Promise<Workout> {
    const workout = await this.workoutRepo.findOne({ where: { id: workoutId } });
    if (!workout) throw new NotFoundException('Treino não encontrado');

    if (userRole === 'trainer' && workout.createdById !== userId) {
      throw new ForbiddenException('Apenas o criador do treino pode remover exercícios');
    }

    workout.exercises = workout.exercises.filter((_, i) => i !== exerciseIndex);
    return this.workoutRepo.save(workout);
  }

  async markAsCompleted(id: string, userId: string): Promise<Workout> {
    const workout = await this.workoutRepo
      .createQueryBuilder('workout')
      .leftJoinAndSelect('workout.assignedTo', 'user')
      .where('workout.id = :id', { id })
      .getOne();

    if (!workout) throw new NotFoundException('Workout not found');

    const isAssigned = workout.assignedTo.some(u => u.id === userId);
    const isCreator = workout.createdById === userId;
    if (!isAssigned && !isCreator) {
      throw new ForbiddenException('Access denied');
    }

    workout.completed = true;
    workout.completedAt = new Date();

    return this.workoutRepo.save(workout);
  }
}
