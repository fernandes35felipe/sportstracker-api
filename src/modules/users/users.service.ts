import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
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
}
