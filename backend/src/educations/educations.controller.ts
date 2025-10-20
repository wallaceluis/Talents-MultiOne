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
import { EducationsService } from './educations.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('educations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EducationsController {
  constructor(private readonly educationsService: EducationsService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  create(@Body() createEducationDto: CreateEducationDto) {
    return this.educationsService.create(createEducationDto);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  findAll(@Query('candidateId') candidateId?: string) {
    return this.educationsService.findAll(candidateId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  findOne(@Param('id') id: string) {
    return this.educationsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  update(@Param('id') id: string, @Body() updateEducationDto: UpdateEducationDto) {
    return this.educationsService.update(id, updateEducationDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  remove(@Param('id') id: string) {
    return this.educationsService.remove(id);
  }
}
