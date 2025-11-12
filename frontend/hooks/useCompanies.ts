import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface Company {
  id: string;
  name: string;
  domain: string;
  status: string;
  planId?: string;
  plan?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CompanyStats {
  total: number;
  active: number;
  trial: number;
  inactive: number;
}

export const useCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<CompanyStats>({
    total: 0,
    active: 0,
    trial: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar lista de empresas
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/companies');
      console.log('✅ Empresas carregadas:', response.data);
      setCompanies(response.data || []);
      setError(null);
    } catch (err: any) {
      console.error('❌ Erro ao buscar empresas:', err);
      setError(err.response?.data?.message || 'Erro ao buscar empresas');
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  // Buscar estatísticas
  const fetchStats = async () => {
    try {
      const response = await api.get('/companies/stats');
      console.log('✅ Stats carregadas:', response.data);
      setStats(response.data || { total: 0, active: 0, trial: 0, inactive: 0 });
    } catch (err: any) {
      console.error('❌ Erro ao buscar stats:', err);
      // Calcular stats localmente se API falhar
      const total = companies.length;
      const active = companies.filter(c => c.status === 'ACTIVE').length;
      const trial = companies.filter(c => c.status === 'TRIAL').length;
      const inactive = companies.filter(c => c.status === 'INACTIVE').length;
      setStats({ total, active, trial, inactive });
    }
  };

  // Criar empresa
  const createCompany = async (data: { name: string; domain: string; planId?: string }) => {
    try {
      const response = await api.post('/companies', data);
      console.log('✅ Empresa criada:', response.data);
      await fetchCompanies();
      await fetchStats();
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('❌ Erro ao criar empresa:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Erro ao criar empresa' 
      };
    }
  };

  // Atualizar empresa
  const updateCompany = async (id: string, data: { name?: string; domain?: string; planId?: string }) => {
    try {
      const response = await api.patch(`/companies/${id}`, data);
      console.log('✅ Empresa atualizada:', response.data);
      await fetchCompanies();
      await fetchStats();
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('❌ Erro ao atualizar empresa:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Erro ao atualizar empresa' 
      };
    }
  };

  // Deletar empresa
  const deleteCompany = async (id: string) => {
    try {
      await api.delete(`/companies/${id}`);
      console.log('✅ Empresa deletada:', id);
      await fetchCompanies();
      await fetchStats();
      return { success: true };
    } catch (err: any) {
      console.error('❌ Erro ao deletar empresa:', err);
      return { 
        success: false, 
        error: err.response?.data?.message || 'Erro ao deletar empresa' 
      };
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (companies.length > 0) {
      fetchStats();
    }
  }, [companies]);

  return { 
    companies, 
    stats,
    loading, 
    error, 
    fetchCompanies,
    fetchStats,
    createCompany,
    updateCompany,
    deleteCompany,
    refetch: fetchCompanies 
  };
};
