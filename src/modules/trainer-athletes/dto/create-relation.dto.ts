import { IsString, IsOptional } from 'class-validator';

export class CreateRelationDto {
  @IsString()
  athleteId: string;

  @IsString()
  @IsOptional()
  status?: string;
}
