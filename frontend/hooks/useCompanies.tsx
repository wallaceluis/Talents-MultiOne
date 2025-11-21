'use client';

import { useState, useCallback } from 'react';
import api from '../lib/api';
import { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company';

export interface CompanyStats {
  total: number;
  active: number;
  inactive: number;
  trial?: number;
}

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Company[]>('/companies');
      const data = response.data;
      setCompanies(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar empresas';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<CompanyStats>('/companies/stats');
      const data = response.data;
      setStats(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar estatísticas';
      setError(message);
      console.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCompany = useCallback(async (data: CreateCompanyDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<Company>('/companies', data);
      const newCompany = response.data;
      setCompanies((prev) => [...prev, newCompany]);
      return newCompany;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar empresa';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompany = useCallback(async (id: string, data: UpdateCompanyDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.patch<Company>(`/companies/${id}`, data);
      const updatedCompany = response.data;
      setCompanies((prev) =>
        prev.map((company) => (company.id === id ? updatedCompany : company))
      );
      return updatedCompany;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar empresa';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCompany = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/companies/${id}`);
      setCompanies((prev) => prev.filter((company) => company.id !== id));
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao deletar empresa';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

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
  };
}
