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
      secretOrKey: configService.get<string>('JWT_SECRET') || 'DO_NOT_USE_THIS_IN_PRODUCTION_SECRET_KEY',
    });
  }

  async validate(payload: { sub: string; email: string; role?: string }) {
    let dbUser = await this.userRepo.findOne({ where: { id: payload.sub } });

    if (!dbUser) {
      // User provisioned by another service (e.g. Pensieve) — create in shared DB
      // to avoid FK violations when they interact with sports resources.
      try {
        dbUser = await this.userRepo.save({
          id: payload.sub,
          email: payload.email,
          role: 'athlete',
          isActive: true,
        });
      } catch {
        // Race condition or email already exists with a different id — re-fetch
        dbUser = await this.userRepo.findOne({ where: { id: payload.sub } })
          ?? await this.userRepo.findOne({ where: { email: payload.email } });
      }
    }

    return {
      userId: payload.sub,
      email: payload.email,
      role: dbUser?.role ?? payload.role ?? 'athlete',
      isTrainer: dbUser?.isTrainer ?? false,
    };
  }
}
