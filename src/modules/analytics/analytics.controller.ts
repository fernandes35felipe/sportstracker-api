import { Controller, Get, UseGuards, Request, Query } from '@nestjs/common';

import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('stats')
  getUserStats(@Request() req) {
    return this.analyticsService.getUserStats(req.user.userId);
  }

  @Get('trends')
  getWorkoutTrends(@Request() req, @Query('days') days?: number) {
    return this.analyticsService.getWorkoutTrends(req.user.userId, days ? parseInt(days.toString()) : 30);
  }

  @Get('goals/progress')
  getGoalProgress(@Request() req) {
    return this.analyticsService.getGoalProgress(req.user.userId);
  }

  @Get('categories')
  getCategoryDistribution(@Request() req) {
    return this.analyticsService.getCategoryDistribution(req.user.userId);
  }
}