import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['athlete', 'trainer'], default: 'athlete' })
  role: string;

  @Prop()
  bio?: string;

  @Prop()
  avatar?: string;

  @Prop()
  weight?: number;

  @Prop()
  height?: number;

  @Prop()
  age?: number;

  @Prop({ type: [String], default: [] })
  goals?: string[];

  @Prop({ type: [String], default: [] })
  athletes?: string[];

  @Prop({ default: true })
  isActive: boolean;
  _id: any;
}

export const UserSchema = SchemaFactory.createForClass(User);