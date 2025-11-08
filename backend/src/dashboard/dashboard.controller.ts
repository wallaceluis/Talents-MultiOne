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
}