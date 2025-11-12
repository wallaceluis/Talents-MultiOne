'use client';

import { useState } from 'react';
import { useTheme } from '../../lib/theme';
import { LucideIcon, Download, X, ChevronRight, Loader2 } from 'lucide-react';

interface ReportCardProps {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  summary: { label: string; value: string | number }[];
  detailedInfo: { label: string; value: string | number }[];
  downloadFormats: ('pdf' | 'excel' | 'csv')[];
  onView?: () => void;
  onExport?: (format: 'pdf' | 'excel' | 'csv') => void;
  loading?: boolean;
}

export function ReportCard({
  id,
  title,
  icon: Icon,
  color,
  summary,
  detailedInfo,
  downloadFormats,
  onView,
  onExport,
  loading = false,
}: ReportCardProps) {
  const { currentTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleViewClick = () => {
    if (onView) {
      onView();
    }
    setIsExpanded(true);
  };

  const handleDownload = async (format: 'pdf' | 'excel' | 'csv', e: React.MouseEvent) => {
    e.stopPropagation();
    setExporting(format);
    
    if (onExport) {
      await onExport(format);
    }
    
    setTimeout(() => setExporting(null), 1000);
  };

  return (
    <>
      {/* CARD PRINCIPAL */}
      <article
        onClick={handleViewClick}
        className={`${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl p-4 md:p-6 cursor-pointer relative group transition-all duration-300 hover:shadow-2xl hover:scale-[1.03] hover:brightness-105`}
      >
        {/* Loading ou Ver Detalhes */}
        <div className="absolute top-3 right-3">
          {loading ? (
            <Loader2 className="animate-spin text-blue-500" size={20} />
          ) : (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 text-xs bg-blue-500 text-white px-2 py-1 rounded-full shadow-md">
                <span>Ver detalhes</span>
                <ChevronRight size={14} />
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <header className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 md:p-3 rounded-lg ${currentTheme.cardBg} border ${currentTheme.cardBorder}`}>
              <Icon className={color} size={24} />
            </div>
            <div>
              <h3 className={`text-base md:text-lg font-bold ${currentTheme.titleColor}`}>
                {title}
              </h3>
              <p className={`text-xs ${currentTheme.cardText} opacity-60`}>
                {loading ? 'Carregando...' : 'Clique para ver mais'}
              </p>
            </div>
          </div>
        </header>

        {/* Resumo */}
        <div className="space-y-2 mb-4">
          {summary.map((item, index) => (
            <div
              key={index}
              className={`flex justify-between items-center py-2 border-b ${currentTheme.cardBorder} last:border-0`}
            >
              <span className={`text-xs md:text-sm ${currentTheme.cardText}`}>
                {item.label}
              </span>
              <span className={`text-xs md:text-sm font-semibold ${currentTheme.titleColor}`}>
                {item.value}
              </span>
            </div>
          ))}
        </div>

        {/* Botões de Download no Card */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700/30">
          {downloadFormats.map((format) => (
            <button
              key={format}
              onClick={(e) => handleDownload(format, e)}
              disabled={exporting !== null || loading}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium ${currentTheme.buttonBg} text-white transition-all hover:opacity-95 hover:scale-105 disabled:opacity-50 shadow-md flex-1`}
            >
              {exporting === format ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Download size={14} />
              )}
              <span className="uppercase font-bold">{format}</span>
            </button>
          ))}
        </div>
      </article>

      {/* MODAL DETALHADO */}
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />

          <article
            onClick={(e) => e.stopPropagation()}
            className={`relative ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} rounded-2xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}
          >
            {/* Header */}
            <header className={`flex items-start justify-between mb-6 sticky top-0 ${currentTheme.cardBg} pb-4 border-b ${currentTheme.cardBorder}`}>
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl ${currentTheme.cardBg} border ${currentTheme.cardBorder}`}>
                  <Icon className={color} size={32} />
                </div>
                <div>
                  <h3 className={`text-2xl font-bold ${currentTheme.titleColor}`}>
                    {title}
                  </h3>
                  <p className={`text-sm ${currentTheme.cardText} opacity-70`}>
                    Relatório completo de atividades
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className={`p-3 rounded-xl ${currentTheme.buttonBg} text-white hover:opacity-90`}
              >
                <X size={20} />
              </button>
            </header>

            {/* Resumo no Modal */}
            <section className="mb-6">
              <h4 className={`text-lg font-bold ${currentTheme.titleColor} mb-4 flex items-center gap-2`}>
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Resumo
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {summary.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.cardBorder}`}
                  >
                    <p className={`text-xs ${currentTheme.cardText} opacity-70 mb-1`}>
                      {item.label}
                    </p>
                    <p className={`text-2xl font-bold ${currentTheme.titleColor}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Informações Detalhadas */}
            {detailedInfo.length > 0 && (
              <section className="mb-6">
                <h4 className={`text-lg font-bold ${currentTheme.titleColor} mb-4 flex items-center gap-2`}>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  Informações Detalhadas
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {detailedInfo.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${currentTheme.cardBg} border ${currentTheme.cardBorder} hover:border-blue-500/60 transition-all`}
                    >
                      <p className={`text-xs ${currentTheme.cardText} opacity-70 mb-1`}>
                        {item.label}
                      </p>
                      <p className={`text-lg font-bold ${currentTheme.titleColor}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Botões de Download no Modal */}
            <footer className={`border-t ${currentTheme.cardBorder} pt-6`}>
              <h4 className={`text-lg font-bold ${currentTheme.titleColor} mb-4 flex items-center gap-2`}>
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                Exportar Relatório
              </h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {downloadFormats.map((format) => (
                  <button
                    key={format}
                    onClick={(e) => handleDownload(format, e)}
                    disabled={exporting !== null}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg ${currentTheme.buttonBg} text-white font-medium hover:opacity-90 disabled:opacity-50`}
                  >
                    {exporting === format ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Exportando...</span>
                      </>
                    ) : (
                      <>
                        <Download size={18} />
                        <span className="uppercase">{format}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </footer>
          </article>
        </div>
      )}
    </>
  );
}
