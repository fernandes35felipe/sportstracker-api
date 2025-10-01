import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Workout } from "../../workouts/entities/workout.entity";
import { Goal } from "../../goals/entities/goal.entity";
import { Exercise } from "../../exercises/entities/exercise.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: "athlete" })
  role: "athlete" | "trainer";

  @Column({ nullable: true })
  trainerId: number;

  @OneToMany(() => Workout, workout => workout.athlete)
  workouts: Workout[];

  @OneToMany(() => Goal, goal => goal.athlete)
  goals: Goal[];

  @OneToMany(() => Exercise, exercise => exercise.trainer)
  customExercises: Exercise[];
}
