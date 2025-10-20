import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';

export const PLAN_LIMIT_KEY = 'planLimit';

@Injectable()
export class PlanLimitGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const limitType = this.reflector.get<'users' | 'candidates' | 'vacancies'>(
      PLAN_LIMIT_KEY,
      context.getHandler(),
    );

    if (!limitType) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.companyId) {
      return true; // Admin sem company pode tudo
    }

    // Buscar company com plano
    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
      include: { plan: true },
    });

    if (!company) {
      throw new ForbiddenException('Empresa não encontrada');
    }

    // Verificar limite baseado no tipo
    let currentCount = 0;
    let maxLimit = 0;
    let resourceName = '';

    switch (limitType) {
      case 'users':
        currentCount = await this.prisma.user.count({
          where: { companyId: user.companyId },
        });
        maxLimit = company.plan.maxUsers;
        resourceName = 'usuários';
        break;

      case 'candidates':
        currentCount = await this.prisma.candidate.count({
          where: { companyId: user.companyId },
        });
        maxLimit = company.plan.maxCandidates;
        resourceName = 'candidatos';
        break;

      case 'vacancies':
        currentCount = await this.prisma.vacancy.count({
          where: { companyId: user.companyId },
        });
        maxLimit = company.plan.maxVacancies;
        resourceName = 'vagas';
        break;
    }

    if (currentCount >= maxLimit) {
      throw new ForbiddenException(
        `Limite de ${resourceName} atingido. Seu plano ${company.plan.name} permite apenas ${maxLimit} ${resourceName}. Faça upgrade do plano.`
      );
    }

    return true;
  }
}
