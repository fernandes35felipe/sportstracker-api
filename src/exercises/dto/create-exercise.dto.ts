import { IsNotEmpty, IsString, IsOptional, IsIn, IsNumber, IsArray, ArrayMinSize } from "class-validator";

export class CreateExerciseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  muscleGroup: string;

  @IsString()
  @IsNotEmpty()
  equipment: string;

  @IsString()
  @IsOptional()
  @IsIn(["beginner", "intermediate", "advanced"])
  difficulty?: "beginner" | "intermediate" | "advanced";

  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  instructions: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tips?: string[];

  @IsNumber()
  @IsNotEmpty()
  trainerId: number;
}
