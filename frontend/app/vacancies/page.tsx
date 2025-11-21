'use client';

import { useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { VacanciesTable } from '../../components/tables/vacancies-table';
import { useVacancies } from '../../hooks/useVacancies';
import { Briefcase, TrendingUp, Users } from 'lucide-react';

export default function VacanciesPage() {
    const { currentTheme } = useTheme();
    const { stats, fetchStats, loading } = useVacancies();

    useEffect(() => {
        if (fetchStats) fetchStats();
    }, []);

    const vacanciesMetricCards = [
        { title: 'Vagas Abertas', value: String(stats?.active || 0), icon: Briefcase, color: 'text-green-500' },
        { title: 'Total de Vagas', value: String(stats?.total || 0), icon: TrendingUp, color: 'text-red-500' },
        { title: 'Vagas Fechadas', value: String(stats?.filled || 0), icon: Users, color: 'text-yellow-500' },
    ];

    return (
        <main className="space-y-6 md:space-y-8">
            <div>
                <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${currentTheme.mainText}`}>Central de Vagas</h1>
                <p className={`text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
                    Controle total das vagas de emprego disponíveis na plataforma
                </p>
            </div>

            {loading ? (
                <div className="text-center">
                    <p className={currentTheme.mainText}>Carregando...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {vacanciesMetricCards.map((data, i) => (
                        <MetricCard key={`vacancy-metric-${i}`} {...data} />
                    ))}
                </div>
            )}

            <VacanciesTable />
        </main>
    );
}
