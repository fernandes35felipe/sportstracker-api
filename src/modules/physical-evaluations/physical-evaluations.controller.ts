import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomUUID } from 'crypto';
import { PhysicalEvaluationsService } from './physical-evaluations.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('physical-evaluations')
@UseGuards(JwtAuthGuard)
export class PhysicalEvaluationsController {
  constructor(private readonly service: PhysicalEvaluationsService) {}

  @Get('templates')
  getTemplates() {
    return this.service.getTemplates();
  }

  @Post()
  create(@Request() req: any, @Body() dto: CreateEvaluationDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Get()
  findByAthlete(@Query('athleteId') athleteId: string) {
    if (!athleteId) throw new BadRequestException('athleteId é obrigatório');
    return this.service.findByAthlete(athleteId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateEvaluationDto) {
    return this.service.update(id, req.user.userId, dto);
  }

  @Post(':id/documents')
  @UseInterceptors(
    FileInterceptor('document', {
      storage: diskStorage({
        destination: './uploads/evaluations',
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 20 * 1024 * 1024 },
    }),
  )
  async uploadDocument(
    @Param('id') id: string,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Arquivo é obrigatório');
    const documentUrl = `/uploads/evaluations/${file.filename}`;
    return this.service.addDocument(id, req.user.userId, documentUrl);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(id, req.user.userId);
  }
}
