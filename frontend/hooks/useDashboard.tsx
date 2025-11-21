'use client';

import { useState } from 'react';
import api from '../lib/api';

export interface DashboardMetrics {
  companies: number;
  vacancies: number;
  candidates: number;
  applications: number;
}

export interface CandidatesAnalysis {
  evolution: { month: string; total: number }[];
  activities: { name: string; value: number }[];
  byState: { state: string; count: number }[];
  byGender: { name: string; value: number }[];
  byAge: { range: string; count: number }[];
  topPositions: { position: string; count: number }[];
}

export interface CompaniesAnalysis {
  evolution: { month: string; total: number }[];
  bySegment: { name: string; value: number }[];
  byState: { state: string; count: number }[];
  topByVacancies: { company: string; vacancies: number }[];
  topByCandidates: { company: string; applications: number }[];
}

export interface VacanciesAnalysis {
  evolution: { month: string; total: number }[];
  byStatus: { name: string; value: number }[];
  bySector: { sector: string; count: number }[];
  byPosition: { position: string; count: number }[];
  byRegion: { region: string; count: number }[];
}

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    companies: 0,
    vacancies: 0,
    candidates: 0,
    applications: 0,
  });

  const [candidatesAnalysis, setCandidatesAnalysis] = useState<CandidatesAnalysis | null>(null);
  const [companiesAnalysis, setCompaniesAnalysis] = useState<CompaniesAnalysis | null>(null);
  const [vacanciesAnalysis, setVacanciesAnalysis] = useState<VacanciesAnalysis | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar métricas gerais
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<DashboardMetrics>('/dashboard/metrics');
      const data = response.data;
      setMetrics(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar métricas';
      setError(message);
      console.error('Erro ao buscar métricas:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar análise de candidatos
  const fetchCandidatesAnalysis = async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<CandidatesAnalysis>('/dashboard/candidates-analysis', { params: filters });
      const data = response.data;
      setCandidatesAnalysis(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar análise de candidatos';
      setError(message);
      console.error('Erro ao buscar análise de candidatos:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar análise de empresas
  const fetchCompaniesAnalysis = async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<CompaniesAnalysis>('/dashboard/companies-analysis', { params: filters });
      const data = response.data;
      setCompaniesAnalysis(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar análise de empresas';
      setError(message);
      console.error('Erro ao buscar análise de empresas:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Buscar análise de vagas
  const fetchVacanciesAnalysis = async (filters?: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<VacanciesAnalysis>('/dashboard/vacancies-analysis', { params: filters });
      const data = response.data;
      setVacanciesAnalysis(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar análise de vagas';
      setError(message);
      console.error('Erro ao buscar análise de vagas:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    metrics,
    candidatesAnalysis,
    companiesAnalysis,
    vacanciesAnalysis,
    loading,
    error,
    fetchMetrics,
    fetchCandidatesAnalysis,
    fetchCompaniesAnalysis,
    fetchVacanciesAnalysis,
  };
}