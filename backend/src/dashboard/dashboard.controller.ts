import { Controller, Get, UseGuards, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('metrics')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getGeneralMetrics() {
    return this.dashboardService.getGeneralMetrics();
  }

  @Get('candidates-analysis')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getCandidatesAnalysis() {
    return this.dashboardService.getCandidatesAnalysis();
  }

  @Get('companies-analysis')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getCompaniesAnalysis() {
    return this.dashboardService.getCompaniesAnalysis();
  }

  @Get('vacancies-analysis')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getVacanciesAnalysis() {
    return this.dashboardService.getVacanciesAnalysis();
  }

  // ============================================
  // ENDPOINTS DE RELATÓRIOS
  // ============================================

  @Get('reports/general')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getGeneralReport() {
    return this.dashboardService.getGeneralReportData();
  }

  @Get('reports/companies')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getCompaniesReport() {
    return this.dashboardService.getCompaniesReportData();
  }

  @Get('reports/candidates')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getCandidatesReport() {
    return this.dashboardService.getCandidatesReportData();
  }

  @Get('reports/vacancies')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async getVacanciesReport() {
    return this.dashboardService.getVacanciesReportData();
  }

  @Get('reports/users')
  @Roles('ADMIN', 'VIEWER')
  async getUsersReport() {
    return this.dashboardService.getUsersReportData();
  }

  @Get('reports/:type/export')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER', 'VIEWER')
  async exportReport(
    @Param('type') type: string,
    @Query('format') format: string,
    @Res() res: Response
  ) {
    const result = await this.dashboardService.exportReport(type, format);

    res.set({
      'Content-Type': result.contentType,
      'Content-Disposition': `attachment; filename="${result.filename}"`,
    });

    res.send(result.stream);
  }
}
