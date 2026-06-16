import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  // Shared with wallet backend (maps to full_name column)
  @Column({ name: 'full_name', nullable: true })
  fullName: string;

  @Column({ default: 'full' })
  plan: string;

  @Column('text', { array: true, default: [], name: 'discount_tags' })
  discountTags: string[];

  @Column({ name: 'reset_token', nullable: true })
  resetToken: string;

  @Column({ name: 'reset_token_expiry', type: 'timestamp', nullable: true })
  resetTokenExpiry: Date;

  @Column({ name: 'partner_id', nullable: true })
  partnerId: string;

  // Sports tracker extras
  @Column({ default: 'athlete', nullable: true })
  role: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'text', nullable: true })
  avatar: string;

  @Column({ type: 'float', nullable: true })
  weight: number;

  @Column({ type: 'float', nullable: true })
  height: number;

  @Column({ nullable: true })
  age: number;

  @Column({ name: 'trainer_id', nullable: true })
  trainerId: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
