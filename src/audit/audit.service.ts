import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

export interface AuditLogDto {
  userId?: string;
  action: string;
  resource: string;
  ip?: string;
  userAgent?: string;
  statusCode?: number;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(data: AuditLogDto): Promise<void> {
    try {
      await this.repo.save(this.repo.create(data));
    } catch (err) {
      this.logger.error('Failed to write audit log', err?.message);
    }
  }

  async findByUser(userId: string, limit = 100): Promise<AuditLog[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' }, take: limit });
  }
}
