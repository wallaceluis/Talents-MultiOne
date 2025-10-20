import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('experiences')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  create(@Body() createExperienceDto: CreateExperienceDto) {
    return this.experiencesService.create(createExperienceDto);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  findAll(@Query('candidateId') candidateId?: string) {
    return this.experiencesService.findAll(candidateId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  findOne(@Param('id') id: string) {
    return this.experiencesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  update(@Param('id') id: string, @Body() updateExperienceDto: UpdateExperienceDto) {
    return this.experiencesService.update(id, updateExperienceDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  remove(@Param('id') id: string) {
    return this.experiencesService.remove(id);
  }
}
