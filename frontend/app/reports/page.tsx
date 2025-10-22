'use client';

import { useTheme } from '../../lib/theme';
import { ReportCard } from '../../components/ui/card-reports';
import { reportsData } from '../../lib/data';
import { ClipboardList } from 'lucide-react';

export default function ReportsPage() {
  const { currentTheme } = useTheme();

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
          Gere e exporte relatórios completos de atividades da plataforma
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportsData.map((report) => (
          <ReportCard key={report.id} {...report} />
        ))}
      </div>

      {/* Informação adicional */}
      <div className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-6`}>
        <h3 className={`text-lg font-bold ${currentTheme.titleColor} mb-2`}>
          💡 Dica
        </h3>
        <p className={`text-sm ${currentTheme.cardText}`}>
          Passe o mouse sobre os cards para ver informações detalhadas antes de fazer o download.
        </p>
      </div>
    </main>
  );
}
