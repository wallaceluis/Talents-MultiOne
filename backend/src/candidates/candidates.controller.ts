import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('candidates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get()
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  findAll(@Query('companyId') companyId?: string) {
    return this.candidatesService.findAll(companyId);
  }

  @Get('stats')
  @Roles('ADMIN', 'MANAGER')
  getStats() {
    return this.candidatesService.getStats();
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }
}
