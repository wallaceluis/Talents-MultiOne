'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/api';

// ============================================
// TIPOS
// ============================================
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  companyId?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

// ============================================
// CONTEXT
// ============================================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const loadUser = () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Redirecionar para /auth se não estiver logado (exceto na página de auth)
  useEffect(() => {
    if (!loading && !user && pathname && !pathname.startsWith('/auth')) {
      router.push('/auth');
    }
  }, [user, loading, pathname, router]);

  // Login
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 Iniciando login...', { email });
      
      const response = await api.post('/auth/login', { email, password });
      console.log('✅ Resposta da API:', response.data);
      
      const { access_token, user: userData } = response.data;
      
      if (!access_token) {
        throw new Error('Token não encontrado na resposta');
      }
      
      // Salvar no localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Atualizar estado
      setUser(userData);
      
      console.log('✅ Login concluído! Redirecionando...');
      
      // Redirecionar para dashboard
      router.push('/dashboard');
      
      return { success: true };
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// HOOK CUSTOMIZADO
// ============================================
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
