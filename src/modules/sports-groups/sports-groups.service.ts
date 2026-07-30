import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SportsGroup } from './entities/sports-group.entity';
import { SportsGroupMember } from './entities/sports-group-member.entity';
import { SportsGroupClass } from './entities/sports-group-class.entity';
import { SportsGroupSession } from './entities/sports-group-session.entity';

@Injectable()
export class SportsGroupsService {
  constructor(
    @InjectRepository(SportsGroup)
    private readonly groupRepo: Repository<SportsGroup>,
    @InjectRepository(SportsGroupMember)
    private readonly memberRepo: Repository<SportsGroupMember>,
    @InjectRepository(SportsGroupClass)
    private readonly classRepo: Repository<SportsGroupClass>,
    @InjectRepository(SportsGroupSession)
    private readonly sessionRepo: Repository<SportsGroupSession>,
  ) {}

  async createGroup(userId: string, dto: any): Promise<any> {
    const group = this.groupRepo.create({
      name: dto.name,
      description: dto.description,
      type: dto.type,
      visibility: dto.visibility ?? (dto.type === 'athlete_group' ? 'public' : 'private'),
      sport: dto.sport,
      createdById: userId,
    });
    const saved = await this.groupRepo.save(group);

    await this.memberRepo.save(
      this.memberRepo.create({ groupId: saved.id, userId, role: 'admin' }),
    );

    return this.getGroupById(saved.id, userId);
  }

  async getMyGroups(userId: string): Promise<any[]> {
    const memberships = await this.memberRepo.find({ where: { userId } });
    const groupIds = [...new Set(memberships.map((m) => m.groupId))];
    if (!groupIds.length) return [];

    const groups = await this.groupRepo.find({
      where: { id: In(groupIds) },
      order: { createdAt: 'DESC' },
    });

    return Promise.all(
      groups.map(async (group) => {
        const memberCount = await this.memberRepo.count({
          where: { groupId: group.id },
        });
        const mine = memberships.find((m) => m.groupId === group.id);
        return { ...group, memberCount, myRole: mine?.role ?? null };
      }),
    );
  }

  async getGroupById(id: string, userId: string): Promise<any> {
    const group = await this.groupRepo.findOne({ where: { id } });
    if (!group) throw new NotFoundException('Grupo não encontrado');

    const membership = await this.memberRepo.findOne({
      where: { groupId: id, userId },
    });

    if (group.visibility === 'private' && !membership && group.createdById !== userId) {
      throw new ForbiddenException('Acesso negado');
    }

    const members = await this.memberRepo.find({
      where: { groupId: id },
      relations: { user: true },
      order: { joinedAt: 'ASC' },
    });

    const classes = await this.classRepo.find({
      where: { groupId: id },
      relations: { enrolledMembers: { user: true }, trainer: true },
      order: { createdAt: 'ASC' },
    });

    const sessions = await this.sessionRepo.find({
      where: { groupId: id },
      relations: { createdBy: true },
      order: { scheduledAt: 'ASC' },
    });

    return {
      ...group,
      members: members.map((m) => ({
        ...m,
        planValue: m.planValue != null ? Number(m.planValue) : null,
      })),
      classes,
      sessions,
      myRole: membership?.role ?? null,
    };
  }

  async updateGroup(id: string, userId: string, dto: any): Promise<SportsGroup> {
    await this.assertAdmin(id, userId);
    const group = await this.groupRepo.findOne({ where: { id } });
    Object.assign(group, {
      name: dto.name ?? group.name,
      description: dto.description ?? group.description,
      visibility: dto.visibility ?? group.visibility,
      sport: dto.sport ?? group.sport,
    });
    return this.groupRepo.save(group);
  }

  async deleteGroup(id: string, userId: string): Promise<void> {
    await this.assertAdmin(id, userId);
    const group = await this.groupRepo.findOne({ where: { id } });
    await this.groupRepo.remove(group);
  }

  // ── Members ──────────────────────────────────────────────────────────────

  async addMember(groupId: string, userId: string, dto: any): Promise<SportsGroupMember> {
    await this.assertAdminOrTrainer(groupId, userId);

    if (dto.isFictional) {
      const member = this.memberRepo.create({
        groupId,
        isFictional: true,
        fictionalName: dto.fictionalName,
        fictionalEmail: dto.fictionalEmail,
        fictionalPhone: dto.fictionalPhone,
        fictionalNotes: dto.fictionalNotes,
        role: dto.role ?? 'athlete',
        customRole: dto.customRole,
        schedule: dto.schedule,
        paymentStatus: dto.paymentStatus,
        planName: dto.planName,
        planValue: dto.planValue,
      });
      return this.memberRepo.save(member);
    }

    const existing = await this.memberRepo.findOne({
      where: { groupId, userId: dto.userId },
    });
    if (existing) throw new ConflictException('Usuário já é membro do grupo');

    const member = this.memberRepo.create({
      groupId,
      userId: dto.userId,
      role: dto.role ?? 'athlete',
      customRole: dto.customRole,
      schedule: dto.schedule,
      paymentStatus: dto.paymentStatus,
      planName: dto.planName,
      planValue: dto.planValue,
    });
    return this.memberRepo.save(member);
  }

  async updateMember(
    groupId: string,
    memberId: string,
    userId: string,
    dto: any,
  ): Promise<SportsGroupMember> {
    await this.assertAdminOrTrainer(groupId, userId);
    const member = await this.memberRepo.findOne({
      where: { id: memberId, groupId },
    });
    if (!member) throw new NotFoundException('Membro não encontrado');
    Object.assign(member, dto);
    return this.memberRepo.save(member);
  }

  async removeMember(groupId: string, memberId: string, userId: string): Promise<void> {
    await this.assertAdminOrTrainer(groupId, userId);
    const member = await this.memberRepo.findOne({
      where: { id: memberId, groupId },
    });
    if (!member) throw new NotFoundException('Membro não encontrado');
    await this.memberRepo.remove(member);
  }

  // ── Classes (Turmas) ──────────────────────────────────────────────────────

  async createClass(groupId: string, userId: string, dto: any): Promise<SportsGroupClass> {
    await this.assertAdminOrTrainer(groupId, userId);
    const cls = this.classRepo.create({
      groupId,
      name: dto.name,
      description: dto.description,
      trainerId: dto.trainerId,
      schedule: dto.schedule,
      maxStudents: dto.maxStudents,
      sport: dto.sport,
    });
    return this.classRepo.save(cls);
  }

  async updateClass(
    groupId: string,
    classId: string,
    userId: string,
    dto: any,
  ): Promise<SportsGroupClass> {
    await this.assertAdminOrTrainer(groupId, userId);
    const cls = await this.classRepo.findOne({ where: { id: classId, groupId } });
    if (!cls) throw new NotFoundException('Turma não encontrada');
    Object.assign(cls, dto);
    return this.classRepo.save(cls);
  }

  async deleteClass(groupId: string, classId: string, userId: string): Promise<void> {
    await this.assertAdminOrTrainer(groupId, userId);
    const cls = await this.classRepo.findOne({ where: { id: classId, groupId } });
    if (!cls) throw new NotFoundException('Turma não encontrada');
    await this.classRepo.remove(cls);
  }

  async enrollMember(
    groupId: string,
    classId: string,
    memberId: string,
    userId: string,
  ): Promise<void> {
    await this.assertAdminOrTrainer(groupId, userId);
    const cls = await this.classRepo.findOne({
      where: { id: classId, groupId },
      relations: { enrolledMembers: true },
    });
    if (!cls) throw new NotFoundException('Turma não encontrada');

    const member = await this.memberRepo.findOne({ where: { id: memberId, groupId } });
    if (!member) throw new NotFoundException('Membro não encontrado');

    if (!cls.enrolledMembers.some((m) => m.id === memberId)) {
      cls.enrolledMembers.push(member);
      await this.classRepo.save(cls);
    }
  }

  async unenrollMember(
    groupId: string,
    classId: string,
    memberId: string,
    userId: string,
  ): Promise<void> {
    await this.assertAdminOrTrainer(groupId, userId);
    const cls = await this.classRepo.findOne({
      where: { id: classId, groupId },
      relations: { enrolledMembers: true },
    });
    if (!cls) throw new NotFoundException('Turma não encontrada');
    cls.enrolledMembers = cls.enrolledMembers.filter((m) => m.id !== memberId);
    await this.classRepo.save(cls);
  }

  // ── Sessions ──────────────────────────────────────────────────────────────

  async createSession(groupId: string, userId: string, dto: any): Promise<SportsGroupSession> {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Grupo não encontrado');

    const membership = await this.memberRepo.findOne({ where: { groupId, userId } });
    if (!membership && group.createdById !== userId) {
      throw new ForbiddenException('Apenas membros podem criar sessões');
    }

    if (group.type !== 'athlete_group') {
      if (!membership || !['admin', 'trainer'].includes(membership.role)) {
        throw new ForbiddenException('Apenas admins e treinadores podem criar sessões neste grupo');
      }
    }

    const session = this.sessionRepo.create({
      groupId,
      classId: dto.classId,
      title: dto.title,
      description: dto.description,
      scheduledAt: new Date(dto.scheduledAt),
      durationMinutes: dto.durationMinutes,
      location: dto.location,
      createdById: userId,
    });
    return this.sessionRepo.save(session);
  }

  async deleteSession(groupId: string, sessionId: string, userId: string): Promise<void> {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Grupo não encontrado');

    const session = await this.sessionRepo.findOne({
      where: { id: sessionId, groupId },
    });
    if (!session) throw new NotFoundException('Sessão não encontrada');

    const membership = await this.memberRepo.findOne({ where: { groupId, userId } });
    const isAdmin = membership?.role === 'admin' || group.createdById === userId;
    if (!isAdmin && session.createdById !== userId) {
      throw new ForbiddenException('Sem permissão para excluir esta sessão');
    }

    await this.sessionRepo.remove(session);
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private async assertAdmin(groupId: string, userId: string): Promise<void> {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Grupo não encontrado');
    if (group.createdById === userId) return;
    const membership = await this.memberRepo.findOne({ where: { groupId, userId } });
    if (!membership || membership.role !== 'admin') {
      throw new ForbiddenException('Apenas administradores podem realizar esta ação');
    }
  }

  private async assertAdminOrTrainer(groupId: string, userId: string): Promise<void> {
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) throw new NotFoundException('Grupo não encontrado');
    if (group.createdById === userId) return;
    const membership = await this.memberRepo.findOne({ where: { groupId, userId } });
    if (!membership || !['admin', 'trainer'].includes(membership.role)) {
      throw new ForbiddenException('Sem permissão para gerenciar este grupo');
    }
  }
}
