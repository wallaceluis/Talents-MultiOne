export interface Plan {
  id: string;
  name: string;
  type: 'FREE' | 'BASIC' | 'PREMIUM';
  price: number;
  maxUsers: number;
  maxCandidates: number;
  maxVacancies: number;
  features?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanDto {
  name: string;
  type: 'FREE' | 'BASIC' | 'PREMIUM';
  price: number;
  maxUsers: number;
  maxCandidates: number;
  maxVacancies: number;
  features?: string[];
  isActive?: boolean;
}

export interface UpdatePlanDto {
  name?: string;
  type?: 'FREE' | 'BASIC' | 'PREMIUM';
  price?: number;
  maxUsers?: number;
  maxCandidates?: number;
  maxVacancies?: number;
  features?: string[];
  isActive?: boolean;
}
