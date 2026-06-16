import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Workout } from './entities/workout.entity';
import { User } from '../users/entities/user.entity';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';

@Injectable()
export class WorkoutsService {
<<<<<<< HEAD
  constructor(
    @InjectRepository(Workout) private workoutRepo: Repository<Workout>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}
=======
  constructor(@InjectModel(Workout.name) private workoutModel: Model<WorkoutDocument>) {}
>>>>>>> 27f890729c5ac5714e3d14cec67a1ddf10debe40

  async create(createWorkoutDto: CreateWorkoutDto, userId: string): Promise<Workout> {
    const { assignedTo: assignedToIds, ...rest } = createWorkoutDto;

    const workout = this.workoutRepo.create({ ...rest, createdById: userId });
    workout.assignedTo = assignedToIds?.length
      ? await this.userRepo.findBy({ id: In(assignedToIds) })
      : [];

    return this.workoutRepo.save(workout);
  }

  async findAll(userId: string, userRole: string): Promise<Workout[]> {
    if (userRole === 'trainer') {
      return this.workoutRepo.find({
        where: { createdById: userId },
        relations: { createdBy: true, assignedTo: true },
      });
    }

    return this.workoutRepo
      .createQueryBuilder('workout')
      .leftJoinAndSelect('workout.createdBy', 'creator')
      .innerJoin('workout.assignedTo', 'assigned', 'assigned.id = :userId', { userId })
      .getMany();
  }

  async findOne(id: string, userId: string, userRole: string): Promise<Workout> {
    const workout = await this.workoutRepo.findOne({
      where: { id },
      relations: { createdBy: true, assignedTo: true },
    });

    if (!workout) throw new NotFoundException('Workout not found');

<<<<<<< HEAD
    if (userRole === 'trainer' && workout.createdById !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === 'athlete' && !workout.assignedTo.some(u => u.id === userId)) {
=======
    // normalize createdBy to an id string whether it's populated (object with _id) or an ObjectId
    const creatorId =
      (workout.createdBy as any)?._id?.toString() ?? (workout.createdBy as any)?.toString();

    if (userRole === 'trainer' && creatorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    if (userRole === 'athlete' && !workout.assignedTo.some((id) => id.toString() === userId)) {
>>>>>>> 27f890729c5ac5714e3d14cec67a1ddf10debe40
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
<<<<<<< HEAD
    const workout = await this.workoutRepo.findOne({
      where: { id },
      relations: { assignedTo: true },
    });
=======
    const workout = await this.workoutModel.findById(id);
>>>>>>> 27f890729c5ac5714e3d14cec67a1ddf10debe40

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

  async markAsCompleted(id: string, userId: string): Promise<Workout> {
    const workout = await this.workoutRepo
      .createQueryBuilder('workout')
      .leftJoinAndSelect('workout.assignedTo', 'user')
      .where('workout.id = :id', { id })
      .getOne();

    if (!workout) throw new NotFoundException('Workout not found');

<<<<<<< HEAD
    if (!workout.assignedTo.some(u => u.id === userId)) {
=======
    if (!workout.assignedTo.some((assignedId) => assignedId.toString() === userId)) {
>>>>>>> 27f890729c5ac5714e3d14cec67a1ddf10debe40
      throw new ForbiddenException('Access denied');
    }

    workout.completed = true;
    workout.completedAt = new Date();

    return this.workoutRepo.save(workout);
  }
}
