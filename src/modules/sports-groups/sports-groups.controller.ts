import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SportsGroupsService } from './sports-groups.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('sports-groups')
@UseGuards(JwtAuthGuard)
export class SportsGroupsController {
  constructor(private readonly service: SportsGroupsService) {}

  @Post()
  createGroup(@Request() req: any, @Body() dto: any) {
    return this.service.createGroup(req.user.userId, dto);
  }

  @Get('my-groups')
  getMyGroups(@Request() req: any) {
    return this.service.getMyGroups(req.user.userId);
  }

  @Get(':id')
  getGroupById(@Param('id') id: string, @Request() req: any) {
    return this.service.getGroupById(id, req.user.userId);
  }

  @Patch(':id')
  updateGroup(@Param('id') id: string, @Request() req: any, @Body() dto: any) {
    return this.service.updateGroup(id, req.user.userId, dto);
  }

  @Delete(':id')
  deleteGroup(@Param('id') id: string, @Request() req: any) {
    return this.service.deleteGroup(id, req.user.userId);
  }

  // ── Members ──────────────────────────────────────────────────────────────

  @Post(':id/members')
  addMember(@Param('id') id: string, @Request() req: any, @Body() dto: any) {
    return this.service.addMember(id, req.user.userId, dto);
  }

  @Patch(':id/members/:memberId')
  updateMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Request() req: any,
    @Body() dto: any,
  ) {
    return this.service.updateMember(id, memberId, req.user.userId, dto);
  }

  @Delete(':id/members/:memberId')
  removeMember(
    @Param('id') id: string,
    @Param('memberId') memberId: string,
    @Request() req: any,
  ) {
    return this.service.removeMember(id, memberId, req.user.userId);
  }

  // ── Classes (Turmas) ──────────────────────────────────────────────────────

  @Post(':id/classes')
  createClass(@Param('id') id: string, @Request() req: any, @Body() dto: any) {
    return this.service.createClass(id, req.user.userId, dto);
  }

  @Patch(':id/classes/:classId')
  updateClass(
    @Param('id') id: string,
    @Param('classId') classId: string,
    @Request() req: any,
    @Body() dto: any,
  ) {
    return this.service.updateClass(id, classId, req.user.userId, dto);
  }

  @Delete(':id/classes/:classId')
  deleteClass(
    @Param('id') id: string,
    @Param('classId') classId: string,
    @Request() req: any,
  ) {
    return this.service.deleteClass(id, classId, req.user.userId);
  }

  @Post(':id/classes/:classId/enroll/:memberId')
  enrollMember(
    @Param('id') id: string,
    @Param('classId') classId: string,
    @Param('memberId') memberId: string,
    @Request() req: any,
  ) {
    return this.service.enrollMember(id, classId, memberId, req.user.userId);
  }

  @Delete(':id/classes/:classId/members/:memberId')
  unenrollMember(
    @Param('id') id: string,
    @Param('classId') classId: string,
    @Param('memberId') memberId: string,
    @Request() req: any,
  ) {
    return this.service.unenrollMember(id, classId, memberId, req.user.userId);
  }

  // ── Sessions ──────────────────────────────────────────────────────────────

  @Post(':id/sessions')
  createSession(@Param('id') id: string, @Request() req: any, @Body() dto: any) {
    return this.service.createSession(id, req.user.userId, dto);
  }

  @Delete(':id/sessions/:sessionId')
  deleteSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
    @Request() req: any,
  ) {
    return this.service.deleteSession(id, sessionId, req.user.userId);
  }
}
