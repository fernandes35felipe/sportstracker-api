import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TrainerAthletesService } from './trainer-athletes.service';
import { CreateRelationDto } from './dto/create-relation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('trainer-athletes')
@UseGuards(JwtAuthGuard)
export class TrainerAthletesController {
  constructor(private readonly service: TrainerAthletesService) {}

  @Post()
  addAthlete(
    @Request() req: any,
    @Body() dto: CreateRelationDto,
  ) {
    return this.service.addAthlete(req.user.userId, dto);
  }

  @Get('my-athletes')
  getMyAthletes(@Request() req: any) {
    return this.service.getMyAthletes(req.user.userId);
  }

  @Get('my-trainers')
  getMyTrainers(@Request() req: any) {
    return this.service.getMyTrainers(req.user.userId);
  }

  @Delete(':id')
  removeRelation(@Param('id') id: string, @Request() req: any) {
    return this.service.removeRelation(id, req.user.userId);
  }
}
