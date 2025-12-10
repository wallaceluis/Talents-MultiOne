export interface Company {
  id: string;
  name: string;
  domain?: string;
  cnpj?: string;
  fantasyName?: string; // Nome Fantasia
  sector?: string;
  subSector?: string; // Segmento
  website?: string;
  linkedin?: string;
  description?: string;

  // Address
  zipCode?: string; // CEP
  address?: string; // Logradouro
  number?: string;
  complement?: string;
  neighborhood?: string; // Bairro
  city?: string;
  state?: string; // UF

  status: 'ACTIVE' | 'INACTIVE' | 'TRIAL';
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
  cnpj?: string;
  fantasyName?: string;
  sector?: string;
  subSector?: string;
  website?: string;
  linkedin?: string;
  description?: string;
  zipCode?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  planId?: string;
}

export interface UpdateCompanyDto {
  name?: string;
  domain?: string;
  cnpj?: string;
  fantasyName?: string;
  sector?: string;
  subSector?: string;
  website?: string;
  linkedin?: string;
  description?: string;
  zipCode?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  planId?: string;
}
