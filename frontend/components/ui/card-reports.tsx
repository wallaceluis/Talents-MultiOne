'use client';

import { useState } from 'react';
import { useTheme } from '../../lib/theme';
import { ReportCardData } from '../../lib/data';
import { FileText, FileSpreadsheet, File, Download, X, ChevronRight } from 'lucide-react';

// Ícones por formato
const FORMAT_ICONS = {
  pdf: <FileText size={16} />,
  excel: <FileSpreadsheet size={16} />,
  csv: <File size={16} />,
} as const;

// Componente principal
export function ReportCard({ 
  id,
  title, 
  icon: Icon, 
  color, 
  summary,
  detailedInfo, 
  downloadFormats 
}: ReportCardData) {
  const { currentTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDownload = (format: string, e: React.MouseEvent) => {
    e.stopPropagation(); 
    console.log(`Baixando relatório: ${id} - ${format}`);
    alert(`✓ Download iniciado: ${title}\nFormato: ${format.toUpperCase()}`);
  };

  return (
    <>
      {/* CARD PRINCIPAL */}
      <article
        onClick={() => setIsExpanded(true)}
        className={`
          ${currentTheme.cardBg} 
          border ${currentTheme.cardBorder}
          rounded-xl p-4 md:p-6
          cursor-pointer relative group
          transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
          hover:shadow-2xl hover:scale-[1.03] hover:brightness-105
          will-change-transform
        `}
      >
        {/* Ícone "Ver detalhes" */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]">
          <div className="flex items-center gap-1 text-xs bg-blue-500 text-white px-2 py-1 rounded-full shadow-md hover:shadow-lg transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]">
            <span>Ver detalhes</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Header */}
        <header className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 md:p-3 rounded-lg ${currentTheme.cardBg} border ${currentTheme.cardBorder}`}>
              <Icon className={color} size={24} aria-hidden="true" />
            </div>
            <div>
              <h3 className={`text-base md:text-lg font-bold ${currentTheme.titleColor}`}>
                {title}
              </h3>
              <p className={`text-xs ${currentTheme.cardText} opacity-60`}>
                Clique para ver mais
              </p>
            </div>
          </div>
        </header>

        {/* Resumo */}
        <div className="space-y-2">
          {summary && summary.map((item, index) => (
            <div 
              key={`${id}-summary-${index}`}
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
      </article>

      {/* MODAL DETALHADO */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          {/* Fundo escuro com blur */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
            aria-hidden="true"
            onClick={() => setIsExpanded(false)}
          />

          {/* CARD EXPANDIDO */}
          <article
            onClick={(e) => e.stopPropagation()}
            className={`
              relative ${currentTheme.cardBg} 
              border-2 ${currentTheme.cardBorder}
              rounded-xl md:rounded-2xl 
              p-6 md:p-8 max-w-sm md:max-w-2xl w-full 
              max-h-[85vh] md:max-h-[90vh] overflow-y-auto
              shadow-2xl
              animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
              transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
              will-change-transform
            `}
          >
            {/* Header Expandido */}
            <header className="flex items-start justify-between mb-6 sticky top-0 bg-inherit pb-4 z-10 border-b border-gray-700/50">
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className={`p-3 md:p-4 rounded-xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} flex-shrink-0`}>
                  <Icon className={color} size={32} aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`text-lg md:text-2xl font-bold ${currentTheme.titleColor} mb-1`}>
                    {title}
                  </h3>
                  <p className={`text-xs md:text-sm ${currentTheme.cardText} opacity-70`}>
                    Relatório completo de atividades
                  </p>
                </div>
              </div>

              {/* Botão fechar */}
              <button
                onClick={() => setIsExpanded(false)}
                className={`
                  p-2 md:p-3 rounded-xl 
                  ${currentTheme.buttonBg} text-white
                  transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
                  hover:opacity-90 hover:scale-105 active:scale-95
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </header>

            {/* Informações detalhadas */}
            <div className="space-y-2 md:space-y-3 mb-6">
              <h4 className={`text-xs md:text-sm font-semibold ${currentTheme.titleColor} uppercase tracking-wide mb-4 flex items-center gap-2`}>
                <div className="h-1 w-1 rounded-full bg-blue-500"></div>
                Informações Detalhadas
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {detailedInfo.map((item, index) => (
                  <div 
                    key={`${id}-detail-${index}`}
                    className={`
                      flex flex-col py-3 md:py-4 px-3 md:px-4 rounded-lg
                      ${currentTheme.cardBg} border ${currentTheme.cardBorder}
                      transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
                      hover:border-blue-500/60 hover:shadow-lg hover:scale-[1.02] hover:brightness-105
                      will-change-transform
                    `}
                  >
                    <span className={`text-xs ${currentTheme.cardText} opacity-70 mb-1`}>
                      {item.label}
                    </span>
                    <span className={`text-base md:text-lg font-bold ${currentTheme.titleColor}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Botões de download */}
            <footer className={`border-t ${currentTheme.cardBorder} pt-6`}>
              <h4 className={`text-xs md:text-sm font-semibold ${currentTheme.titleColor} uppercase tracking-wide mb-4 flex items-center gap-2`}>
                <div className="h-1 w-1 rounded-full bg-green-500"></div>
                Exportar Relatório
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {downloadFormats.map((format) => (
                  <button
                    key={format}
                    onClick={(e) => handleDownload(format, e)}
                    aria-label={`Baixar relatório de ${title} em formato ${format}`}
                    className={`
                      flex items-center justify-center gap-2 
                      px-4 py-3 md:py-4 rounded-lg text-sm font-medium
                      ${currentTheme.buttonBg} text-white
                      transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
                      hover:opacity-95 hover:scale-[1.03] active:scale-95 hover:brightness-105
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      shadow-lg hover:shadow-xl
                      will-change-transform
                    `}
                  >
                    {FORMAT_ICONS[format as keyof typeof FORMAT_ICONS] || <Download size={16} />}
                    <span className="uppercase font-bold">{format}</span>
                  </button>
                ))}
              </div>

              <p className={`text-xs ${currentTheme.cardText} opacity-50 text-center mt-4`}>
                Clique no botão ✕ acima para fechar
              </p>
            </footer>
          </article>
        </div>
      )}
    </>
  );
}
