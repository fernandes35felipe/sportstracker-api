import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert, BeforeUpdate } from "typeorm";
import { Workout } from "../../workouts/entities/workout.entity";
import { Goal } from "../../goals/entities/goal.entity";
import { Exercise } from "../../exercises/entities/exercise.entity";
import * as bcrypt from "bcrypt";

export type UserRole = "athlete" | "trainer" | "admin";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password?: string; // Adicionado campo de senha

  @Column({ type: "enum", enum: ["athlete", "trainer", "admin"], default: "athlete" })
  role: UserRole;

  @Column({ nullable: true })
  trainerId: number;

  @OneToMany(() => Workout, (workout) => workout.athlete)
  workouts: Workout[];

  @OneToMany(() => Goal, (goal) => goal.athlete)
  goals: Goal[];

  @OneToMany(() => Exercise, (exercise) => exercise.trainer)
  customExercises: Exercise[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }
    return bcrypt.compare(password, this.password);
  }
}
