export interface Plan {
  id: string;
  name: string;
  type: 'FREE' | 'BASIC' | 'PREMIUM';
  maxUsers: number;
  maxCandidates: number;
  maxVacancies: number;
  price: string;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    companies: number;
  };
}

export interface CreatePlanDto {
  name: string;
  type: 'FREE' | 'BASIC' | 'PREMIUM';
  maxUsers: number;
  maxCandidates: number;
  maxVacancies: number;
  price: string;
  features: string[];
}

export interface UpdatePlanDto {
  name?: string;
  maxUsers?: number;
  maxCandidates?: number;
  maxVacancies?: number;
  price?: string;
  features?: string[];
  isActive?: boolean;
}
