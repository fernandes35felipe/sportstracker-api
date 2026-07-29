import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('WALLET_API_SECRET') || configService.get<string>('JWT_SECRET') || 'DO_NOT_USE_THIS_IN_PRODUCTION_SECRET_KEY',
    });
  }

  async validate(payload: { sub: string; email: string; role?: string }) {
    // Always read role from DB so role changes take effect without re-login
    const dbUser = await this.userRepo.findOne({ where: { id: payload.sub } });
    return {
      userId: payload.sub,
      email: payload.email,
      role: dbUser?.role ?? payload.role ?? 'athlete',
      isTrainer: dbUser?.isTrainer ?? false,
    };
  }
}
