import { IsString, IsOptional, IsObject, IsDateString } from 'class-validator';

export class UpdateEvaluationDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  measurements?: Record<string, any>;

  @IsDateString()
  @IsOptional()
  evaluationDate?: string;
}
