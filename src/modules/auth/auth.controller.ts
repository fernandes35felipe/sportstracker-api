import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  @UseGuards(JwtAuthGuard)
  @Post('validate')
  validate(@Request() req: Express.Request & { user: unknown }) {
    return { valid: true, user: req.user };
  }
}
