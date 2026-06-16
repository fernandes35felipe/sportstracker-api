import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export interface WorkoutExerciseItem {
  name: string;
  sets: number;
  reps: string;
  rest?: string;
  notes?: string;
}

@Entity('workouts')
export class Workout {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  duration: string;

  @Column({ name: 'rest_time', nullable: true })
  restTime: string;

  @Column({ default: 'intermediate' })
  difficulty: string;

  @Column()
  category: string;

  @Column({ type: 'jsonb', default: [] })
  exercises: WorkoutExerciseItem[];

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @ManyToMany(() => User, { eager: false })
  @JoinTable({
    name: 'workout_assigned_users',
    joinColumn: { name: 'workout_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  assignedTo: User[];

  @Column({ name: 'scheduled_date', nullable: true, type: 'timestamptz' })
  scheduledDate: Date;

  @Column({ default: false })
  completed: boolean;

  @Column({ name: 'completed_at', nullable: true, type: 'timestamptz' })
  completedAt: Date;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
