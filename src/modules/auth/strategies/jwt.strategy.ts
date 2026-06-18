import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('WALLET_API_SECRET') || configService.get<string>('JWT_SECRET') || 'DO_NOT_USE_THIS_IN_PRODUCTION_SECRET_KEY',
    });
  }

  async validate(payload: { sub: string; email: string; role?: string }) {
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role ?? 'athlete',
    };
  }
}
