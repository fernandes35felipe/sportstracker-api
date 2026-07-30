import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe, Query } from '@nestjs/common';

import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) { }

  @Post()
  create(@Body() createWorkoutDto: CreateWorkoutDto, @Request() req) {
    return this.workoutsService.create(createWorkoutDto, req.user.userId, req.user.role);
  }

  @Get()
  findAll(@Request() req, @Query('athleteId') athleteId?: string) {
    return this.workoutsService.findAll(req.user.userId, req.user.role, athleteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.workoutsService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWorkoutDto: UpdateWorkoutDto, @Request() req) {
    return this.workoutsService.update(id, updateWorkoutDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.workoutsService.remove(id, req.user.userId, req.user.role);
  }

  @Post(':id/clone')
  clone(
    @Param('id') id: string,
    @Body() body: { targetAthleteIds?: string[] },
    @Request() req,
  ) {
    return this.workoutsService.clone(id, req.user.userId, req.user.role, body.targetAthleteIds);
  }

  @Patch(':id/complete')
  markAsCompleted(@Param('id') id: string, @Request() req) {
    return this.workoutsService.markAsCompleted(id, req.user.userId);
  }

  @Post(':id/exercises/from-library')
  addExerciseFromLibrary(
    @Param('id') id: string,
    @Body() body: { exerciseId: string; sets: number; reps: string; rest?: string; notes?: string },
    @Request() req,
  ) {
    return this.workoutsService.addExerciseFromLibrary(
      id, body.exerciseId, { sets: body.sets, reps: body.reps, rest: body.rest, notes: body.notes },
      req.user.userId, req.user.role,
    );
  }

  @Delete(':id/exercises/:index')
  removeExerciseFromWorkout(
    @Param('id') id: string,
    @Param('index', ParseIntPipe) index: number,
    @Request() req,
  ) {
    return this.workoutsService.removeExerciseFromWorkout(id, index, req.user.userId, req.user.role);
  }

  @Post(':id/exercise-logs')
  logExercises(
    @Param('id') id: string,
    @Body() body: { logs: { exerciseName: string; exerciseId?: string; weight?: number; actualReps?: string }[] },
    @Request() req,
  ) {
    return this.workoutsService.logExercises(id, req.user.userId, body.logs ?? []);
  }

  @Get('exercise-history')
  getExerciseHistory(@Request() req, @Query('exerciseName') exerciseName?: string) {
    return this.workoutsService.getExerciseHistory(req.user.userId, exerciseName);
  }
}