import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Workout } from "./entities/workout.entity";
import { CreateWorkoutDto } from "./dto/create-workout.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class WorkoutsService {
  constructor(
    @InjectRepository(Workout)
    private workoutsRepository: Repository<Workout>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    const { athleteId, ...workoutData } = createWorkoutDto;

    const athlete = await this.usersRepository.findOne({ where: { id: athleteId } });

    if (!athlete) {
      throw new NotFoundException(`Athlete with ID ${athleteId} not found`);
    }

    const newWorkout = this.workoutsRepository.create({
      ...workoutData,
      athlete,
    });

    return this.workoutsRepository.save(newWorkout);
  }

  async findAll(): Promise<Workout[]> {
    return this.workoutsRepository.find({ relations: ["athlete"] });
  }

  async findOne(id: number): Promise<Workout> {
    const workout = await this.workoutsRepository.findOne({
      where: { id },
      relations: ["athlete"],
    });

    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`);
    }
    return workout;
  }

  async findByAthlete(athleteId: number): Promise<Workout[]> {
    return this.workoutsRepository.find({
      where: { athlete: { id: athleteId } },
      relations: ["athlete"],
    });
  }

  async remove(id: number): Promise<void> {
    await this.workoutsRepository.delete(id);
  }
}
