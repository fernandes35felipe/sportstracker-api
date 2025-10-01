import { IsEmail, IsNotEmpty, IsString, IsOptional, IsIn, IsNumber } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  @IsIn(["athlete", "trainer"])
  role?: "athlete" | "trainer";

  @IsNumber()
  @IsOptional()
  trainerId?: number;
}
