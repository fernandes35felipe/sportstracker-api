import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('evolution_photos')
export class EvolutionPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'athlete_id' })
  athleteId: string;

  @Column({ name: 'uploaded_by' })
  uploadedBy: string;

  @Column({ name: 'photo_url' })
  photoUrl: string;

  @Column({ type: 'text', nullable: true })
  caption: string;

  @Column({ nullable: true })
  category: string; // front, back, side, full, other

  @CreateDateColumn({ name: 'taken_at' })
  takenAt: Date;
}
