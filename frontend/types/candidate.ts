export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'INACTIVE' | 'IN_PROCESS';
  companyId: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
  };
  _count?: {
    applications: number;
  };
}

export interface CreateCandidateDto {
  name: string;
  email: string;
  phone: string;
  companyId: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'IN_PROCESS';
}

export interface UpdateCandidateDto {
  name?: string;
  email?: string;
  phone?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'IN_PROCESS';
}
