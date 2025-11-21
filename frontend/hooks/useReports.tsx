import { useState } from 'react';
import api from '../lib/api';

export interface ReportData {
  id: string;
  title: string;
  summary: { label: string; value: string | number }[];
  detailedInfo: { label: string; value: string | number }[];
  charts?: any;
}

export const useReports = () => {
  const [reports, setReports] = useState<Record<string, ReportData>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Buscar relatório específico
  const fetchReport = async (reportId: string) => {
    try {
      console.log(`🔍 Buscando relatório: ${reportId}...`);

      setLoading(prev => ({ ...prev, [reportId]: true }));

      const response = await api.get<any>(`/dashboard/reports/${reportId}`);
      console.log(`✅ Relatório ${reportId} carregado:`, response.data);

      setReports(prev => ({
        ...prev,
        [reportId]: {
          id: reportId,
          title: reportId.charAt(0).toUpperCase() + reportId.slice(1),
          summary: response.data.summary || [],
          detailedInfo: response.data.detailedInfo || [],
          charts: response.data.charts,
        },
      }));

      setError(null);
      setLoading(prev => ({ ...prev, [reportId]: false }));
      return response.data;
    } catch (err: any) {
      console.error(`❌ Erro ao buscar relatório ${reportId}:`, err);
      console.error('Detalhes:', err.response?.data);

      setError(err.response?.data?.message || 'Erro ao buscar relatório');
      setLoading(prev => ({ ...prev, [reportId]: false }));

      // Mostrar erro ao usuário
      const errorMsg = err.response?.data?.message || err.message;
      alert(`❌ Erro ao carregar ${reportId}: ${errorMsg}`);

      throw err;
    }
  };

  // Exportar relatório
  const exportReport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    try {
      console.log(`📥 Exportando ${reportId} como ${format}...`);

      const response = await api.get(`/dashboard/reports/${reportId}/export`, {
        params: { format },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
      const link = document.createElement('a');
      link.href = url;

      const contentDisposition = response.headers['content-disposition'];
      let filename = `relatorio-${reportId}.${format === 'excel' ? 'xlsx' : format}`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) filename = match[1];
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      console.log(`✅ Exportado com sucesso!`);
      return { success: true };
    } catch (err: any) {
      console.error(`❌ Erro ao exportar:`, err);
      return {
        success: false,
        error: err.response?.data?.message || 'Erro ao exportar relatório'
      };
    }
  };

  return {
    reports,
    loading,
    error,
    fetchReport,
    exportReport,
  };
};
