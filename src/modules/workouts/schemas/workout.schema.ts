import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type WorkoutDocument = Workout & Document;

class ExerciseItem {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  sets: number;

  @Prop({ required: true })
  reps: string;

  @Prop()
  rest?: string;

  @Prop()
  notes?: string;
}

@Schema({ timestamps: true })
export class Workout {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  duration?: string;

  @Prop()
  restTime?: string;

  @Prop({ enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' })
  difficulty: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [ExerciseItem], default: [] })
  exercises: ExerciseItem[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  assignedTo: Types.ObjectId[];

  @Prop()
  scheduledDate?: Date;

  @Prop({ default: false })
  completed: boolean;

  @Prop()
  completedAt?: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const WorkoutSchema = SchemaFactory.createForClass(Workout);