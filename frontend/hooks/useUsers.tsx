'use client';

import { useState, useCallback } from 'react';
import api from '../lib/api';
import { User, CreateUserDto, UpdateUserDto } from '../types/user';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/users');
      const data = response.data.data || response.data;
      setUsers(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao buscar usuários';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: CreateUserDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.post('/users', data);
      const newUser = response.data.data || response.data;
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao criar usuário';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      return true;
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao deletar usuário';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    deleteUser,
  };
}
