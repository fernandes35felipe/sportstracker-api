import { IsString, IsEnum, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty: string;

  @IsArray()
  muscleGroups: string[];

  @IsString()
  equipment: string;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  instructions?: string[];

  @IsOptional()
  @IsArray()
  tips?: string[];

  @IsOptional()
  @IsBoolean()
  isCustom?: boolean;
}