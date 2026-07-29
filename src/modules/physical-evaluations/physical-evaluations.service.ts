import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhysicalEvaluation } from './entities/physical-evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class PhysicalEvaluationsService {
  constructor(
    @InjectRepository(PhysicalEvaluation)
    private evalRepo: Repository<PhysicalEvaluation>,
  ) {}

  async create(trainerId: string, dto: CreateEvaluationDto): Promise<PhysicalEvaluation> {
    const evaluation = this.evalRepo.create({
      ...dto,
      trainerId,
      documentUrls: [],
    });
    return this.evalRepo.save(evaluation);
  }

  async findByAthlete(athleteId: string): Promise<PhysicalEvaluation[]> {
    return this.evalRepo.find({
      where: { athleteId },
      order: { evaluationDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PhysicalEvaluation> {
    const evaluation = await this.evalRepo.findOne({ where: { id } });
    if (!evaluation) throw new NotFoundException('Avaliação não encontrada');
    return evaluation;
  }

  async update(id: string, trainerId: string, dto: UpdateEvaluationDto): Promise<PhysicalEvaluation> {
    const evaluation = await this.findOne(id);
    if (evaluation.trainerId !== trainerId) {
      throw new ForbiddenException('Apenas o treinador pode editar esta avaliação');
    }
    Object.assign(evaluation, dto);
    return this.evalRepo.save(evaluation);
  }

  async addDocument(id: string, trainerId: string, documentUrl: string): Promise<PhysicalEvaluation> {
    const evaluation = await this.findOne(id);
    if (evaluation.trainerId !== trainerId) {
      throw new ForbiddenException('Apenas o treinador pode adicionar documentos');
    }
    evaluation.documentUrls = [...(evaluation.documentUrls ?? []), documentUrl];
    return this.evalRepo.save(evaluation);
  }

  async remove(id: string, trainerId: string): Promise<void> {
    const evaluation = await this.findOne(id);
    if (evaluation.trainerId !== trainerId) {
      throw new ForbiddenException('Apenas o treinador pode excluir esta avaliação');
    }
    await this.evalRepo.delete(id);
  }
}
