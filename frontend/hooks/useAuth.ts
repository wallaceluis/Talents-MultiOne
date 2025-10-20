import { useState } from 'react';
import api from '../lib/api';

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post('/auth/login', data);
      
      const { access_token, user } = response.data;

      // Salvar token e user no localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));

      return { success: true, user };
    } catch (err: any) {
      const message = err.response?.data?.message || 'Erro ao fazer login';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth';
  };

  const getUser = (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };

  const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
  };

  return {
    login,
    logout,
    getUser,
    isAuthenticated,
    loading,
    error,
  };
};
