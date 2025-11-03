'use client';

import { useState, useEffect } from 'react';
import api from '../lib/api';

export function useDashboard() {
  const [stats, setStats] = useState({
    companies: 0,
    vacancies: 0,
    candidates: 0,
    applications: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Buscar estatísticas de cada módulo
      const [companies, vacancies, candidates] = await Promise.all([
        api.get('/companies/stats'),
        api.get('/vacancies/stats'),
        api.get('/candidates/stats')
      ]);

      setStats({
        companies: companies.data.total || 0,
        vacancies: vacancies.data.open || 0,
        candidates: candidates.data.total || 0,
        applications: 0 // TODO: adicionar endpoint
      });
    } catch (err: any) {
      console.error('Erro ao buscar estatísticas:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refresh: fetchStats };
}
