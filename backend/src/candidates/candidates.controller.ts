import { 
  Controller, 
  Get, 
  Post,
  Patch,
  Delete,
  Body,
  Param, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('candidates')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

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

  @Patch(':id')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  update(@Param('id') id: string, @Body() updateCandidateDto: UpdateCandidateDto) {
    return this.candidatesService.update(id, updateCandidateDto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'MANAGER')
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }

  // Gerenciar Skills
  @Post(':id/skills/:skillId')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  addSkill(@Param('id') id: string, @Param('skillId') skillId: string) {
    return this.candidatesService.addSkill(id, skillId);
  }

  @Delete(':id/skills/:skillId')
  @Roles('ADMIN', 'MANAGER', 'RECRUITER')
  removeSkill(@Param('id') id: string, @Param('skillId') skillId: string) {
    return this.candidatesService.removeSkill(id, skillId);
  }
}
