'use client';
import { useState } from 'react';
import api from '../lib/api';

export function useCandidates() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, inProcess: 0, hired: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await api.get('/candidates');
      const data = res.data || [];
      setCandidates(Array.isArray(data) ? data : []);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao buscar candidatos');
      setCandidates([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get('/candidates/stats');
      const data = res.data || {};
      setStats(data);
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar stats:', err);
      return null;
    }
  };

  return {
    candidates,
    stats,
    loading,
    error,
    fetchCandidates,
    fetchStats,
  };
}
