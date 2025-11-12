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
      
      const response = await api.get(`/dashboard/reports/${reportId}`);
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
      
      // Buscar dados do relatório se não existir
      let reportData = reports[reportId];
      if (!reportData) {
        reportData = await fetchReport(reportId);
      }

      // Simular download
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${reportId}-${new Date().toISOString().split('T')[0]}.${format}`;
      link.click();
      URL.revokeObjectURL(url);

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
