'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '../../lib/theme';
import { ReportCardData } from '../../lib/data';
import { FileText, FileSpreadsheet, File, Download, X, ChevronRight } from 'lucide-react';

// Constantes fora do componente para performance
const FORMAT_ICONS = {
  pdf: <FileText size={16} />,
  excel: <FileSpreadsheet size={16} />,
  csv: <File size={16} />,
} as const;

// Componente ReportCard
export function ReportCard({ 
  id,
  title, 
  icon: Icon, 
  
  summary,
  detailedInfo, 
  downloadFormats 
}: ReportCardData) {
  const { currentTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

   useEffect(() => {
    if (isExpanded){
        document.body.classList.add('modal-open');
    } else {
        document.body.classList.remove('modal-open')
    }

    return () => {
        document.body.classList.remove('modal-open');
    }
   }, [isExpanded])

  
  // Função para simular download
  const handleDownload = (format: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Baixando relatório: ${id} - ${format}`);
    alert(`✓ Download iniciado: ${title}\nFormato: ${format.toUpperCase()}`);
  };

  // Determinar se é tema claro
  const isLightTheme = currentTheme.name === 'Claro';

  return (
    <>
      {/* CARD COMPACTO (sempre visível) */}
      <article
        onClick={() => setIsExpanded(true)}
        className={`
          ${currentTheme.cardBg} 
          border ${currentTheme.cardBorder}
          rounded-xl p-4 md:p-6
          transition-all duration-300
          hover:shadow-xl hover:scale-[1.02]
          cursor-pointer
          relative
          group
        `}
      >
        {/* Botão "Ver detalhes" */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className={`
            flex items-center gap-1 text-xs px-2 py-1 rounded-full
            ${isLightTheme ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}
          `}>
            <span>Ver detalhes</span>
            <ChevronRight size={14} />
          </div>
        </div>

        {/* Header do Card */}
        <header className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`
              p-2 md:p-3 rounded-lg border
              ${isLightTheme 
                ? 'bg-blue-50 border-blue-200' 
                : `${currentTheme.cardBg} ${currentTheme.cardBorder}`
              }
            `}>
              {/* Cor do ícone baseada no tema */}
              <Icon 
                className={isLightTheme ? 'text-black' : 'text-white'} 
                size={24} 
                strokeWidth={2}
                aria-hidden="true" 
              />
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

        {/*summary sempre visível */}
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

      {/* OVERLAY + MODAL EXPANDIDO */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 animate-in fade-in duration-200 overflow-y-auto max-h-screen"
          
          onClick={() => setIsExpanded(false)}
        >
          {/* Fundo desfocado escuro*/}
          <div 
            className={`
              fixed inset-0 -z-10
              ${isLightTheme ? 'bg-black/40' : 'bg-black/80'}
              backdrop-blur-sm
            `}
            aria-hidden="true"
          />

          {/* CARD EXPANDIDO */}
          <article
            onClick={(e) => e.stopPropagation()}
            className={`
              relative 
              ${currentTheme.cardBg} 
              border-2 ${currentTheme.cardBorder}
              rounded-xl md:rounded-2xl 
              p-6 md:p-8
              max-w-sm md:max-w-2xl w-full 
              max-h-full
              shadow-2xl
              animate-in zoom-in-95 slide-in-from-bottom-4 duration-300
            `}
          >
            {/* Header Expandido - STICKY */}
            <header className={`
              flex items-start justify-between mb-6 
              sticky top-0 z-10
              pb-4 -mx-6 md:-mx-8 px-6 md:px-8
              ${currentTheme.cardBg}
              border-b ${currentTheme.cardBorder}
            `}>
              <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                <div className={`
                  p-3 md:p-4 rounded-xl border flex-shrink-0
                  ${isLightTheme 
                    ? 'bg-blue-50 border-blue-200' 
                    : `${currentTheme.cardBg} ${currentTheme.cardBorder}`
                  }
                `}>
                  {/* Cor do ícone no modal */}
                  <Icon 
                    className={isLightTheme ? 'text-blue-600' : 'text-white'} 
                    size={32} 
                    strokeWidth={2}
                    aria-hidden="true" 
                  />
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
                  ${currentTheme.buttonBg} 
                  text-white
                  hover:opacity-90 
                  active:scale-95
                  transition-all 
                  flex-shrink-0 ml-2
                  focus:outline-none 
                  focus:ring-2 
                  focus:ring-blue-500
                `}
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </header>

            {/* INFORMAÇÕES DETALHADAS */}
            <div className="space-y-2 md:space-y-3 mb-6">
              <h4 className={`
                text-xs md:text-sm font-semibold ${currentTheme.titleColor} 
                uppercase tracking-wide mb-4 flex items-center gap-2
              `}>
                <div className={`
                  h-1 w-1 rounded-full 
                  ${isLightTheme ? 'bg-blue-600' : 'bg-blue-500'}
                `}></div>
                Informações Detalhadas
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                {detailedInfo.map((item, index) => (
                  <div 
                    key={`${id}-detail-${index}`}
                    className={`
                      flex flex-col
                      py-3 md:py-4 px-3 md:px-4 rounded-lg
                      border transition-all
                      hover:scale-[1.02]
                      ${isLightTheme 
                        ? 'bg-gray-50 border-gray-200 hover:border-blue-400' 
                        : `${currentTheme.cardBg} ${currentTheme.cardBorder} hover:border-blue-500/50`
                      }
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

            {/* BOTÕES DE DOWNLOAD */}
            <footer className={`border-t ${currentTheme.cardBorder} pt-6`}>
              <h4 className={`
                text-xs md:text-sm font-semibold ${currentTheme.titleColor} 
                uppercase tracking-wide mb-4 flex items-center gap-2
              `}>
                <div className={`
                  h-1 w-1 rounded-full 
                  ${isLightTheme ? 'bg-green-600' : 'bg-green-500'}
                `}></div>
                Exportar Relatório
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                {downloadFormats.map((format) => (
                  <button
                    key={format}
                    onClick={(e) => handleDownload(format, e)}
                    aria-label={`Baixar relatório de ${title} em formato ${format}`}
                    className={`
                      flex items-center justify-center gap-2 
                      px-4 py-3 md:py-4 rounded-lg text-sm font-medium
                      ${currentTheme.buttonBg} text-white
                      hover:opacity-90 hover:scale-[1.02] active:scale-95 
                      transition-all
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      shadow-lg
                    `}
                  >
                    {FORMAT_ICONS[format as keyof typeof FORMAT_ICONS] || <Download size={16} />}
                    <span className="uppercase font-bold">{format}</span>
                  </button>
                ))}
              </div>

              {/* Dica de fechamento */}
              <p className={`text-xs ${currentTheme.cardText} opacity-50 text-center mt-4`}>
                Clique no botão ✕ acima ou fora do card para fechar
              </p>
            </footer>
          </article>
        </div>
      )}
    </>
  );
}