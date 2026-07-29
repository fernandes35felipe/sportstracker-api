import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('trainer_athlete_relations')
export class TrainerAthleteRelation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'trainer_id' })
  trainerId: string;

  @Column({ name: 'athlete_id' })
  athleteId: string;

  // pending = athlete sent request, active = accepted, rejected = denied
  @Column({ default: 'active' })
  status: string;

  // Filled by athlete when sending a request
  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
