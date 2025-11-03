'use client';

import { useState } from 'react';
import api from '../lib/api';

export function useVacancies() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, open: 0, closed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vacancies');
      const data = res.data.data || res.data || [];
      setVacancies(Array.isArray(data) ? data : []);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar vagas');
      setVacancies([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/vacancies/stats');
      const data = res.data.data || res.data || {};
      setStats(data);
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar stats:', err);
      return null;
    }
  };

  const createVacancy = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post('/vacancies', data);
      const newVacancy = res.data.data || res.data;
      setVacancies(prev => [newVacancy, ...prev]);
      return { success: true, data: newVacancy };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const updateVacancy = async (id: string, data: any) => {
    setLoading(true);
    try {
      const res = await api.patch(`/vacancies/${id}`, data);
      const updated = res.data.data || res.data;
      setVacancies(prev => prev.map(v => v.id === id ? updated : v));
      return { success: true, data: updated };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteVacancy = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/vacancies/${id}`);
      setVacancies(prev => prev.filter(v => v.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

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
