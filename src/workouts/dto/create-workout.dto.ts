import { IsNotEmpty, IsString, IsOptional, IsIn, IsNumber, IsArray, ArrayMinSize, ValidateNested } from "class-validator";
import { ExerciseItem } from "../interfaces/workout-item.interface";
import { Type } from "class-transformer";

export class CreateWorkoutDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  restTime?: string;

  @IsString()
  @IsOptional()
  @IsIn(["beginner", "intermediate", "advanced"])
  difficulty?: "beginner" | "intermediate" | "advanced";

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => Object)
  exercisesList: ExerciseItem[];

  @IsNumber()
  @IsNotEmpty()
  athleteId: number;
}
