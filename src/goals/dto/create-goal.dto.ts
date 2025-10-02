import { IsNotEmpty, IsString, IsOptional, IsIn, IsNumber, IsDateString } from "class-validator";

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(["strength", "endurance", "body-composition", "skill"])
  category: "strength" | "endurance" | "body-composition" | "skill";

  @IsNumber()
  @IsNotEmpty()
  target: number;

  @IsNumber()
  @IsOptional()
  current?: number;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsDateString()
  @IsNotEmpty()
  deadline: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(["high", "medium", "low"])
  priority: "high" | "medium" | "low";

  @IsNumber()
  @IsNotEmpty()
  athleteId: number;
}
