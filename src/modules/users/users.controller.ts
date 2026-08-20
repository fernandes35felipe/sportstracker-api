import {
  Controller,
  Get,
  Patch,
  Post,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
  Res,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  getProfile(@Request() req: any) {
    return this.usersService.findOne(req.user.userId);
  }

  @Get('search')
  search(@Query('q') q: string, @Request() req: any) {
    if (!q || q.trim().length < 2) return [];
    return this.usersService.search(q.trim(), req.user.userId);
  }

  @Get('trainers')
  findTrainers() {
    return this.usersService.findByRole('trainer');
  }

  @Get('trainer/:trainerId/athletes')
  findAthletesByTrainer(@Param('trainerId') trainerId: string) {
    return this.usersService.findAthletesByTrainer(trainerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Post(':id/avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Apenas imagens são permitidas'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo de imagem é obrigatório');
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    return this.usersService.update(id, { avatar: avatarUrl } as any);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ── LGPD endpoints ───────────────────────────────────────────────────────────

  @Get('me/export')
  async exportData(@Request() req: any, @Res() res: Response) {
    const data = await this.usersService.exportUserData(req.user.userId);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="meus-dados-${req.user.userId}.json"`);
    res.send(JSON.stringify(data, null, 2));
  }

  @Delete('me')
  async deleteMe(@Request() req: any) {
    await this.usersService.anonymizeUser(req.user.userId);
    return { ok: true, message: 'Conta anonimizada com sucesso.' };
  }

  @Patch('me/consent')
  async recordConsent(@Request() req: any) {
    await this.usersService.recordConsent(req.user.userId);
    return { ok: true, consentedAt: new Date().toISOString() };
  }
}
