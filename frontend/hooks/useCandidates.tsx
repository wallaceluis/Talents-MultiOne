'use client';

import { useState, useCallback } from 'react';
import api from '../lib/api';
import { Candidate, CreateCandidateDto, UpdateCandidateDto } from '../types/candidate';

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/candidates');
      const data = response.data.data || response.data;
      setCandidates(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar candidatos';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCandidateById = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/candidates/${id}`);
      return response.data.data || response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar candidato';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCandidate = useCallback(async (data: CreateCandidateDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/candidates', data);
      const newCandidate = response.data.data || response.data;
      setCandidates((prev) => [...prev, newCandidate]);
      return newCandidate;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar candidato';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCandidate = useCallback(async (id: string, data: UpdateCandidateDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.patch(`/candidates/${id}`, data);
      const updatedCandidate = response.data.data || response.data;
      setCandidates((prev) =>
        prev.map((candidate) => (candidate.id === id ? updatedCandidate : candidate))
      );
      return updatedCandidate;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar candidato';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCandidate = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/candidates/${id}`);
      setCandidates((prev) => prev.filter((candidate) => candidate.id !== id));
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao deletar candidato';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    candidates,
    loading,
    error,
    fetchCandidates,
    fetchCandidateById,
    createCandidate,
    updateCandidate,
    deleteCandidate,
  };
}
