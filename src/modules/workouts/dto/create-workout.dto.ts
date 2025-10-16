import { IsString, IsArray, IsOptional, IsEnum, ValidateNested, IsDateString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ExerciseItemDto {
  @IsString()
  name: string;

  @IsString()
  sets: number;

  @IsString()
  reps: string;

  @IsOptional()
  @IsString()
  rest?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateWorkoutDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  duration?: string;

  @IsOptional()
  @IsString()
  restTime?: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty: string;

  @IsString()
  category: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseItemDto)
  exercises: ExerciseItemDto[];

  @IsOptional()
  @IsArray()
  assignedTo?: string[];

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}