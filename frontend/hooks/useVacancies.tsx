'use client';

import { useState, useCallback } from 'react';
import api from '../lib/api';
import { Vacancy, CreateVacancyDto, UpdateVacancyDto } from '../types/vacancy';

export interface VacancyStats {
  total: number;
  active: number;
  filled: number;
}

export function useVacancies() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [stats, setStats] = useState<VacancyStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVacancies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Vacancy[]>('/vacancies');
      const data = response.data;
      setVacancies(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar vagas';
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
      const response = await api.get<VacancyStats>('/vacancies/stats');
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

  const createVacancy = useCallback(async (data: CreateVacancyDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post<Vacancy>('/vacancies', data);
      const newVacancy = response.data;
      setVacancies((prev) => [...prev, newVacancy]);
      return newVacancy;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar vaga';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVacancy = useCallback(async (id: string, data: UpdateVacancyDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.patch<Vacancy>(`/vacancies/${id}`, data);
      const updatedVacancy = response.data;
      setVacancies((prev) =>
        prev.map((vacancy) => (vacancy.id === id ? updatedVacancy : vacancy))
      );
      return updatedVacancy;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar vaga';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVacancy = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/vacancies/${id}`);
      setVacancies((prev) => prev.filter((vacancy) => vacancy.id !== id));
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao deletar vaga';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    vacancies,
    stats,
    loading,
    error,
    fetchVacancies,
    fetchStats,
    createVacancy,
    updateVacancy,
    deleteVacancy,
  };
}
