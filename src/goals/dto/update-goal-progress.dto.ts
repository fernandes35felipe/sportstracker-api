import { IsNotEmpty, IsNumber, IsOptional, IsBoolean } from "class-validator";

export class UpdateGoalProgressDto {
  @IsNumber()
  @IsNotEmpty()
  current: number;

  @IsBoolean()
  @IsOptional()
  isComplete?: boolean;
}
