import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Exercise } from "./entities/exercise.entity";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exercisesRepository: Repository<Exercise>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    const { trainerId, ...exerciseData } = createExerciseDto;

    const trainer = await this.usersRepository.findOne({ where: { id: trainerId } });

    if (!trainer || trainer.role !== "trainer") {
      throw new UnauthorizedException("Somente treinadores podem criar exercícios personalizados.");
    }

    const newExercise = this.exercisesRepository.create({
      ...exerciseData,
      trainer,
    });

    return this.exercisesRepository.save(newExercise);
  }

  async findAll(): Promise<Exercise[]> {
    return this.exercisesRepository.find({ relations: ["trainer"] });
  }

  async findOne(id: number): Promise<Exercise> {
    const exercise = await this.exercisesRepository.findOne({
      where: { id },
      relations: ["trainer"],
    });

    if (!exercise) {
      throw new NotFoundException(`Exercise with ID ${id} not found`);
    }
    return exercise;
  }

  async findByTrainer(trainerId: number): Promise<Exercise[]> {
    return this.exercisesRepository.find({
      where: { trainer: { id: trainerId } },
      relations: ["trainer"],
    });
  }

  async remove(id: number): Promise<void> {
    await this.exercisesRepository.delete(id);
  }
}
