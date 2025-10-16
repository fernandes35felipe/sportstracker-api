import { IsString, IsEnum, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['strength', 'endurance', 'body-composition', 'skill'])
  category: string;

  @IsEnum(['low', 'medium', 'high'])
  priority: string;

  @IsNumber()
  target: number;

  @IsOptional()
  @IsNumber()
  current?: number;

  @IsString()
  unit: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;
}