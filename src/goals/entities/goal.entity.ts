import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity("goals")
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text", { nullable: true })
  description: string;

  @Column()
  category: "strength" | "endurance" | "body-composition" | "skill";

  @Column()
  target: number;

  @Column({ type: "float", default: 0 })
  current: number;

  @Column()
  unit: string;

  @Column()
  deadline: string; 

  @Column()
  priority: "high" | "medium" | "low";

  @Column({ default: "active" })
  status: "active" | "completed" | "paused";

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt: Date;

  // Relação com o Atleta
  @ManyToOne(() => User, user => user.goals)
  @JoinColumn({ name: "athleteId" })
  athlete: User;

  @Column()
  athleteId: number;
}
