import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("exercises")
export class Exercise {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  muscleGroup: string;

  @Column()
  equipment: string;

  @Column({ default: "intermediate" })
  difficulty: "beginner" | "intermediate" | "advanced";

  @Column("text", { array: true, nullable: true })
  instructions: string[];

  @Column("text", { array: true, nullable: true })
  tips: string[];

  // Define o treinador que criou o exercício (se for personalizado)
  @ManyToOne(() => User)
  @JoinColumn({ name: "trainerId" })
  trainer: User;

  @Column({ nullable: true })
  trainerId: number;
}
