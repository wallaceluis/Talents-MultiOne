export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  resume?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'IN_PROCESS';
  companyId?: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface CreateCandidateDto {
  name: string;
  email: string;
  phone?: string;
  resume?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'IN_PROCESS';
  companyId?: string;
}

export interface UpdateCandidateDto {
  name?: string;
  email?: string;
  phone?: string;
  resume?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'IN_PROCESS';
  companyId?: string;
}
