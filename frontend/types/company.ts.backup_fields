export interface Plan {
  id: string;
  name: string;
  type: 'FREE' | 'BASIC' | 'PREMIUM';
  maxUsers?: number;
  maxCandidates?: number;
  maxVacancies?: number;
  price?: string;
  features?: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  status: 'ACTIVE' | 'INACTIVE';
  planId: string;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
  _count: {
    users: number;
    candidates: number;
    vacancies: number;
  };
}

export interface CreateCompanyDto {
  name: string;
  domain: string;
  planId: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateCompanyDto {
  name?: string;
  domain?: string;
  planId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface CompanyStats {
  total: number;
  active: number;
  inactive: number;
}
