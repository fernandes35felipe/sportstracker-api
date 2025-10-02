import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Request,
  ForbiddenException,
} from "@nestjs/common";
import { GoalsService } from "./goals.service";
import { CreateGoalDto } from "./dto/create-goal.dto";
import { UpdateGoalProgressDto } from "./dto/update-goal-progress.dto";
import { Goal } from "./entities/goal.entity";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { GetUser } from "../auth/get-user.decorator";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("goals")
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  @Roles("trainer") // Somente Treinadores podem criar metas
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createGoalDto: CreateGoalDto): Promise<Goal> {
    return this.goalsService.create(createGoalDto);
  }

  @Get()
  @Roles("trainer")
  findAll(): Promise<Goal[]> {
    return this.goalsService.findAll();
  }

  @Get("by-athlete/:athleteId")
  findByAthlete(
    @Param("athleteId") athleteId: string,
    @GetUser("role") role: string,
    @GetUser("userId") loggedInUserId: number
  ): Promise<Goal[]> {
    const targetAthleteId = +athleteId;

    if (role === "athlete" && targetAthleteId !== loggedInUserId) {
      throw new ForbiddenException("Access denied. Athletes can only view their own goals.");
    }

    return this.goalsService.findByAthlete(targetAthleteId);
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Goal> {
    return this.goalsService.findOne(+id);
  }

  @Put(":id/progress")
  @Roles("trainer", "athlete")
  updateProgress(@Param("id") id: string, @Body() updateGoalProgressDto: UpdateGoalProgressDto): Promise<Goal> {
    return this.goalsService.updateProgress(+id, updateGoalProgressDto);
  }

  @Delete(":id")
  @Roles("trainer") // Somente Treinadores podem remover metas
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string): Promise<void> {
    return this.goalsService.remove(+id);
  }
}
