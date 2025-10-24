'use client';

import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { CompaniesTable } from '../../components/tables/companies-table';
import { metricCards } from '../../lib/data';

export default function DashboardPage() {
    const { currentTheme } = useTheme();

    return (
        <main className="space-y-6 md:space-y-8">
            <div>
                <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${currentTheme.mainText}`}>
                    Bem-vindo!
                </h1>
                <p className={`text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
                    Controle total da plataforma SaaS de recrutamento
                </p>
            </div>

            {/* Grid responsivo dos cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {metricCards.map((data, i) => (
                    <MetricCard key={`metric-${i}`} {...data} />
                ))}
            </div>

            <CompaniesTable />
        </main>
    );
}