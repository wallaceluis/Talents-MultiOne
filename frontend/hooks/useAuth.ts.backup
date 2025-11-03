'use client';

import { useState } from 'react';
import api from '../lib/api';

interface LoginDto {
  email: string;
  password: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthResponse {
  access_token: string;
  user: User;
}

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (credentials: LoginDto) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔵 [useAuth] Iniciando login com:', credentials.email);
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      console.log('🟢 [useAuth] Resposta da API:', response.data);
      
      const { access_token, user: userData } = response.data;
      
      console.log('🟡 [useAuth] Token recebido:', access_token ? 'SIM' : 'NÃO');
      console.log('🟡 [useAuth] Salvando no localStorage...');
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('🟢 [useAuth] Token salvo! Verificando...');
      console.log('🟢 [useAuth] Token no localStorage:', localStorage.getItem('token') ? 'EXISTE' : 'NÃO EXISTE');
      
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (err: any) {
      console.error('🔴 [useAuth] Erro no login:', err);
      const msg = err.response?.data?.message || err.message || 'Erro ao fazer login';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
      return { success: true };
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Erro ao criar conta';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/auth';
  };

  return { user, loading, error, login, register, logout };
}
