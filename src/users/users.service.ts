import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "./entities/user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async create(user: Partial<User>): Promise<User> {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, salt);

    if (!user.role) {
      user.role = "athlete";
    }

    const newUser = this.usersRepository.create(user);
    return this.usersRepository.save(newUser);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async countAdminsOrTrainers(): Promise<number> {
    return this.usersRepository.count({
      where: [{ role: "trainer" }, { role: "admin" }],
    });
  }

  async findAthletesByTrainer(trainerId: number): Promise<User[]> {
    return this.usersRepository.find({
      where: {
        role: "athlete",
        trainerId: trainerId,
      },
      select: ["id", "name", "email", "role", "trainerId"],
    });
  }
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ["id", "name", "email", "role", "trainerId"],
    });
  }

  async remove(id: number): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
