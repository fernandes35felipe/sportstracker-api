import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SportsGroup } from './sports-group.entity';
import { SportsGroupClass } from './sports-group-class.entity';
import { User } from '../../users/entities/user.entity';

@Entity('sports_group_sessions')
export class SportsGroupSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => SportsGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: SportsGroup;

  @Column({ name: 'class_id', nullable: true })
  classId: string;

  @ManyToOne(() => SportsGroupClass, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'class_id' })
  class: SportsGroupClass;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'scheduled_at', type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ name: 'duration_minutes', nullable: true })
  durationMinutes: number;

  @Column({ nullable: true })
  location: string;

  @Column({ name: 'created_by_id' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by_id' })
  createdBy: User;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
