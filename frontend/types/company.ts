export interface Company {
  id: string;
  name: string;
  domain?: string;
  status: 'ACTIVE' | 'INACTIVE';
  planId: string;
  createdAt: string;
  updatedAt: string;
  plan?: {
    id: string;
    name: string;
  };
}

export interface CreateCompanyDto {
  name: string;
  domain?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  planId: string;
}

export interface UpdateCompanyDto {
  name?: string;
  domain?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  planId?: string;
}
