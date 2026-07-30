import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SportsGroup } from './sports-group.entity';
import { User } from '../../users/entities/user.entity';

// role: 'admin' | 'trainer' | 'athlete' | 'member'
@Entity('sports_group_members')
export class SportsGroupMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => SportsGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: SportsGroup;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'is_fictional', default: false })
  isFictional: boolean;

  @Column({ name: 'fictional_name', nullable: true })
  fictionalName: string;

  @Column({ name: 'fictional_email', nullable: true })
  fictionalEmail: string;

  @Column({ name: 'fictional_phone', nullable: true })
  fictionalPhone: string;

  @Column({ name: 'fictional_notes', type: 'text', nullable: true })
  fictionalNotes: string;

  @Column({ default: 'member' })
  role: string;

  @Column({ name: 'custom_role', nullable: true })
  customRole: string;

  @Column({ nullable: true })
  schedule: string;

  @Column({ name: 'payment_status', nullable: true })
  paymentStatus: string;

  @Column({ name: 'plan_name', nullable: true })
  planName: string;

  @Column({ name: 'plan_value', type: 'decimal', precision: 10, scale: 2, nullable: true })
  planValue: number;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;
}
