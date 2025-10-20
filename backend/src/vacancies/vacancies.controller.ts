import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('vacancies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  create(
    @Body() createVacancyDto: CreateVacancyDto,
    @CurrentUser() user: any,
  ) {
    return this.vacanciesService.create(createVacancyDto, user.userId);
  }

  @Get()
  @Public()
  findAll(
    @Query('companyId') companyId?: string,
    @Query('status') status?: string,
  ) {
    return this.vacanciesService.findAll(companyId, status);
  }

  @Get('stats')
  @Roles('ADMIN', 'MANAGER')
  getStats(@Query('companyId') companyId?: string) {
    return this.vacanciesService.getStats(companyId);
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  update(@Param('id') id: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return this.vacanciesService.update(id, updateVacancyDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  remove(@Param('id') id: string) {
    return this.vacanciesService.remove(id);
  }
}
