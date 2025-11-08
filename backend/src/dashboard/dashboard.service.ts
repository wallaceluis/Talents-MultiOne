import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // MÉTRICAS GERAIS (KPIs)
  // ============================================
  async getGeneralMetrics() {
    const [companies, vacancies, candidates, applications] = await Promise.all([
      this.prisma.company.count({ where: { status: 'ACTIVE' } }),
      this.prisma.vacancy.count({ where: { status: 'OPEN' } }),
      this.prisma.candidate.count({ where: { status: 'ACTIVE' } }),
      this.prisma.application.count(),
    ]);

    return {
      companies,
      vacancies,
      candidates,
      applications,
    };
  }

  // ============================================
  // ANÁLISE DE CANDIDATOS
  // ============================================
  async getCandidatesAnalysis(filters?: {
    region?: string;
    gender?: string;
    ageRange?: string;
    status?: string;
    dateStart?: string;
    dateEnd?: string;
  }) {
    // Evolução temporal (últimos 5 meses)
    const evolution = await this.getCandidatesEvolution();

    // Comparação por atividade
    const totalCandidates = await this.prisma.candidate.count();
    const activeCandidates = await this.prisma.candidate.count({
      where: { status: 'ACTIVE' },
    });
    const totalApplications = await this.prisma.application.count();

    const activities = [
      { name: 'Cadastros', value: totalCandidates },
      { name: 'Ativos', value: activeCandidates },
      { name: 'Candidaturas', value: totalApplications },
    ];

    // Distribuição por estado
    const byState = await this.prisma.candidate.groupBy({
      by: ['state'],
      _count: { id: true },
      where: { state: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const stateData = byState.map((item) => ({
      state: item.state || 'N/D',
      count: item._count.id,
    }));

    // Distribuição por gênero (mock - adicionar campo gender no schema se necessário)
    const byGender = [
      { name: 'Masculino', value: Math.floor(totalCandidates * 0.54) },
      { name: 'Feminino', value: Math.floor(totalCandidates * 0.42) },
      { name: 'Outros', value: Math.floor(totalCandidates * 0.04) },
    ];

    // Faixa etária (calculada a partir de birthDate)
    const candidates = await this.prisma.candidate.findMany({
      where: { birthDate: { not: null } },
      select: { birthDate: true },
    });

    const byAge = this.calculateAgeRanges(candidates);

    // Top cargos mais buscados (baseado em experiências)
    const topPositions = await this.prisma.experience.groupBy({
      by: ['position'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const positionData = topPositions.map((item) => ({
      position: item.position,
      count: item._count.id,
    }));

    return {
      evolution,
      activities,
      byState: stateData,
      byGender,
      byAge,
      topPositions: positionData,
    };
  }

  // ============================================
  // ANÁLISE DE EMPRESAS
  // ============================================
  async getCompaniesAnalysis() {
    // Evolução temporal
    const evolution = await this.getCompaniesEvolution();

    // Por segmento (usando campo industry)
    const bySegment = await this.prisma.company.groupBy({
      by: ['industry'],
      _count: { id: true },
      where: { industry: { not: null } },
      orderBy: { _count: { id: 'desc' } },
    });

    const segmentData = bySegment.map((item) => ({
      name: item.industry || 'Outros',
      value: item._count.id,
    }));

    // Por estado (extrair do location)
    const byState = await this.prisma.company.groupBy({
      by: ['location'],
      _count: { id: true },
      where: { location: { not: null } },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    });

    const stateData = byState.map((item) => ({
      state: item.location?.split('-')[1]?.trim() || 'N/D',
      count: item._count.id,
    }));

    // Top empresas por número de vagas
    const topByVacancies = await this.prisma.company.findMany({
      select: {
        name: true,
        _count: { select: { vacancies: true } },
      },
      orderBy: { vacancies: { _count: 'desc' } },
      take: 5,
    });

    const vacanciesData = topByVacancies.map((item) => ({
      company: item.name,
      vacancies: item._count.vacancies,
    }));

    // Top empresas por candidaturas
    const topByCandidates = await this.prisma.company.findMany({
      select: {
        name: true,
        vacancies: {
          select: {
            _count: { select: { applications: true } },
          },
        },
      },
      orderBy: { name: 'asc' },
      take: 10,
    });

    const candidatesData = topByCandidates
      .map((item) => ({
        company: item.name,
        applications: item.vacancies.reduce(
          (sum, v) => sum + v._count.applications,
          0
        ),
      }))
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5);

    return {
      evolution,
      bySegment: segmentData,
      byState: stateData,
      topByVacancies: vacanciesData,
      topByCandidates: candidatesData,
    };
  }

  // ============================================
  // ANÁLISE DE VAGAS
  // ============================================
  async getVacanciesAnalysis() {
    // Evolução temporal
    const evolution = await this.getVacanciesEvolution();

    // Por status
    const statusCounts = await Promise.all([
      this.prisma.vacancy.count({ where: { status: 'OPEN' } }),
      this.prisma.vacancy.count({ where: { status: 'CLOSED' } }),
      this.prisma.vacancy.count({ where: { status: 'PAUSED' } }),
    ]);

    const byStatus = [
      { name: 'Abertas', value: statusCounts[0] },
      { name: 'Encerradas', value: statusCounts[1] },
      { name: 'Pausadas', value: statusCounts[2] },
    ];

    // Por setor (usando company.industry)
    const bySector = await this.prisma.vacancy.findMany({
      select: {
        company: { select: { industry: true } },
      },
    });

    const sectorMap = new Map<string, number>();
    bySector.forEach((v) => {
      const sector = v.company.industry || 'Outros';
      sectorMap.set(sector, (sectorMap.get(sector) || 0) + 1);
    });

    const sectorData = Array.from(sectorMap.entries())
      .map(([sector, count]) => ({ sector, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Por cargo (título da vaga)
    const byPosition = await this.prisma.vacancy.groupBy({
      by: ['title'],
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 8,
    });

    const positionData = byPosition.map((item) => ({
      position: item.title,
      count: item._count.id,
    }));

    // Por região (extrair de location)
    const byRegion = await this.prisma.vacancy.findMany({
      select: { location: true },
      where: { location: { not: null } },
    });

    const regionMap = new Map<string, number>();
    byRegion.forEach((v) => {
      const region = this.getRegionFromLocation(v.location || '');
      regionMap.set(region, (regionMap.get(region) || 0) + 1);
    });

    const regionData = Array.from(regionMap.entries())
      .map(([region, count]) => ({ region, count }))
      .sort((a, b) => b.count - a.count);

    return {
      evolution,
      byStatus,
      bySector: sectorData,
      byPosition: positionData,
      byRegion: regionData,
    };
  }

  // ============================================
  // MÉTODOS AUXILIARES
  // ============================================

  private async getCandidatesEvolution() {
    const candidates = await this.prisma.candidate.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    return this.groupByMonth(candidates, 5);
  }

  private async getCompaniesEvolution() {
    const companies = await this.prisma.company.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    return this.groupByMonth(companies, 5);
  }

  private async getVacanciesEvolution() {
    const vacancies = await this.prisma.vacancy.findMany({
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' },
    });

    return this.groupByMonth(vacancies, 5);
  }

  private groupByMonth(
    items: { createdAt: Date }[],
    lastMonths: number = 5
  ) {
    const now = new Date();
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    const result = [];
    
    for (let i = lastMonths - 1; i >= 0; i--) {
      const targetDate = new Date(now);
      targetDate.setMonth(now.getMonth() - i);
      
      const month = monthNames[targetDate.getMonth()];
      const year = targetDate.getFullYear();
      
      const count = items.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return (
          itemDate.getMonth() === targetDate.getMonth() &&
          itemDate.getFullYear() === targetDate.getFullYear()
        );
      }).length;
      
      // Total acumulado até este mês
      const total = items.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate <= targetDate;
      }).length;
      
      result.push({ month, total });
    }
    
    return result;
  }

  private calculateAgeRanges(candidates: { birthDate: Date | null }[]) {
    const now = new Date();
    const ranges = {
      '18-24': 0,
      '25-34': 0,
      '35-44': 0,
      '45+': 0,
    };

    candidates.forEach((c) => {
      if (!c.birthDate) return;
      
      const age = now.getFullYear() - new Date(c.birthDate).getFullYear();
      
      if (age >= 18 && age <= 24) ranges['18-24']++;
      else if (age >= 25 && age <= 34) ranges['25-34']++;
      else if (age >= 35 && age <= 44) ranges['35-44']++;
      else if (age >= 45) ranges['45+']++;
    });

    return Object.entries(ranges).map(([range, count]) => ({ range, count }));
  }

  private getRegionFromLocation(location: string): string {
    const state = location.split('-')[1]?.trim().toUpperCase();
    
    const sudeste = ['SP', 'RJ', 'MG', 'ES'];
    const sul = ['PR', 'SC', 'RS'];
    const nordeste = ['BA', 'PE', 'CE', 'MA', 'RN', 'PB', 'SE', 'AL', 'PI'];
    const norte = ['AM', 'PA', 'RO', 'AC', 'RR', 'AP', 'TO'];
    const centroOeste = ['GO', 'MT', 'MS', 'DF'];
    
    if (sudeste.includes(state)) return 'Sudeste';
    if (sul.includes(state)) return 'Sul';
    if (nordeste.includes(state)) return 'Nordeste';
    if (norte.includes(state)) return 'Norte';
    if (centroOeste.includes(state)) return 'Centro-Oeste';
    
    return 'Outros';
  }
}