// src/modules/users/users.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
<<<<<<< HEAD
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findOne({ where: { email: createUserDto.email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = this.userRepo.create({ ...createUserDto, password: hashedPassword });
    return this.userRepo.save(user);
=======
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return createdUser.save();
>>>>>>> 27f890729c5ac5714e3d14cec67a1ddf10debe40
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
<<<<<<< HEAD
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
=======
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
>>>>>>> 27f890729c5ac5714e3d14cec67a1ddf10debe40
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
<<<<<<< HEAD
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const { goals: _goals, ...updateData } = updateUserDto as any;
    Object.assign(user, updateData);
    return this.userRepo.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepo.delete(id);
=======
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
>>>>>>> 27f890729c5ac5714e3d14cec67a1ddf10debe40
  }

  // **** CORREÇÃO APLICADA AQUI ****
  async findAthletesByTrainer(trainerId: string): Promise<User[]> {
<<<<<<< HEAD
    return this.userRepo.find({ where: { role: 'athlete', trainerId } });
=======
    // 1. Encontra o documento do treinador pelo seu ID.
    const trainer = await this.userModel.findById(trainerId).exec();
    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    // 2. Se o treinador não tiver atletas, retorna uma lista vazia.
    if (!trainer.athletes || trainer.athletes.length === 0) {
      return [];
    }

    // 3. Busca todos os usuários cujo _id está na lista de 'athletes' do treinador.
    //    Isso garante que apenas os atletas vinculados sejam retornados.
    return this.userModel
      .find({
        _id: { $in: trainer.athletes },
      })
      .select('-password') // Exclui a senha da resposta por segurança.
      .exec();
>>>>>>> 27f890729c5ac5714e3d14cec67a1ddf10debe40
  }
}
