import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe } from "@nestjs/common";
import { WorkoutsService } from "./workouts.service";
import { CreateWorkoutDto } from "./dto/create-workout.dto";
import { Workout } from "./entities/workout.entity";

@Controller("workouts")
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    return this.workoutsService.create(createWorkoutDto);
  }

  @Get()
  findAll(): Promise<Workout[]> {
    return this.workoutsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Workout> {
    return this.workoutsService.findOne(+id);
  }

  @Get("by-athlete/:athleteId")
  findByAthlete(@Param("athleteId") athleteId: string): Promise<Workout[]> {
    return this.workoutsService.findByAthlete(+athleteId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string): Promise<void> {
    return this.workoutsService.remove(+id);
  }
}
