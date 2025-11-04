'use client';
import { useState } from 'react';
import api from '../lib/api';

export function useVacancies() {
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [stats, setStats] = useState({ open: 0, total: 0, closed: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const res = await api.get('/vacancies');
      const data = res.data || [];
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
      const data = res.data || {};
      setStats(data);
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar stats:', err);
      return null;
    }
  };

  return {
    vacancies,
    stats,
    loading,
    error,
    fetchVacancies,
    fetchStats,
  };
}
