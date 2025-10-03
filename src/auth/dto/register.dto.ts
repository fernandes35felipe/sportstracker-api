import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsIn } from "class-validator";

export class RegisterDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsIn(["athlete", "trainer"])
  role?: "athlete" | "trainer";

  @IsOptional()
  trainerId?: number;
}
