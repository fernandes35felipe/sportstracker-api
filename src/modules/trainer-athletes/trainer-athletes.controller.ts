import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { TrainerAthletesService } from './trainer-athletes.service';
import { CreateRelationDto } from './dto/create-relation.dto';
import { SendRequestDto } from './dto/send-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('trainer-athletes')
@UseGuards(JwtAuthGuard)
export class TrainerAthletesController {
  constructor(private readonly service: TrainerAthletesService) {}

  // Trainer directly adds athlete (by search result)
  @Post()
  addAthlete(@Request() req: any, @Body() dto: CreateRelationDto) {
    return this.service.addAthlete(req.user.userId, dto);
  }

  // Athlete sends a connection request to a trainer
  @Post('request')
  sendRequest(@Request() req: any, @Body() dto: SendRequestDto) {
    return this.service.sendRequest(req.user.userId, dto);
  }

  // Trainer gets pending requests
  @Get('pending')
  getPendingRequests(@Request() req: any) {
    return this.service.getPendingRequests(req.user.userId);
  }

  // Trainer accepts a request
  @Patch(':id/accept')
  acceptRequest(@Param('id') id: string, @Request() req: any) {
    return this.service.acceptRequest(id, req.user.userId);
  }

  // Trainer rejects a request
  @Patch(':id/reject')
  rejectRequest(@Param('id') id: string, @Request() req: any) {
    return this.service.rejectRequest(id, req.user.userId);
  }

  @Get('my-athletes')
  getMyAthletes(@Request() req: any) {
    return this.service.getMyAthletes(req.user.userId);
  }

  @Get('my-trainers')
  getMyTrainers(@Request() req: any) {
    return this.service.getMyTrainers(req.user.userId);
  }

  // Athlete checks request status with a specific trainer
  @Get('status/:trainerId')
  getRequestStatus(@Param('trainerId') trainerId: string, @Request() req: any) {
    return this.service.getRequestStatus(req.user.userId, trainerId);
  }

  @Delete(':id')
  removeRelation(@Param('id') id: string, @Request() req: any) {
    return this.service.removeRelation(id, req.user.userId);
  }
}
