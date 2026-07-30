import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainerAthleteRelation } from './entities/trainer-athlete-relation.entity';
import { UsersService } from '../users/users.service';
import { CreateRelationDto } from './dto/create-relation.dto';
import { SendRequestDto } from './dto/send-request.dto';

@Injectable()
export class TrainerAthletesService {
  constructor(
    @InjectRepository(TrainerAthleteRelation)
    private relationRepo: Repository<TrainerAthleteRelation>,
    private usersService: UsersService,
  ) {}

  // Trainer directly adds an athlete (by ID/email search result)
  async addAthlete(trainerId: string, dto: CreateRelationDto): Promise<TrainerAthleteRelation> {
    const existing = await this.relationRepo.findOne({
      where: { trainerId, athleteId: dto.athleteId },
    });
    if (existing) {
      existing.status = 'active';
      return this.relationRepo.save(existing);
    }
    const relation = this.relationRepo.create({
      trainerId,
      athleteId: dto.athleteId,
      status: 'active',
    });
    return this.relationRepo.save(relation);
  }

  // Athlete sends a connection request to a trainer
  async sendRequest(athleteId: string, dto: SendRequestDto): Promise<TrainerAthleteRelation> {
    const existing = await this.relationRepo.findOne({
      where: { trainerId: dto.trainerId, athleteId },
    });
    if (existing && existing.status === 'active') {
      throw new ConflictException('Você já está vinculado a este treinador');
    }
    if (existing && existing.status === 'pending') {
      throw new ConflictException('Você já enviou uma solicitação para este treinador');
    }
    if (existing) {
      // Re-send if previously rejected
      existing.status = 'pending';
      existing.phone = dto.phone;
      existing.message = dto.message;
      return this.relationRepo.save(existing);
    }
    const relation = this.relationRepo.create({
      trainerId: dto.trainerId,
      athleteId,
      status: 'pending',
      phone: dto.phone,
      message: dto.message,
    });
    return this.relationRepo.save(relation);
  }

  // Trainer gets pending requests
  async getPendingRequests(trainerId: string) {
    const relations = await this.relationRepo.find({
      where: { trainerId, status: 'pending' },
      order: { createdAt: 'DESC' },
    });
    const results = await Promise.all(
      relations.map(async (r) => {
        try {
          const user = await this.usersService.findOne(r.athleteId);
          return {
            relationId: r.id,
            phone: r.phone,
            message: r.message,
            createdAt: r.createdAt,
            athlete: user,
          };
        } catch {
          return null;
        }
      }),
    );
    return results.filter(Boolean);
  }

  // Trainer accepts a request
  async acceptRequest(id: string, trainerId: string): Promise<TrainerAthleteRelation> {
    const relation = await this.relationRepo.findOne({ where: { id } });
    if (!relation) throw new NotFoundException('Solicitação não encontrada');
    if (relation.trainerId !== trainerId) throw new ForbiddenException('Sem permissão');
    relation.status = 'active';
    return this.relationRepo.save(relation);
  }

  // Trainer rejects a request
  async rejectRequest(id: string, trainerId: string): Promise<void> {
    const relation = await this.relationRepo.findOne({ where: { id } });
    if (!relation) throw new NotFoundException('Solicitação não encontrada');
    if (relation.trainerId !== trainerId) throw new ForbiddenException('Sem permissão');
    relation.status = 'rejected';
    await this.relationRepo.save(relation);
  }

  async getMyAthletes(trainerId: string) {
    const relations = await this.relationRepo.find({
      where: { trainerId, status: 'active' },
    });
    const athletes = await Promise.all(
      relations.map(async (r) => {
        try {
          const user = await this.usersService.findOne(r.athleteId);
          return {
            ...user,
            relationId: r.id,
            paymentStatus: r.paymentStatus ?? 'pendente',
            planName: r.planName ?? null,
            planValue: r.planValue != null ? Number(r.planValue) : null,
            adminNotes: r.adminNotes ?? null,
          };
        } catch {
          return null;
        }
      }),
    );
    return athletes.filter(Boolean);
  }

  async getMyTrainers(athleteId: string) {
    const relations = await this.relationRepo.find({
      where: { athleteId },
    });
    const trainers = await Promise.all(
      relations.map(async (r) => {
        try {
          const user = await this.usersService.findOne(r.trainerId);
          return {
            ...user,
            relationId: r.id,
            requestStatus: r.status,
            paymentStatus: r.paymentStatus ?? 'pendente',
            planName: r.planName ?? null,
            planValue: r.planValue != null ? Number(r.planValue) : null,
          };
        } catch {
          return null;
        }
      }),
    );
    return trainers.filter(Boolean);
  }

  async updateAdminDetails(
    id: string,
    trainerId: string,
    dto: { paymentStatus?: string; planName?: string; planValue?: number; adminNotes?: string },
  ): Promise<TrainerAthleteRelation> {
    const relation = await this.relationRepo.findOne({ where: { id } });
    if (!relation) throw new NotFoundException('Relação não encontrada');
    if (relation.trainerId !== trainerId) throw new ForbiddenException('Sem permissão');
    if (dto.paymentStatus !== undefined) relation.paymentStatus = dto.paymentStatus;
    if (dto.planName !== undefined) relation.planName = dto.planName;
    if (dto.planValue !== undefined) relation.planValue = dto.planValue;
    if (dto.adminNotes !== undefined) relation.adminNotes = dto.adminNotes;
    return this.relationRepo.save(relation);
  }

  async removeRelation(id: string, requesterId: string): Promise<void> {
    const relation = await this.relationRepo.findOne({ where: { id } });
    if (!relation) throw new NotFoundException('Relação não encontrada');
    if (relation.trainerId !== requesterId && relation.athleteId !== requesterId) {
      throw new ForbiddenException('Sem permissão para remover esta relação');
    }
    await this.relationRepo.delete(id);
  }

  async isRelated(trainerId: string, athleteId: string): Promise<boolean> {
    const relation = await this.relationRepo.findOne({
      where: { trainerId, athleteId, status: 'active' },
    });
    return !!relation;
  }

  // Athlete checks their request status with a specific trainer
  async getRequestStatus(athleteId: string, trainerId: string) {
    return this.relationRepo.findOne({ where: { trainerId, athleteId } });
  }
}
