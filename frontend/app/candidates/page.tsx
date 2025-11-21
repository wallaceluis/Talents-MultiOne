'use client';

import { useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { CandidatesTable } from '../../components/tables/candidates-table';
import { useCandidates } from '../../hooks/useCandidates';
import { useAuth } from '../../hooks/useAuth';
import { Search, Users, ListChecks, TrendingUp, Briefcase, BarChart3 } from 'lucide-react';

export default function CandidatesPage() {
    const { currentTheme } = useTheme();
    const { stats, fetchStats, loading } = useCandidates();
    const { user } = useAuth();

    useEffect(() => {
        if (fetchStats) fetchStats();
    }, []);

    const candidatesMetricCards = [
        { title: 'Totais', value: String(stats?.total || 0), icon: Users, color: 'text-blue-500' },
        { title: 'Online', value: '0', icon: ListChecks, color: 'text-green-500' },
        { title: 'Ativos (180 dias)', value: String(stats?.active || 0), icon: TrendingUp, color: 'text-yellow-500' },
        { title: 'Em Processo', value: String(stats?.inProcess || 0), icon: Briefcase, color: 'text-purple-500' },
        { title: 'Contratados', value: String(stats?.hired || 0), icon: BarChart3, color: 'text-red-500' },
    ];

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
                        placeholder="Buscar candidatos..."
                        className={`w-full p-3 pl-12 pr-4 rounded-xl border ${currentTheme.name === 'Claro'
                            ? 'border-gray-300 bg-white text-gray-900'
                            : 'bg-gray-800/50 border-gray-700/50 text-white'
                            } placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center">
                    <p className={currentTheme.mainText}>Carregando...</p>
                </div>
            ) : (
                <div className="grid-row-2 grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    {candidatesMetricCards.map((data, i) => (
                        <MetricCard key={`candidate-${i}`} {...data} />
                    ))}
                </div>
            )}

            <CandidatesTable isReadOnly={user?.role === 'VIEWER'} />
        </main>
    );
}
