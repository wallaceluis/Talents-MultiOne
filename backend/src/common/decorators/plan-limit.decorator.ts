import { SetMetadata } from '@nestjs/common';

export const PLAN_LIMIT_KEY = 'planLimit';
export const PlanLimit = (type: 'users' | 'candidates' | 'vacancies') =>
  SetMetadata(PLAN_LIMIT_KEY, type);
