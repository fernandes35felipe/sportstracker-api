import { IsString, IsOptional, IsObject, IsDateString } from 'class-validator';

export class CreateEvaluationDto {
  @IsString()
  athleteId: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  measurements?: Record<string, any>;

  @IsDateString()
  @IsOptional()
  evaluationDate?: string;

  @IsString()
  @IsOptional()
  sportType?: string;

  @IsString()
  @IsOptional()
  templateKey?: string;
}
