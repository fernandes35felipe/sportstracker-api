import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ExerciseDocument = Exercise & Document;

@Schema({ timestamps: true })
export class Exercise {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' })
  difficulty: string;

  @Prop({ type: [String], default: [] })
  muscleGroups: string[];

  @Prop({ required: true })
  equipment: string;

  @Prop()
  videoUrl?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ type: [String], default: [] })
  instructions: string[];

  @Prop({ type: [String], default: [] })
  tips: string[];

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  @Prop({ default: false })
  isCustom: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const ExerciseSchema = SchemaFactory.createForClass(Exercise);