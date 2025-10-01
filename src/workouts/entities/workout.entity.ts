import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

// Interface para um item de exercício dentro do treino (JSONB no PostgreSQL)
interface ExerciseItem {
  name: string;
  sets: number;
  reps: string;
}

@Entity("workouts")
export class Workout {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column("text", { nullable: true })
  description: string;

  @Column({ default: "45 min" })
  duration: string;

  @Column({ default: "60s" })
  restTime: string;

  @Column({ default: "intermediate" })
  difficulty: "beginner" | "intermediate" | "advanced";

  @Column()
  category: string;

  // Armazena a lista de exercícios como JSONB
  @Column("jsonb", { default: [] })
  exercisesList: ExerciseItem[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  // Relação com o Atleta
  @ManyToOne(() => User, user => user.workouts)
  @JoinColumn({ name: "athleteId" })
  athlete: User;

  @Column()
  athleteId: number;
}
