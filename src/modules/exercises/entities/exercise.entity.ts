import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('exercises')
export class Exercise {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column({ default: 'intermediate' })
  difficulty: string;

  @Column({ name: 'muscle_groups', type: 'jsonb', default: [] })
  muscleGroups: string[];

  @Column()
  equipment: string;

  @Column({ name: 'video_url', nullable: true })
  videoUrl: string;

  @Column({ name: 'image_url', nullable: true })
  imageUrl: string;

  @Column({ type: 'jsonb', default: [] })
  instructions: string[];

  @Column({ type: 'jsonb', default: [] })
  tips: string[];

  @Column({ name: 'created_by_id', nullable: true })
  createdById: string;

  @ManyToOne(() => User, { nullable: true, eager: false })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @Column({ name: 'is_custom', default: false })
  isCustom: boolean;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
