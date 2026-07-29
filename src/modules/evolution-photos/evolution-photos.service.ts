import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EvolutionPhoto } from './entities/evolution-photo.entity';

@Injectable()
export class EvolutionPhotosService {
  constructor(
    @InjectRepository(EvolutionPhoto)
    private photoRepo: Repository<EvolutionPhoto>,
  ) {}

  async create(
    uploadedBy: string,
    athleteId: string,
    photoUrl: string,
    caption?: string,
    category?: string,
  ): Promise<EvolutionPhoto> {
    const photo = this.photoRepo.create({ uploadedBy, athleteId, photoUrl, caption, category });
    return this.photoRepo.save(photo);
  }

  async findByAthlete(athleteId: string): Promise<EvolutionPhoto[]> {
    return this.photoRepo.find({
      where: { athleteId },
      order: { takenAt: 'DESC' },
    });
  }

  async remove(id: string, requesterId: string): Promise<void> {
    const photo = await this.photoRepo.findOne({ where: { id } });
    if (!photo) throw new NotFoundException('Foto não encontrada');
    if (photo.uploadedBy !== requesterId && photo.athleteId !== requesterId) {
      throw new ForbiddenException('Sem permissão para excluir esta foto');
    }
    await this.photoRepo.delete(id);
  }
}
