export interface Vacancy {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  type: 'CLT' | 'PJ' | 'FREELANCE' | 'INTERNSHIP' | 'TEMPORARY';
  workModel: 'REMOTE' | 'HYBRID' | 'ON_SITE';
  location?: string;
  salary?: number;
  status: 'DRAFT' | 'OPEN' | 'CLOSED' | 'FILLED';
  companyId: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface CreateVacancyDto {
  title: string;
  description: string;
  requirements?: string;
  benefits?: string;
  type: 'CLT' | 'PJ' | 'FREELANCE' | 'INTERNSHIP' | 'TEMPORARY';
  workModel: 'REMOTE' | 'HYBRID' | 'ON_SITE';
  location: string;
  salary?: number;
  companyId: string;
  skillIds?: string[];
}

export interface UpdateVacancyDto {
  title?: string;
  description?: string;
  requirements?: string;
  benefits?: string;
  type?: 'CLT' | 'PJ' | 'FREELANCE' | 'INTERNSHIP' | 'TEMPORARY';
  workModel?: 'REMOTE' | 'HYBRID' | 'ON_SITE';
  location?: string;
  salary?: number;
  status?: 'DRAFT' | 'OPEN' | 'CLOSED' | 'FILLED';
}
