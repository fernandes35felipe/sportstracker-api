// src/modules/users/users.service.ts

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
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
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password').exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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
  }

  // **** CORREÇÃO APLICADA AQUI ****
  async findAthletesByTrainer(trainerId: string): Promise<User[]> {
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
  }
}
