import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('physical_evaluations')
export class PhysicalEvaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'athlete_id' })
  athleteId: string;

  @Column({ name: 'trainer_id' })
  trainerId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'jsonb', nullable: true })
  measurements: Record<string, any>;

  @Column('text', { array: true, default: [], name: 'document_urls' })
  documentUrls: string[];

  @Column({ name: 'evaluation_date', type: 'date', nullable: true })
  evaluationDate: string;

  @Column({ name: 'sport_type', nullable: true })
  sportType: string;

  @Column({ name: 'template_key', nullable: true })
  templateKey: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
