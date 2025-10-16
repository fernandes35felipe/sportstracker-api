import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';

import { GoalsService } from './goals.service';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Post()
  create(@Body() createGoalDto: CreateGoalDto, @Request() req) {
    return this.goalsService.create(createGoalDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req, @Query('status') status?: string) {
    if (status) {
      return this.goalsService.findByStatus(req.user.userId, status);
    }
    return this.goalsService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req) {
    return this.goalsService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoalDto: UpdateGoalDto, @Request() req) {
    return this.goalsService.update(id, updateGoalDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.goalsService.remove(id, req.user.userId);
  }

  @Patch(':id/progress')
  updateProgress(@Param('id') id: string, @Body('current') current: number, @Request() req) {
    return this.goalsService.updateProgress(id, current, req.user.userId);
  }
}