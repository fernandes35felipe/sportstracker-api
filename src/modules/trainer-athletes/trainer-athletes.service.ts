import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TrainerAthleteRelation } from './entities/trainer-athlete-relation.entity';
import { UsersService } from '../users/users.service';
import { CreateRelationDto } from './dto/create-relation.dto';

@Injectable()
export class TrainerAthletesService {
  constructor(
    @InjectRepository(TrainerAthleteRelation)
    private relationRepo: Repository<TrainerAthleteRelation>,
    private usersService: UsersService,
  ) {}

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
      status: dto.status ?? 'active',
    });
    return this.relationRepo.save(relation);
  }

  async getMyAthletes(trainerId: string) {
    const relations = await this.relationRepo.find({
      where: { trainerId, status: 'active' },
    });
    const athletes = await Promise.all(
      relations.map(async (r) => {
        try {
          const user = await this.usersService.findOne(r.athleteId);
          return { ...user, relationId: r.id };
        } catch {
          return null;
        }
      }),
    );
    return athletes.filter(Boolean);
  }

  async getMyTrainers(athleteId: string) {
    const relations = await this.relationRepo.find({
      where: { athleteId, status: 'active' },
    });
    const trainers = await Promise.all(
      relations.map(async (r) => {
        try {
          const user = await this.usersService.findOne(r.trainerId);
          return { ...user, relationId: r.id };
        } catch {
          return null;
        }
      }),
    );
    return trainers.filter(Boolean);
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
}
