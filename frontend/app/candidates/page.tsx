'use client';

import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { CandidatesTable } from '../../components/tables/candidates-table';
import { statusCardsData } from '../../lib/data';
import { Search } from 'lucide-react';

export default function CandidatesPage() {
    const { currentTheme } = useTheme();

    return (
        <main className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={`text-2xl md:text-4xl font-bold ${currentTheme.mainText}`}>Gerenciamento de Candidatos</h1>
                    <p className={`mt-2 text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
                        Candidatos cadastrados na plataforma
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar empresas..."
                        className={`w-full p-3 pl-12 pr-4 rounded-xl border ${currentTheme.name === 'Claro' ? 'border-gray-300 bg-white text-gray-900' : 'bg-gray-800/50 border-gray-700/50 text-white'} placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statusCardsData.map((data, i) => (
                    <MetricCard key={`status-${i}`} {...data} />
                ))}
            </div>

            <CandidatesTable />
        </main>
    );
}

