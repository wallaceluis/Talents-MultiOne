'use client';

import { useState } from 'react';
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

  // Definição dos relatórios com placeholders
  const reportsConfig = [
    {
      id: 'general',
      title: 'Dashboard Geral',
      icon: LayoutDashboard,
      color: 'text-blue-500',
      downloadFormats: ['pdf', 'excel'] as const,
      placeholder: [
        { label: 'Clique para', value: 'Carregar' },
        { label: 'Dados', value: 'Reais' },
      ],
    },
    {
      id: 'companies',
      title: 'Empresas',
      icon: Building2,
      color: 'text-purple-500',
      downloadFormats: ['pdf', 'excel', 'csv'] as const,
      placeholder: [
        { label: 'Clique para', value: 'Carregar' },
        { label: 'Dados', value: 'Reais' },
      ],
    },
    {
      id: 'candidates',
      title: 'Candidatos',
      icon: FileUser,
      color: 'text-red-500',
      downloadFormats: ['pdf', 'excel', 'csv'] as const,
      placeholder: [
        { label: 'Clique para', value: 'Carregar' },
        { label: 'Dados', value: 'Reais' },
      ],
    },
    {
      id: 'vacancies',
      title: 'Vagas',
      icon: Briefcase,
      color: 'text-yellow-400',
      downloadFormats: ['pdf', 'excel', 'csv'] as const,
      placeholder: [
        { label: 'Clique para', value: 'Carregar' },
        { label: 'Dados', value: 'Reais' },
      ],
    },
    {
      id: 'users',
      title: 'Usuários',
      icon: Users,
      color: 'text-green-500',
      downloadFormats: ['pdf', 'csv'] as const,
      placeholder: [
        { label: 'Clique para', value: 'Carregar' },
        { label: 'Dados', value: 'Reais' },
      ],
    },
  ];

  const handleViewReport = async (reportId: string) => {
    // Buscar dados quando clicar
    if (!reports[reportId]) {
      await fetchReport(reportId);
    }
  };

  const handleExport = async (reportId: string, format: 'pdf' | 'excel' | 'csv') => {
    // Garantir que tem dados antes de exportar
    if (!reports[reportId]) {
      await fetchReport(reportId);
    }
    
    const result = await exportReport(reportId, format);
    if (result.success) {
      alert(`✅ Relatório exportado como ${format.toUpperCase()}!`);
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
          Clique em um relatório para carregar dados em tempo real
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
              summary={reportData?.summary || report.placeholder}
              detailedInfo={reportData?.detailedInfo || []}
              downloadFormats={report.downloadFormats}
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
          <strong>1.</strong> Clique em qualquer card para carregar dados em tempo real do banco de dados
        </p>
        <p className={`text-sm ${currentTheme.cardText} mb-2`}>
          <strong>2.</strong> Clique em "Ver Detalhes" para abrir o modal com informações completas
        </p>
        <p className={`text-sm ${currentTheme.cardText}`}>
          <strong>3.</strong> Use os botões de exportação para baixar em PDF, Excel ou CSV
        </p>
      </div>
    </main>
  );
}
