import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adiciona token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - DESEMBRULHA response.data.data
api.interceptors.response.use(
  (response) => {
    // Se a resposta tem a estrutura do TransformInterceptor, extrair o data
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
    // Auto-logout em 401
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
