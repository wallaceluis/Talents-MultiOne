import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import PDFDocument from 'pdfkit';
import * as ExcelJS from 'exceljs';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

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
    const evolution = await this.getCandidatesEvolution();

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

    const byGender = [
      { name: 'Masculino', value: Math.floor(totalCandidates * 0.54) },
      { name: 'Feminino', value: Math.floor(totalCandidates * 0.42) },
      { name: 'Outros', value: Math.floor(totalCandidates * 0.04) },
    ];

    const candidates = await this.prisma.candidate.findMany({
      where: { birthDate: { not: null } },
      select: { birthDate: true },
    });

    const byAge = this.calculateAgeRanges(candidates);

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
    const evolution = await this.getCompaniesEvolution();

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
    const evolution = await this.getVacanciesEvolution();

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

  // ============================================
  // RELATÓRIOS COMPLETOS (Dados)
  // ============================================

  async getGeneralReportData() {
    const metrics = await this.getGeneralMetrics();
    const candidatesAnalysis = await this.getCandidatesAnalysis();
    const companiesAnalysis = await this.getCompaniesAnalysis();
    const vacanciesAnalysis = await this.getVacanciesAnalysis();

    return {
      title: 'Relatório Geral',
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
      columns: [],
      rows: []
    };
  }

  async getCompaniesReportData() {
    const analysis = await this.getCompaniesAnalysis();
    const companies = await this.prisma.company.findMany({
      include: { plan: true },
    });

    const planStats = companies.reduce((acc, company) => {
      const planName = company.plan?.name || 'Sem plano';
      acc[planName] = (acc[planName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const rows = companies.map(c => [
      c.name,
      c.size || '-',
      c.domain || '-',
      c.location || '-',
      c.website || '-'
    ]);

    return {
      title: 'Relatório de Empresas',
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
      columns: ['Nome', 'Tamanho', 'Domínio', 'Local', 'Website'],
      rows
    };
  }

  async getCandidatesReportData() {
    const analysis = await this.getCandidatesAnalysis();
    const metrics = await this.getGeneralMetrics();
    const candidates = await this.prisma.candidate.findMany({
      include: { _count: { select: { applications: true } } }
    });

    const allApplications = await this.prisma.application.findMany();
    const inProcess = allApplications.filter(app =>
      ['PENDING', 'REVIEWING', 'INTERVIEW', 'OFFERED'].includes(app.status)
    ).length;
    const approved = allApplications.filter(app => app.status === 'ACCEPTED').length;
    const rejected = allApplications.filter(app => app.status === 'REJECTED').length;

    const rows = candidates.map(c => [
      c.name,
      c.email,
      c.status,
      c._count.applications.toString()
    ]);

    return {
      title: 'Relatório de Candidatos',
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
      columns: ['Nome', 'Email', 'Status', 'Candidaturas'],
      rows
    };
  }

  async getVacanciesReportData() {
    const analysis = await this.getVacanciesAnalysis();
    const metrics = await this.getGeneralMetrics();
    const vacancies = await this.prisma.vacancy.findMany({
      include: { company: true, _count: { select: { applications: true } } }
    });

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

    const rows = vacancies.map(v => [
      v.title,
      v.company.name,
      v.company.industry || '-',
      v._count.applications.toString(),
      v.status
    ]);

    return {
      title: 'Relatório de Vagas',
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
      columns: ['Título', 'Empresa', 'Setor', 'Candidaturas', 'Status'],
      rows
    };
  }

  async getUsersReportData() {
    const users = await this.prisma.user.findMany({
      include: { company: true },
    });

    const roleCount = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const rows = users.map(u => [
      u.name,
      u.email,
      u.role
    ]);

    return {
      title: 'Relatório de Usuários',
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
      columns: ['Nome', 'Email', 'Papel'],
      rows
    };
  }

  // ============================================
  // EXPORTAÇÃO
  // ============================================

  async exportReport(type: string, format: string) {
    let data: any;
    switch (type) {
      case 'general': data = await this.getGeneralReportData(); break;
      case 'companies': data = await this.getCompaniesReportData(); break;
      case 'candidates': data = await this.getCandidatesReportData(); break;
      case 'vacancies': data = await this.getVacanciesReportData(); break;
      case 'users': data = await this.getUsersReportData(); break;
      default: throw new Error('Relatório não encontrado');
    }

    const filename = `relatorio-${type}-${new Date().toISOString().split('T')[0]}`;

    if (format === 'pdf') {
      return {
        stream: await this.generatePdf(data),
        contentType: 'application/pdf',
        filename: `${filename}.pdf`
      };
    } else if (format === 'excel') {
      return {
        stream: await this.generateExcel(data),
        contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        filename: `${filename}.xlsx`
      };
    } else if (format === 'csv') {
      return {
        stream: this.generateCsv(data),
        contentType: 'text/csv',
        filename: `${filename}.csv`
      };
    }

    throw new Error('Formato não suportado');
  }

  private async generatePdf(data: any): Promise<Buffer> {
    return new Promise((resolve) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Header
      doc.fontSize(24).font('Helvetica-Bold').text('Talents MultiOne', { align: 'center' });
      doc.fontSize(12).font('Helvetica').text('Sistema de Gestão de Talentos', { align: 'center' });
      doc.moveDown();
      doc.moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
      doc.moveDown();

      // Title
      doc.fontSize(18).font('Helvetica-Bold').text(data.title, { align: 'left' });
      doc.fontSize(10).font('Helvetica').text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, { align: 'left' });
      doc.moveDown();

      // Summary
      doc.fontSize(14).font('Helvetica-Bold').text('Resumo');
      doc.moveDown(0.5);
      data.summary.forEach((item: any) => {
        doc.fontSize(11).font('Helvetica').text(`${item.label}: ${item.value}`);
      });
      doc.moveDown();

      // Detailed Info
      doc.fontSize(14).font('Helvetica-Bold').text('Detalhes');
      doc.moveDown(0.5);
      data.detailedInfo.forEach((item: any) => {
        doc.fontSize(11).font('Helvetica').text(`${item.label}: ${item.value}`);
      });
      doc.moveDown();

      // Data Table
      if (data.rows && data.rows.length > 0) {
        doc.addPage();
        doc.fontSize(14).font('Helvetica-Bold').text('Dados Detalhados');
        doc.moveDown();
        this.drawTable(doc, data.columns, data.rows);
      }

      doc.end();
    });
  }

  private drawTable(doc: any, columns: string[], rows: string[][]) {
    let y = doc.y;
    const startX = 50;
    const pageWidth = doc.page.width - 100;
    const colWidth = pageWidth / columns.length;

    // Header Background
    doc.rect(startX, y, pageWidth, 20).fill('#f0f0f0').stroke();
    doc.fillColor('black');

    // Header Text
    doc.font('Helvetica-Bold').fontSize(9);
    columns.forEach((col, i) => {
      doc.text(col, startX + (i * colWidth) + 2, y + 6, { width: colWidth - 4, align: 'left' });
    });

    y += 20;

    // Rows
    doc.font('Helvetica').fontSize(8);
    rows.forEach((row, rowIndex) => {
      if (y > doc.page.height - 50) {
        doc.addPage();
        y = 50;
        // Header on new page
        doc.rect(startX, y, pageWidth, 20).fill('#f0f0f0').stroke();
        doc.fillColor('black');
        doc.font('Helvetica-Bold').fontSize(9);
        columns.forEach((col, i) => {
          doc.text(col, startX + (i * colWidth) + 2, y + 6, { width: colWidth - 4, align: 'left' });
        });
        y += 20;
        doc.font('Helvetica').fontSize(8);
      }

      // Zebra striping
      if (rowIndex % 2 === 1) {
        doc.rect(startX, y, pageWidth, 15).fill('#f9f9f9');
        doc.fillColor('black');
      }

      row.forEach((cell, i) => {
        doc.text(String(cell).substring(0, 30), startX + (i * colWidth) + 2, y + 4, { width: colWidth - 4, align: 'left', lineBreak: false });
      });
      y += 15;

      // Border bottom
      doc.moveTo(startX, y).lineTo(startX + pageWidth, y).strokeColor('#eeeeee').stroke();
      doc.strokeColor('black'); // Reset
    });
  }

  private async generateExcel(data: any): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    // Sheet 1: Resumo
    const sheet = workbook.addWorksheet('Resumo');
    sheet.addRow([data.title]).font = { bold: true, size: 14 };
    sheet.addRow(['Gerado em', new Date().toLocaleDateString('pt-BR')]);
    sheet.addRow([]);

    sheet.addRow(['Resumo']).font = { bold: true };
    data.summary.forEach((item: any) => {
      sheet.addRow([item.label, item.value]);
    });
    sheet.addRow([]);

    sheet.addRow(['Detalhes']).font = { bold: true };
    data.detailedInfo.forEach((item: any) => {
      sheet.addRow([item.label, item.value]);
    });

    // Sheet 2: Dados
    if (data.rows && data.rows.length > 0) {
      const dataSheet = workbook.addWorksheet('Dados Detalhados');

      // Header
      const headerRow = dataSheet.addRow(data.columns);
      headerRow.font = { bold: true };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
      };

      // Rows
      data.rows.forEach((row: any[]) => {
        dataSheet.addRow(row);
      });

      // Auto width (approximate)
      dataSheet.columns.forEach(column => {
        column.width = 20;
      });
    }

    return await workbook.xlsx.writeBuffer() as any as Buffer;
  }

  private generateCsv(data: any): Buffer {
    let csvContent = `${data.title}\n`;
    csvContent += `Gerado em,${new Date().toLocaleDateString('pt-BR')}\n\n`;

    csvContent += 'Resumo\n';
    data.summary.forEach((item: any) => {
      csvContent += `${item.label},${item.value}\n`;
    });
    csvContent += '\n';

    csvContent += 'Detalhes\n';
    data.detailedInfo.forEach((item: any) => {
      csvContent += `${item.label},${item.value}\n`;
    });
    csvContent += '\n';

    if (data.rows && data.rows.length > 0) {
      csvContent += 'Dados Detalhados\n';
      csvContent += data.columns.join(',') + '\n';
      data.rows.forEach((row: any[]) => {
        csvContent += row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',') + '\n';
      });
    }

    return Buffer.from(csvContent, 'utf-8');
  }
}