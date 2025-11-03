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
      const data = res.data.data || res.data || [];
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
      const data = res.data.data || res.data || {};
      setStats(data);
      return data;
    } catch (err: any) {
      console.error('Erro ao buscar stats:', err);
      return null;
    }
  };

  const createCandidate = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.post('/candidates', data);
      const newCandidate = res.data.data || res.data;
      setCandidates(prev => [newCandidate, ...prev]);
      return { success: true, data: newCandidate };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const updateCandidate = async (id: string, data: any) => {
    setLoading(true);
    try {
      const res = await api.patch(`/candidates/${id}`, data);
      const updated = res.data.data || res.data;
      setCandidates(prev => prev.map(c => c.id === id ? updated : c));
      return { success: true, data: updated };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteCandidate = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/candidates/${id}`);
      setCandidates(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    candidates,
    stats,
    loading,
    error,
    fetchCandidates,
    fetchStats,
    createCandidate,
    updateCandidate,
    deleteCandidate,
  };
}
