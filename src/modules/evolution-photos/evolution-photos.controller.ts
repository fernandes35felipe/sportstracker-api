import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { EvolutionPhotosService } from './evolution-photos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('evolution-photos')
@UseGuards(JwtAuthGuard)
export class EvolutionPhotosController {
  constructor(private readonly service: EvolutionPhotosService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/evolution',
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
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async upload(
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
    @Body('athleteId') athleteId: string,
    @Body('caption') caption?: string,
    @Body('category') category?: string,
  ) {
    if (!file) throw new BadRequestException('Arquivo de foto é obrigatório');
    if (!athleteId) throw new BadRequestException('athleteId é obrigatório');
    const photoUrl = `/uploads/evolution/${file.filename}`;
    return this.service.create(req.user.userId, athleteId, photoUrl, caption, category);
  }

  @Get()
  findByAthlete(@Query('athleteId') athleteId: string) {
    if (!athleteId) throw new BadRequestException('athleteId é obrigatório');
    return this.service.findByAthlete(athleteId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(id, req.user.userId);
  }
}
