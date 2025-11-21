import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
        console.log(`🔑 Token adicionado à requisição: ${config.url}`);
      } else {
        console.warn('⚠️ Nenhum token encontrado!');
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Resposta: ${response.config.url} - Status: ${response.status}`);

    // Desembrulhar response.data se necessário
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return {
        ...response,
        data: response.data.data,
        _original: response.data,
      };
    }
    return response;
  },
  (error) => {
    console.error('❌ Erro na requisição:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message,
    });

    // Auto-logout em 401
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        alert('Sua sessão expirou. Faça login novamente.');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
