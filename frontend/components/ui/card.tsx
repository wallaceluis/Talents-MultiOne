'use client';

import { useTheme } from '../../app/dashboard/layout';
import { MetricCardData } from '../../lib/data';

export const MetricCard: React.FC<MetricCardData> = ({ title, value, icon: Icon, color }) => {
    const { currentTheme } = useTheme();
    return (
        <div className={`p-4 md:p-5 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all duration-300 shadow-lg`}>
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    <h3 className={`text-xs md:text-sm font-medium ${currentTheme.cardText} opacity-70 truncate`}>{title}</h3>
                    <p className={`text-2xl md:text-3xl font-bold ${currentTheme.titleColor} mt-1`}>{value}</p>
                </div>
                <Icon className={`${color} opacity-80 flex-shrink-0 ml-2`} size={28} />
            </div>
        </div>
    );
};

