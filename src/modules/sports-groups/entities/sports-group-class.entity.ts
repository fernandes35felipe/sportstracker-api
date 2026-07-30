import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { SportsGroup } from './sports-group.entity';
import { SportsGroupMember } from './sports-group-member.entity';
import { User } from '../../users/entities/user.entity';

@Entity('sports_group_classes')
export class SportsGroupClass {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @ManyToOne(() => SportsGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: SportsGroup;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'trainer_id', nullable: true })
  trainerId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'trainer_id' })
  trainer: User;

  @Column({ nullable: true })
  schedule: string;

  @Column({ name: 'max_students', nullable: true })
  maxStudents: number;

  @Column({ nullable: true })
  sport: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ManyToMany(() => SportsGroupMember)
  @JoinTable({
    name: 'sports_group_class_enrollments',
    joinColumn: { name: 'class_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'member_id', referencedColumnName: 'id' },
  })
  enrolledMembers: SportsGroupMember[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
