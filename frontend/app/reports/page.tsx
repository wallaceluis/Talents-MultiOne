'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { ReportCard } from '../../components/ui/card-reports';
import { useReports } from '../../hooks/useReports';
import { ClipboardList } from 'lucide-react';
import {
  LayoutDashboard,
  Building2,
  FileUser,
  Briefcase,
  Users
} from 'lucide-react';

export default function ReportsPage() {
  const { currentTheme } = useTheme();
  const { reports, loading, fetchReport, exportReport } = useReports();
  const [loadingAll, setLoadingAll] = useState(true);

  // Definição dos relatórios
  const reportsConfig = [
    {
      id: 'general',
      title: 'Dashboard Geral',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      downloadFormats: ['pdf', 'excel'] as const,
    },
    {
      id: 'companies',
      title: 'Empresas',
      icon: Building2,
      color: 'text-purple-500',
      downloadFormats: ['pdf', 'excel', 'csv'] as const,
    },
    {
      id: 'candidates',
      title: 'Candidatos',
      icon: FileUser,
      color: 'text-red-500',
      downloadFormats: ['pdf', 'excel', 'csv'] as const,
    },
    {
      id: 'vacancies',
      title: 'Vagas',
      icon: Briefcase,
      color: 'text-yellow-400',
      downloadFormats: ['pdf', 'excel', 'csv'] as const,
    },
    {
      id: 'users',
      title: 'Usuários',
      icon: Users,
      color: 'text-green-500',
      downloadFormats: ['pdf', 'csv'] as const,
    },
  ];

  // Carregar TODOS os relatórios automaticamente ao montar
  useEffect(() => {
    const loadAllReports = async () => {
      console.log('🔄 Carregando todos os relatórios automaticamente...');
      setLoadingAll(true);

      try {
        // Carregar todos em paralelo
        await Promise.all(
          reportsConfig.map(report => fetchReport(report.id))
        );
        console.log('✅ Todos os relatórios carregados!');
      } catch (error) {
        console.error('❌ Erro ao carregar relatórios:', error);
      } finally {
        setLoadingAll(false);
      }
    };

    loadAllReports();
  }, []); // Executa apenas uma vez ao montar

  const handleViewReport = async (reportId: string) => {
    // Dados já estão carregados, não precisa buscar novamente
    console.log(`👁️ Visualizando relatório: ${reportId}`);
  };

  const handleExport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    const result = await exportReport(reportId, format);
    if (result.success) {
      alert(`✅ Relatório ${reportId} exportado como ${format.toUpperCase()}!`);
    } else {
      alert(`❌ Erro ao exportar: ${result.error}`);
    }
  };

  return (
    <main className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className={`${currentTheme.iconColor}`} size={32} />
          <h1 className={`text-2xl md:text-4xl font-bold ${currentTheme.mainText}`}>
            Relatórios
          </h1>
        </div>
        <p className={`text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
          {loadingAll ? 'Carregando dados em tempo real...' : 'Dados carregados automaticamente do banco de dados'}
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {reportsConfig.map((report) => {
          const reportData = reports[report.id];
          const isLoading = loading[report.id];

          return (
            <ReportCard
              key={report.id}
              id={report.id}
              title={report.title}
              icon={report.icon}
              color={report.color}
              summary={reportData?.summary || [
                { label: 'Carregando', value: '...' },
              ]}
              detailedInfo={reportData?.detailedInfo || []}
              downloadFormats={[...report.downloadFormats]}
              onView={() => handleViewReport(report.id)}
              onExport={(format) => handleExport(report.id, format)}
              loading={isLoading}
            />
          );
        })}
      </div>

      {/* Informação adicional */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${currentTheme.titleColor} mb-2`}>
          💡 Como usar
        </h3>
        <p className={`text-sm ${currentTheme.cardText} mb-2`}>
          <strong>✅ Carregamento automático:</strong> Os dados são carregados automaticamente ao abrir a página
        </p>
        <p className={`text-sm ${currentTheme.cardText} mb-2`}>
          <strong>👁️ Ver Detalhes:</strong> Clique em "Ver Detalhes" no card para abrir o modal completo
        </p>
        <p className={`text-sm ${currentTheme.cardText}`}>
          <strong>📥 Exportar:</strong> Use os botões PDF/EXCEL/CSV para baixar os relatórios
        </p>
      </div>
    </main>
  );
}
