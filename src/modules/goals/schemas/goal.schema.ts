import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type GoalDocument = Goal & Document;

@Schema({ timestamps: true })
export class Goal {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: ['strength', 'endurance', 'body-composition', 'skill'], required: true })
  category: string;

  @Prop({ enum: ['low', 'medium', 'high'], default: 'medium' })
  priority: string;

  @Prop({ required: true })
  target: number;

  @Prop({ default: 0 })
  current: number;

  @Prop({ required: true })
  unit: string;

  @Prop()
  targetDate?: Date;

  @Prop({ enum: ['active', 'completed', 'paused'], default: 'active' })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  completedAt?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const GoalSchema = SchemaFactory.createForClass(Goal);