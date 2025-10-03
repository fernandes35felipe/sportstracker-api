import { Injectable, UnauthorizedException, BadRequestException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { User } from "../users/entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByEmail(email);

    if (user && (await bcrypt.compare(pass, user.password))) {
      // Retorna o usuário sem a senha
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const payload = {
      email: user.email,
      userId: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password, name, role } = registerDto;
    const existingUser = await this.usersService.findByEmail(email);

    if (existingUser) {
      throw new BadRequestException("User with this email already exists");
    }

    const adminOrTrainerCount = await this.usersService.countAdminsOrTrainers();

    // Se não houver admins/trainers, o primeiro usuário registrado se torna 'admin'
    // Caso contrário, o registro só é permitido se for via Treinador (lógica do Controller)
    const newRole = adminOrTrainerCount === 0 ? "admin" : role || "athlete";

    const newUser = await this.usersService.create({
      email,
      password,
      name,
      role: newRole,
    });

    // Retorna o usuário, mas remove a senha para o front-end
    const { password: _, ...result } = newUser;
    return result as User;
  }

  async resetPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Lógica real: Gerar token, enviar e-mail com link.
    // Simulação: Apenas confirma o pedido.
    return { message: "Password reset link sent to email (simulation)." };
  }
}
