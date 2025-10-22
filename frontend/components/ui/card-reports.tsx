'use client';

import { useState } from 'react';
import { useTheme } from '../../lib/theme';
import { ReportCardData } from '../../lib/data';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';

interface ReportCardProps extends ReportCardData {}

export function ReportCard({ 
  id,
  title, 
  icon: Icon, 
  color, 
  summary, 
  detailedInfo, 
  downloadFormats 
}: ReportCardProps) {
  const { currentTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = (format: string) => {
    console.log(`Baixando relatório de ${title} em formato ${format}`);
    alert(`Download iniciado: ${title} (${format.toUpperCase()})`);
  };

  const getFormatIcon = (format: string) => {
    switch(format) {
      case 'pdf': return <FileText size={16} />;
      case 'excel': return <FileSpreadsheet size={16} />;
      case 'csv': return <File size={16} />;
      default: return <Download size={16} />;
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative overflow-hidden
        ${currentTheme.cardBg} 
        border ${currentTheme.cardBorder}
        rounded-xl p-6
        transition-all duration-300 ease-in-out
        hover:shadow-2xl 
        ${isHovered ? 'z-20' : 'z-10'}
        ${isHovered ? 'ring-2 ring-blue-500/50' : ''}
      `}
    >
      {/* Header do Card */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${currentTheme.cardBg} border ${currentTheme.cardBorder}`}>
            <Icon className={color} size={24} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${currentTheme.titleColor}`}>
              {title}
            </h3>
            <p className={`text-xs ${currentTheme.cardText} opacity-60`}>
              Relatório completo
            </p>
          </div>
        </div>
      </div>

      {/* Conteúdo: Summary ou Detailed */}
      <div className={`space-y-2 mb-4 transition-all duration-300 ${
        isHovered ? 'max-h-96' : 'max-h-24'
      }`}>
        {(isHovered ? detailedInfo : summary).map((item, index) => (
          <div 
            key={index}
            className={`flex justify-between items-center py-2 border-b ${currentTheme.cardBorder} last:border-0`}
          >
            <span className={`text-sm ${currentTheme.cardText}`}>
              {item.label}
            </span>
            <span className={`text-sm font-semibold ${currentTheme.titleColor}`}>
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Botões de Download */}
      <div className="flex gap-2 flex-wrap">
        {downloadFormats.map((format) => (
          <button
            key={format}
            onClick={() => handleDownload(format)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
              ${currentTheme.buttonBg} text-white
              hover:opacity-90 transition-all
            `}
          >
            {getFormatIcon(format)}
            <span className="uppercase">{format}</span>
          </button>
        ))}
      </div>

      {/* Indicador de Hover */}
      {isHovered && (
        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full bg-blue-500 text-white`}>
          Detalhes
        </div>
      )}
    </div>
  );
}