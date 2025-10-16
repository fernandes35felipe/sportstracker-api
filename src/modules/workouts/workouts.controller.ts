import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';

import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Post()
  create(@Body() createWorkoutDto: CreateWorkoutDto, @Request() req) {
    return this.workoutsService.create(createWorkoutDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.workoutsService.findAll(req.user.userId, req.user.role);
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

  @Patch(':id/complete')
  markAsCompleted(@Param('id') id: string, @Request() req) {
    return this.workoutsService.markAsCompleted(id, req.user.userId);
  }
}