import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { SportsGroupSession } from './sports-group-session.entity';
import { SportsGroupMember } from './sports-group-member.entity';

@Entity('sports_group_session_feedbacks')
@Unique(['sessionId', 'memberId'])
export class SportsGroupSessionFeedback {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'session_id' })
  sessionId: string;

  @ManyToOne(() => SportsGroupSession, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session: SportsGroupSession;

  @Column({ name: 'member_id' })
  memberId: string;

  @ManyToOne(() => SportsGroupMember, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'member_id' })
  member: SportsGroupMember;

  @Column({ default: false })
  attended: boolean;

  @Column({ nullable: true })
  rating: number;

  @Column({ type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
