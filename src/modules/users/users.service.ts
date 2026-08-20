import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { DataSource, Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const { goals: _goals, password, ...updateData } = updateUserDto as any;

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepo.delete(id);
  }

  async findAthletesByTrainer(trainerId: string): Promise<User[]> {
    return this.userRepo.find({ where: { role: 'athlete', trainerId } });
  }

  async findByRole(role: string): Promise<User[]> {
    return this.userRepo.find({ where: { role } });
  }

  async search(q: string, excludeId?: string): Promise<User[]> {
    const results = await this.userRepo.find({
      where: [
        { fullName: ILike(`%${q}%`) },
        { email: ILike(`%${q}%`) },
        { id: q },
      ],
      take: 20,
    });
    if (excludeId) return results.filter((u) => u.id !== excludeId);
    return results;
  }

  // ── LGPD ─────────────────────────────────────────────────────────────────────

  async recordConsent(userId: string): Promise<void> {
    await this.userRepo.update(userId, { lgpdConsentAt: new Date() } as any);
  }

  async exportUserData(userId: string): Promise<Record<string, unknown>> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) return {};

    const qr = this.dataSource.createQueryRunner();
    const [workouts, goals, physicalEvaluations, evolutionPhotos] = await Promise.all([
      qr.query('SELECT * FROM workouts WHERE user_id = $1', [userId]),
      qr.query('SELECT * FROM goals WHERE user_id = $1', [userId]),
      qr.query('SELECT * FROM physical_evaluations WHERE user_id = $1', [userId]).catch(() => []),
      qr.query('SELECT * FROM evolution_photos WHERE user_id = $1', [userId]).catch(() => []),
    ]);

    return {
      exportedAt: new Date().toISOString(),
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, createdAt: user.createdAt },
      workouts,
      goals,
      physicalEvaluations,
      evolutionPhotos,
    };
  }

  async anonymizeUser(userId: string): Promise<void> {
    const anon = `anon_${userId.substring(0, 8)}`;
    await this.dataSource.query(
      `UPDATE users SET email = $1, full_name = $2, password = $3, bio = NULL, avatar = NULL, pix_key = NULL, deleted_at = NOW() WHERE id = $4`,
      [`${anon}@deleted.invalid`, anon, 'ANONYMIZED', userId],
    );
  }
}
