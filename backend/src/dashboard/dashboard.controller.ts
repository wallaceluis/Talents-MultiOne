import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getGeneralMetrics() {
    return this.dashboardService.getGeneralMetrics();
  }

  @Get('candidates-analysis')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  async getCandidatesAnalysis() {
    return this.dashboardService.getCandidatesAnalysis();
  }

  @Get('companies-analysis')
  @Roles('ADMIN', 'MANAGER')
  async getCompaniesAnalysis() {
    return this.dashboardService.getCompaniesAnalysis();
  }

  @Get('vacancies-analysis')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  async getVacanciesAnalysis() {
    return this.dashboardService.getVacanciesAnalysis();
  }

  // ============================================
  // ENDPOINTS DE RELATÓRIOS
  // ============================================

  @Get('reports/general')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getGeneralReport() {
    const metrics = await this.dashboardService.getGeneralMetrics();
    const candidatesAnalysis = await this.dashboardService.getCandidatesAnalysis();
    const companiesAnalysis = await this.dashboardService.getCompaniesAnalysis();
    const vacanciesAnalysis = await this.dashboardService.getVacanciesAnalysis();

    return {
      summary: [
        { label: 'Total de Métricas', value: 4 },
        { label: 'Período', value: 'Último mês' },
      ],
      detailedInfo: [
        { label: 'Empresas Cadastradas', value: metrics.companies },
        { label: 'Vagas Abertas', value: metrics.vacancies },
        { label: 'Total de Candidatos', value: metrics.candidates },
        { label: 'Candidaturas', value: metrics.applications },
        { 
          label: 'Taxa de Conversão', 
          value: metrics.vacancies > 0 
            ? `${((metrics.applications / metrics.vacancies) * 100).toFixed(1)}%`
            : '0%'
        },
        { label: 'Última Atualização', value: new Date().toLocaleDateString('pt-BR') },
      ],
      charts: {
        candidatesEvolution: candidatesAnalysis.evolution,
        companiesEvolution: companiesAnalysis.evolution,
        vacanciesEvolution: vacanciesAnalysis.evolution,
      },
    };
  }

  @Get('reports/companies')
  @Roles('ADMIN', 'MANAGER')
  async getCompaniesReport() {
    const analysis = await this.dashboardService.getCompaniesAnalysis();
    const metrics = await this.dashboardService.getGeneralMetrics();

    const companies = await this.dashboardService['prisma'].company.findMany({
      include: { plan: true },
    });

    const planStats = companies.reduce((acc, company) => {
      const planName = company.plan?.name || 'Sem plano';
      acc[planName] = (acc[planName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: [
        { label: 'Total', value: companies.length },
        { label: 'Ativas', value: companies.filter(c => c.status === 'ACTIVE').length },
      ],
      detailedInfo: [
        { label: 'Total de Empresas', value: companies.length },
        { label: 'Empresas Ativas', value: companies.filter(c => c.status === 'ACTIVE').length },
        { label: 'Em Trial', value: companies.filter(c => c.status === 'TRIAL').length },
        { label: 'Inativas', value: companies.filter(c => c.status === 'INACTIVE').length },
        ...Object.entries(planStats).map(([plan, count]) => ({
          label: `Plano ${plan}`,
          value: count,
        })),
      ],
      charts: {
        evolution: analysis.evolution,
        bySegment: analysis.bySegment,
        byState: analysis.byState,
        topByVacancies: analysis.topByVacancies,
        topByCandidates: analysis.topByCandidates,
      },
    };
  }

  @Get('reports/candidates')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  async getCandidatesReport() {
    const analysis = await this.dashboardService.getCandidatesAnalysis();
    const metrics = await this.dashboardService.getGeneralMetrics();

    const candidates = await this.dashboardService['prisma'].candidate.findMany();
    
    // Status corretos do enum: PENDING, REVIEWING, INTERVIEW, OFFERED, ACCEPTED, REJECTED
    const allApplications = await this.dashboardService['prisma'].application.findMany();
    const inProcess = allApplications.filter(app => 
      ['PENDING', 'REVIEWING', 'INTERVIEW', 'OFFERED'].includes(app.status)
    ).length;
    const approved = allApplications.filter(app => app.status === 'ACCEPTED').length;
    const rejected = allApplications.filter(app => app.status === 'REJECTED').length;

    return {
      summary: [
        { label: 'Total', value: candidates.length },
        { label: 'Em Processo', value: inProcess },
      ],
      detailedInfo: [
        { label: 'Total de Candidatos', value: candidates.length },
        { label: 'Candidatos Ativos', value: candidates.filter(c => c.status === 'ACTIVE').length },
        { label: 'Em Processo Seletivo', value: inProcess },
        { label: 'Aprovados', value: approved },
        { label: 'Reprovados', value: rejected },
        { 
          label: 'Taxa de Aprovação', 
          value: metrics.applications > 0 
            ? `${((approved / metrics.applications) * 100).toFixed(1)}%`
            : '0%'
        },
      ],
      charts: {
        evolution: analysis.evolution,
        activities: analysis.activities,
        byState: analysis.byState,
        byGender: analysis.byGender,
        byAge: analysis.byAge,
        topPositions: analysis.topPositions,
      },
    };
  }

  @Get('reports/vacancies')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  async getVacanciesReport() {
    const analysis = await this.dashboardService.getVacanciesAnalysis();
    const metrics = await this.dashboardService.getGeneralMetrics();

    const vacancies = await this.dashboardService['prisma'].vacancy.findMany();
    const avgApplications = vacancies.length > 0 
      ? Math.round(metrics.applications / vacancies.length)
      : 0;

    const openVacancies = vacancies.filter(v => v.status === 'OPEN');
    const avgDaysOpen = openVacancies.length > 0
      ? Math.round(
          openVacancies.reduce((sum, v) => {
            const days = Math.floor((Date.now() - v.createdAt.getTime()) / (1000 * 60 * 60 * 24));
            return sum + days;
          }, 0) / openVacancies.length
        )
      : 0;

    const fillRate = vacancies.length > 0
      ? ((vacancies.filter(v => v.status === 'CLOSED').length / vacancies.length) * 100).toFixed(1)
      : '0';

    return {
      summary: [
        { label: 'Total', value: vacancies.length },
        { label: 'Abertas', value: openVacancies.length },
      ],
      detailedInfo: [
        { label: 'Vagas Abertas', value: openVacancies.length },
        { label: 'Vagas Fechadas', value: vacancies.filter(v => v.status === 'CLOSED').length },
        { label: 'Total de Candidaturas', value: metrics.applications },
        { label: 'Média por Vaga', value: avgApplications },
        { label: 'Tempo Médio Aberto', value: `${avgDaysOpen} dias` },
        { label: 'Taxa de Preenchimento', value: `${fillRate}%` },
      ],
      charts: {
        evolution: analysis.evolution,
        byStatus: analysis.byStatus,
        bySector: analysis.bySector,
        byPosition: analysis.byPosition,
        byRegion: analysis.byRegion,
      },
    };
  }

  @Get('reports/users')
  @Roles('ADMIN')
  async getUsersReport() {
    const users = await this.dashboardService['prisma'].user.findMany({
      include: { company: true },
    });

    const roleCount = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      summary: [
        { label: 'Total', value: users.length },
        { label: 'Admins', value: roleCount['ADMIN'] || 0 },
      ],
      detailedInfo: [
        { label: 'Total de Usuários', value: users.length },
        { label: 'Administradores', value: roleCount['ADMIN'] || 0 },
        { label: 'Gerentes', value: roleCount['MANAGER'] || 0 },
        { label: 'Recrutadores', value: roleCount['RECRUITER'] || 0 },
        { label: 'Visualizadores', value: roleCount['VIEWER'] || 0 },
        { label: 'Usuários Ativos', value: users.filter(u => u.status === 'ACTIVE').length },
        { label: 'Última Atualização', value: new Date().toLocaleDateString('pt-BR') },
      ],
      charts: {
        byRole: Object.entries(roleCount).map(([role, count]) => ({
          role,
          count,
        })),
        byCompany: users.reduce((acc, user) => {
          const company = user.company?.name || 'Sem empresa';
          acc[company] = (acc[company] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      },
    };
  }
}
