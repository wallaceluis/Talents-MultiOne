export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'RECRUITER' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  companyId?: string;
  createdAt: string;
  updatedAt: string;
  company?: {
    id: string;
    name: string;
  };
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'RECRUITER' | 'USER';
  status?: 'ACTIVE' | 'INACTIVE';
  companyId?: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  role?: 'ADMIN' | 'RECRUITER' | 'USER';
  status?: 'ACTIVE' | 'INACTIVE';
  companyId?: string;
}
