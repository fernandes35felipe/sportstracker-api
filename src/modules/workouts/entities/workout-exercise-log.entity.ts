import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('workout_exercise_logs')
export class WorkoutExerciseLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workout_id' })
  workoutId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'exercise_name' })
  exerciseName: string;

  @Column({ name: 'exercise_id', nullable: true })
  exerciseId: string;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ name: 'actual_reps', nullable: true })
  actualReps: string;

  @CreateDateColumn({ name: 'logged_at' })
  loggedAt: Date;
}
