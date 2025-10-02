import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Goal } from "./entities/goal.entity";
import { CreateGoalDto } from "./dto/create-goal.dto";
import { UpdateGoalProgressDto } from "./dto/update-goal-progress.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal)
    private goalsRepository: Repository<Goal>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(createGoalDto: CreateGoalDto): Promise<Goal> {
    const { athleteId, ...goalData } = createGoalDto;

    const athlete = await this.usersRepository.findOne({ where: { id: athleteId } });

    if (!athlete) {
      throw new NotFoundException(`Athlete with ID ${athleteId} not found`);
    }

    const newGoal = this.goalsRepository.create({
      ...goalData,
      athlete,
      current: goalData.current || 0,
      status: "active",
    });

    return this.goalsRepository.save(newGoal);
  }

  async findAll(): Promise<Goal[]> {
    return this.goalsRepository.find({ relations: ["athlete"] });
  }

  async findOne(id: number): Promise<Goal> {
    const goal = await this.goalsRepository.findOne({
      where: { id },
      relations: ["athlete"],
    });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }
    return goal;
  }

  async findByAthlete(athleteId: number): Promise<Goal[]> {
    return this.goalsRepository.find({
      where: { athlete: { id: athleteId } },
      relations: ["athlete"],
      order: {
        deadline: "ASC",
      },
    });
  }

  async updateProgress(id: number, updateGoalProgressDto: UpdateGoalProgressDto): Promise<Goal> {
    const goal = await this.goalsRepository.findOne({ where: { id } });

    if (!goal) {
      throw new NotFoundException(`Goal with ID ${id} not found`);
    }

    const newCurrent = updateGoalProgressDto.current;
    let newStatus = goal.status;

    if (updateGoalProgressDto.isComplete) {
      newStatus = "completed";
    } else {
      // Define status based on target reach, considering endurance goals (tempo menor é melhor)
      const targetReached =
        goal.category === "endurance" && goal.unit.toLowerCase().includes("minuto") ? newCurrent <= goal.target : newCurrent >= goal.target;

      if (targetReached) {
        newStatus = "completed";
      }
    }

    // Atualiza o progresso e o status
    goal.current = newCurrent;
    goal.status = newStatus;

    return this.goalsRepository.save(goal);
  }

  async remove(id: number): Promise<void> {
    await this.goalsRepository.delete(id);
  }
}
