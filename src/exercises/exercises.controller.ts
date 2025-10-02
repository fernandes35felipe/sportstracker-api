import { Controller, Get, Post, Body, Param, Delete, HttpCode, HttpStatus, UsePipes, ValidationPipe } from "@nestjs/common";
import { ExercisesService } from "./exercises.service";
import { CreateExerciseDto } from "./dto/create-exercise.dto";
import { Exercise } from "./entities/exercise.entity";

@Controller("exercises")
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createExerciseDto: CreateExerciseDto): Promise<Exercise> {
    return this.exercisesService.create(createExerciseDto);
  }

  @Get()
  findAll(): Promise<Exercise[]> {
    return this.exercisesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Exercise> {
    return this.exercisesService.findOne(+id);
  }

  @Get("by-trainer/:trainerId")
  findByTrainer(@Param("trainerId") trainerId: string): Promise<Exercise[]> {
    return this.exercisesService.findByTrainer(+trainerId);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id") id: string): Promise<void> {
    return this.exercisesService.remove(+id);
  }
}
