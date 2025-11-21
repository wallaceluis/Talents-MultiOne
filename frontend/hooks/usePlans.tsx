'use client';

import { useState, useCallback } from 'react';
import api from '../lib/api';
import { Plan, CreatePlanDto, UpdatePlanDto } from '../types/plan';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/plans');
      const data = (response.data as any).data || response.data;
      setPlans(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar planos';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (data: CreatePlanDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/plans', data);
      const newPlan = (response.data as any).data || response.data;
      setPlans((prev) => [...prev, newPlan]);
      return newPlan;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar plano';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePlan = useCallback(async (id: string, data: UpdatePlanDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.patch(`/plans/${id}`, data);
      const updatedPlan = (response.data as any).data || response.data;
      setPlans((prev) =>
        prev.map((plan) => (plan.id === id ? updatedPlan : plan))
      );
      return updatedPlan;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao atualizar plano';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/plans/${id}`);
      setPlans((prev) => prev.filter((plan) => plan.id !== id));
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao deletar plano';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    plans,
    loading,
    error,
    fetchPlans,
    createPlan,
    updatePlan,
    deletePlan,
  };
}
