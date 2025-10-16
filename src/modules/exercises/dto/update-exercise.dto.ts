import { IsString, IsEnum, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class UpdateExerciseDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(['beginner', 'intermediate', 'advanced'])
  difficulty?: string;

  @IsOptional()
  @IsArray()
  muscleGroups?: string[];

  @IsOptional()
  @IsString()
  equipment?: string;

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
  isActive?: boolean;
}