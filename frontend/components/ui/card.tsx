'use client';

import { useTheme } from '../../lib/theme';
import { MetricCardData } from '../../lib/data';

export function MetricCard({ title, value, icon: Icon, color }: MetricCardData) {
  const { currentTheme } = useTheme();

  return (
    <div
      className={`
        p-4 md:p-5 rounded-xl md:rounded-2xl border 
        ${currentTheme.cardBorder} 
        ${currentTheme.cardBg} 
        cursor-pointer relative group
        transform-gpu will-change-transform 
        transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
        hover:shadow-2xl hover:scale-[1.03] hover:brightness-105
      `}
    >
      {/* Efeito de brilho sutil no hover */}
      <div
        className={`
          absolute inset-0 rounded-xl md:rounded-2xl pointer-events-none 
          bg-blue-500/10 opacity-0 group-hover:opacity-10 
          blur-sm transition-opacity duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]
        `}
      />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex-1 min-w-0">
          <h3
            className={`text-xs md:text-sm font-medium ${currentTheme.cardText} opacity-70 truncate`}
          >
            {title}
          </h3>
          <p
            className={`text-2xl md:text-3xl font-bold ${currentTheme.titleColor} mt-1`}
          >
            {value}
          </p>
        </div>

        <Icon
          className={`${color} opacity-80 flex-shrink-0 ml-2 transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110`}
          size={28}
        />
      </div>
    </div>
  );
}
