import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PhysicalEvaluation } from './entities/physical-evaluation.entity';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

export interface EvaluationTemplate {
  key: string;
  label: string;
  sportType: string;
  icon: string;
  fields: {
    key: string;
    label: string;
    unit: string;
    type: 'number' | 'text' | 'select';
    options?: string[];
    group?: string;
  }[];
}

export const EVALUATION_TEMPLATES: EvaluationTemplate[] = [
  {
    key: 'musculacao',
    label: 'Musculação',
    sportType: 'musculacao',
    icon: '🏋️',
    fields: [
      { key: 'peso', label: 'Peso', unit: 'kg', type: 'number', group: 'Composição Corporal' },
      { key: 'altura', label: 'Altura', unit: 'cm', type: 'number', group: 'Composição Corporal' },
      { key: 'imc', label: 'IMC', unit: 'kg/m²', type: 'number', group: 'Composição Corporal' },
      { key: 'gordura_percentual', label: 'Gordura Corporal', unit: '%', type: 'number', group: 'Composição Corporal' },
      { key: 'massa_magra', label: 'Massa Magra', unit: 'kg', type: 'number', group: 'Composição Corporal' },
      { key: 'circ_braco_d', label: 'Circunferência Braço D', unit: 'cm', type: 'number', group: 'Circunferências' },
      { key: 'circ_braco_e', label: 'Circunferência Braço E', unit: 'cm', type: 'number', group: 'Circunferências' },
      { key: 'circ_peitoral', label: 'Circunferência Peitoral', unit: 'cm', type: 'number', group: 'Circunferências' },
      { key: 'circ_cintura', label: 'Circunferência Cintura', unit: 'cm', type: 'number', group: 'Circunferências' },
      { key: 'circ_quadril', label: 'Circunferência Quadril', unit: 'cm', type: 'number', group: 'Circunferências' },
      { key: 'circ_coxa_d', label: 'Circunferência Coxa D', unit: 'cm', type: 'number', group: 'Circunferências' },
      { key: 'circ_panturrilha_d', label: 'Circunferência Panturrilha D', unit: 'cm', type: 'number', group: 'Circunferências' },
      { key: 'rm_supino', label: '1RM Supino', unit: 'kg', type: 'number', group: 'Força Máxima' },
      { key: 'rm_agachamento', label: '1RM Agachamento', unit: 'kg', type: 'number', group: 'Força Máxima' },
      { key: 'rm_levantamento_terra', label: '1RM Levantamento Terra', unit: 'kg', type: 'number', group: 'Força Máxima' },
    ],
  },
  {
    key: 'corrida',
    label: 'Corrida',
    sportType: 'corrida',
    icon: '🏃',
    fields: [
      { key: 'peso', label: 'Peso', unit: 'kg', type: 'number', group: 'Geral' },
      { key: 'vo2max', label: 'VO₂ Máx', unit: 'ml/kg/min', type: 'number', group: 'Capacidade Aeróbica' },
      { key: 'fc_maxima', label: 'FC Máxima', unit: 'bpm', type: 'number', group: 'Capacidade Aeróbica' },
      { key: 'fc_repouso', label: 'FC em Repouso', unit: 'bpm', type: 'number', group: 'Capacidade Aeróbica' },
      { key: 'pace_5k', label: 'Pace 5K', unit: 'min/km', type: 'text', group: 'Tempos de Prova' },
      { key: 'pace_10k', label: 'Pace 10K', unit: 'min/km', type: 'text', group: 'Tempos de Prova' },
      { key: 'tempo_5k', label: 'Tempo 5K', unit: 'mm:ss', type: 'text', group: 'Tempos de Prova' },
      { key: 'tempo_10k', label: 'Tempo 10K', unit: 'mm:ss', type: 'text', group: 'Tempos de Prova' },
      { key: 'tempo_meia_maratona', label: 'Tempo Meia Maratona', unit: 'hh:mm:ss', type: 'text', group: 'Tempos de Prova' },
      { key: 'tempo_maratona', label: 'Tempo Maratona', unit: 'hh:mm:ss', type: 'text', group: 'Tempos de Prova' },
      { key: 'cadencia', label: 'Cadência Média', unit: 'passos/min', type: 'number', group: 'Técnica' },
    ],
  },
  {
    key: 'natacao',
    label: 'Natação',
    sportType: 'natacao',
    icon: '🏊',
    fields: [
      { key: 'peso', label: 'Peso', unit: 'kg', type: 'number', group: 'Geral' },
      { key: 'vo2max', label: 'VO₂ Máx', unit: 'ml/kg/min', type: 'number', group: 'Capacidade Aeróbica' },
      { key: 'tempo_50m_livre', label: 'Tempo 50m Livre', unit: 's', type: 'number', group: 'Desempenho' },
      { key: 'tempo_100m_livre', label: 'Tempo 100m Livre', unit: 's', type: 'number', group: 'Desempenho' },
      { key: 'tempo_200m_livre', label: 'Tempo 200m Livre', unit: 'mm:ss', type: 'text', group: 'Desempenho' },
      { key: 'tempo_50m_costas', label: 'Tempo 50m Costas', unit: 's', type: 'number', group: 'Desempenho' },
      { key: 'tempo_50m_peito', label: 'Tempo 50m Peito', unit: 's', type: 'number', group: 'Desempenho' },
      { key: 'braçadas_por_comprimento', label: 'Braçadas por Comprimento', unit: 'cx', type: 'number', group: 'Técnica' },
      { key: 'eficiencia_nado', label: 'Eficiência de Nado', unit: 'pts', type: 'number', group: 'Técnica' },
    ],
  },
  {
    key: 'ciclismo',
    label: 'Ciclismo',
    sportType: 'ciclismo',
    icon: '🚴',
    fields: [
      { key: 'peso', label: 'Peso', unit: 'kg', type: 'number', group: 'Geral' },
      { key: 'ftp', label: 'FTP (Potência Limiar)', unit: 'watts', type: 'number', group: 'Potência' },
      { key: 'potencia_maxima', label: 'Potência Máxima', unit: 'watts', type: 'number', group: 'Potência' },
      { key: 'watts_por_kg', label: 'Watts/kg', unit: 'w/kg', type: 'number', group: 'Potência' },
      { key: 'vo2max', label: 'VO₂ Máx', unit: 'ml/kg/min', type: 'number', group: 'Capacidade Aeróbica' },
      { key: 'fc_maxima', label: 'FC Máxima', unit: 'bpm', type: 'number', group: 'Capacidade Aeróbica' },
      { key: 'cadencia_media', label: 'Cadência Média', unit: 'rpm', type: 'number', group: 'Técnica' },
      { key: 'velocidade_media', label: 'Velocidade Média', unit: 'km/h', type: 'number', group: 'Desempenho' },
      { key: 'distancia_maxima', label: 'Distância Máxima Percorrida', unit: 'km', type: 'number', group: 'Desempenho' },
    ],
  },
  {
    key: 'funcional',
    label: 'Funcional / CrossFit',
    sportType: 'funcional',
    icon: '⚡',
    fields: [
      { key: 'peso', label: 'Peso', unit: 'kg', type: 'number', group: 'Geral' },
      { key: 'gordura_percentual', label: 'Gordura Corporal', unit: '%', type: 'number', group: 'Geral' },
      { key: 'flexao_maxima', label: 'Flexão de Braço (máx)', unit: 'reps', type: 'number', group: 'Força Relativa' },
      { key: 'pullup_maxima', label: 'Pull-Up (máx)', unit: 'reps', type: 'number', group: 'Força Relativa' },
      { key: 'agachamento_livre_max', label: 'Agachamento Livre (máx)', unit: 'kg', type: 'number', group: 'Força Relativa' },
      { key: 'flexibilidade_alcance', label: 'Flexibilidade — Alcance', unit: 'cm', type: 'number', group: 'Mobilidade' },
      { key: 'equilibrio_unipodal', label: 'Equilíbrio Unipodal', unit: 's', type: 'number', group: 'Mobilidade' },
      { key: 'teste_cooper', label: 'Teste de Cooper', unit: 'm', type: 'number', group: 'Resistência' },
      { key: 'tempo_amrap', label: 'AMRAP 20min (reps totais)', unit: 'reps', type: 'number', group: 'Desempenho' },
    ],
  },
  {
    key: 'geral',
    label: 'Avaliação Geral',
    sportType: 'geral',
    icon: '📋',
    fields: [
      { key: 'peso', label: 'Peso', unit: 'kg', type: 'number', group: 'Composição' },
      { key: 'altura', label: 'Altura', unit: 'cm', type: 'number', group: 'Composição' },
      { key: 'imc', label: 'IMC', unit: 'kg/m²', type: 'number', group: 'Composição' },
      { key: 'gordura_percentual', label: 'Gordura Corporal', unit: '%', type: 'number', group: 'Composição' },
      { key: 'pressao_sistolica', label: 'Pressão Sistólica', unit: 'mmHg', type: 'number', group: 'Saúde' },
      { key: 'pressao_diastolica', label: 'Pressão Diastólica', unit: 'mmHg', type: 'number', group: 'Saúde' },
      { key: 'fc_repouso', label: 'FC em Repouso', unit: 'bpm', type: 'number', group: 'Saúde' },
      { key: 'flexibilidade', label: 'Flexibilidade Geral', unit: '1-10', type: 'number', group: 'Condicionamento' },
      { key: 'resistencia', label: 'Resistência Geral', unit: '1-10', type: 'number', group: 'Condicionamento' },
      { key: 'forca', label: 'Força Geral', unit: '1-10', type: 'number', group: 'Condicionamento' },
    ],
  },
  {
    key: 'custom',
    label: 'Template Personalizado',
    sportType: 'custom',
    icon: '✏️',
    fields: [],
  },
];

@Injectable()
export class PhysicalEvaluationsService {
  constructor(
    @InjectRepository(PhysicalEvaluation)
    private evalRepo: Repository<PhysicalEvaluation>,
  ) {}

  getTemplates(): EvaluationTemplate[] {
    return EVALUATION_TEMPLATES;
  }

  getTemplate(key: string): EvaluationTemplate | undefined {
    return EVALUATION_TEMPLATES.find((t) => t.key === key);
  }

  async create(trainerId: string, dto: CreateEvaluationDto): Promise<PhysicalEvaluation> {
    // If a templateKey is provided and no measurements given, pre-fill measurement keys
    let measurements = dto.measurements ?? {};
    if (dto.templateKey && Object.keys(measurements).length === 0) {
      const template = this.getTemplate(dto.templateKey);
      if (template) {
        measurements = template.fields.reduce((acc, f) => ({ ...acc, [f.key]: null }), {});
      }
    }

    const evaluation = this.evalRepo.create({
      ...dto,
      trainerId,
      measurements,
      documentUrls: [],
    });
    return this.evalRepo.save(evaluation);
  }

  async findByAthlete(athleteId: string): Promise<PhysicalEvaluation[]> {
    return this.evalRepo.find({
      where: { athleteId },
      order: { evaluationDate: 'DESC', createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<PhysicalEvaluation> {
    const evaluation = await this.evalRepo.findOne({ where: { id } });
    if (!evaluation) throw new NotFoundException('Avaliação não encontrada');
    return evaluation;
  }

  async update(id: string, trainerId: string, dto: UpdateEvaluationDto): Promise<PhysicalEvaluation> {
    const evaluation = await this.findOne(id);
    if (evaluation.trainerId !== trainerId) {
      throw new ForbiddenException('Apenas o treinador pode editar esta avaliação');
    }
    Object.assign(evaluation, dto);
    return this.evalRepo.save(evaluation);
  }

  async addDocument(id: string, trainerId: string, documentUrl: string): Promise<PhysicalEvaluation> {
    const evaluation = await this.findOne(id);
    if (evaluation.trainerId !== trainerId) {
      throw new ForbiddenException('Apenas o treinador pode adicionar documentos');
    }
    evaluation.documentUrls = [...(evaluation.documentUrls ?? []), documentUrl];
    return this.evalRepo.save(evaluation);
  }

  async remove(id: string, trainerId: string): Promise<void> {
    const evaluation = await this.findOne(id);
    if (evaluation.trainerId !== trainerId) {
      throw new ForbiddenException('Apenas o treinador pode excluir esta avaliação');
    }
    await this.evalRepo.delete(id);
  }
}
