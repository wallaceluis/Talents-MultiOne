'use client';
import { useState } from 'react';
import api from '../lib/api';


interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status?: string;
  position?: string;
  
}

interface CandidateStats {
  total: number;
  active: number;
  inProcess: number;
  hired: number;
}


export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [stats, setStats] = useState<CandidateStats>({ 
    total: 0, 
    active: 0, 
    inProcess: 0, 
    hired: 0 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async (): Promise<Candidate[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<Candidate[]>('/candidates');
      const data = res.data || [];
      setCandidates(Array.isArray(data) ? data : []);
      return data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar candidatos';
      setError(errorMessage);
      setCandidates([]);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (): Promise<CandidateStats | null> => {
    try {
      const res = await api.get<CandidateStats>('/candidates/stats');
      const data = res.data || { total: 0, active: 0, inProcess: 0, hired: 0 };
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
    setCandidates, 
  };
}