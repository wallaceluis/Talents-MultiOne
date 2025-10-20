'use client';

import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { VacanciesTable } from '../../components/tables/vacancies-table';
import { vacanciesMetricCards } from '../../lib/data';

export default function VacanciesPage() {
    const { currentTheme } = useTheme();

    return (
        <main className="space-y-6 md:space-y-8">
            <div>
                <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${currentTheme.mainText}`}>Central de Vagas</h1>
                <p className={`text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
                    Controle total das vagas de emprego disponíveis na plataforma
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {vacanciesMetricCards.map((data, i) => (
                    <MetricCard key={`vacancy-metric-${i}`} {...data} />
                ))}
            </div>
            
            <VacanciesTable />
        </main>
    );
}