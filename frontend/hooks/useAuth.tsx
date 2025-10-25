'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        console.log('🔑 Token no localStorage:', token ? 'EXISTE' : 'NÃO EXISTE');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        console.log('📤 Configurando Authorization header...');
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        console.log('📤 Chamando /auth/me...');
        const response = await api.get('/auth/me');
        
        console.log('✅ Resposta /auth/me:', response.data);
        const userData = response.data.data || response.data;
        setUser(userData);
      } catch (error) {
        console.error('❌ Erro ao carregar usuário:', error);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Tentando login...', { email });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('📥 Resposta completa do login:', response);
      console.log('📥 response.data:', response.data);
      
      const responseData = response.data.data || response.data;
      console.log('📥 responseData:', responseData);
      
      const { access_token, user: userData } = responseData;
      
      console.log('🔑 Token recebido:', access_token);
      console.log('👤 Usuário recebido:', userData);
      
      if (!access_token) {
        throw new Error('Token não recebido do servidor');
      }
      
      console.log('💾 Salvando token no localStorage...');
      localStorage.setItem('token', access_token);
      
      console.log('🔧 Configurando header Authorization...');
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      console.log('✅ Atualizando estado do usuário...');
      setUser(userData);
      
      console.log('🎯 Redirecionando para /dashboard...');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      console.error('❌ error.response:', error.response);
      throw new Error(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Fazendo logout...');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    router.push('/auth');
  };

  const authValue = {
    user: user,
    loading: loading,
    login: login,
    logout: logout,
    isAuthenticated: user !== null
  };

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
