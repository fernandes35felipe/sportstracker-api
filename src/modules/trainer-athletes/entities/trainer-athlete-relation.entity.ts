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

  // Admin fields — managed by trainer, visible to trainer only (except paymentStatus/planName/planValue which athlete can see)
  @Column({ name: 'payment_status', default: 'pendente', nullable: true })
  paymentStatus: string; // 'pago' | 'pendente' | 'atrasado'

  @Column({ name: 'plan_name', nullable: true })
  planName: string;

  @Column({ name: 'plan_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  planValue: number;

  @Column({ name: 'admin_notes', type: 'text', nullable: true })
  adminNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
