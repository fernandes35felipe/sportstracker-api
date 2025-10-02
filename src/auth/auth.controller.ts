import { Controller, Post, Body, UnauthorizedException, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: { email: string }) {
    if (!body.email) {
      throw new UnauthorizedException("Email is required for login");
    }
    return this.authService.login(body.email);
  }

  @Post("test-protected")
  @HttpCode(HttpStatus.OK)
  async testProtected() {
    return { message: "This route is protected and you successfully sent a token!" };
  }
}
