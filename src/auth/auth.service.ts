import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      return user;
    }
    return null;
  }

  async login(email: string) {
    const user = await this.validateUser(email);

    if (!user) {
      throw new UnauthorizedException("Invalid credentials or user not found");
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
}
