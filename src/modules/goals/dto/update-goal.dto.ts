import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['strength', 'endurance', 'body-composition', 'skill'])
  category?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: string;

  @IsOptional()
  @IsNumber()
  target?: number;

  @IsOptional()
  @IsNumber()
  current?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsEnum(['active', 'completed', 'paused'])
  status?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}