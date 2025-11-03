'use client';

import { useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { CompaniesTable } from '../../components/tables/companies-table';
import { useDashboard } from '../../hooks/useDashboard';
import { Building2, Briefcase, Users, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
    const { currentTheme } = useTheme();
    const { stats, loading } = useDashboard();

    const metricCards = [
        { title: 'Empresas Cadastradas', value: String(stats.companies), icon: Building2, color: 'text-blue-500' },
        { title: 'Vagas Abertas', value: String(stats.vacancies), icon: Briefcase, color: 'text-blue-500' },
        { title: 'Total de Candidatos', value: String(stats.candidates), icon: Users, color: 'text-yellow-500' },
        { title: 'Total de Candidaturas', value: String(stats.applications), icon: TrendingUp, color: 'text-red-500' },
    ];

    if (loading) {
        return (
            <main className="space-y-6 md:space-y-8">
                <div className="text-center">
                    <p className={currentTheme.mainText}>Carregando...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="space-y-6 md:space-y-8">
            <div>
                <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${currentTheme.mainText}`}>Bem-vindo!</h1>
                <p className={`text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
                    Controle total da plataforma SaaS de recrutamento
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {metricCards.map((data, i) => (
                    <MetricCard key={`metric-${i}`} {...data} />
                ))}
            </div>
            
            <CompaniesTable />
        </main>
    );
}
