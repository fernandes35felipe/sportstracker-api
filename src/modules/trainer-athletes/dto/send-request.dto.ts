import { IsString, IsOptional } from 'class-validator';

export class SendRequestDto {
  @IsString()
  trainerId: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  message?: string;
}
