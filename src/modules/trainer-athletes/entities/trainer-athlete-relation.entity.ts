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

  @Column({ default: 'active' })
  status: string; // active, pending, inactive

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
