'use client';

import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { CompaniesTable } from '../../components/tables/companies-table';
import { MetricCharts } from '../../components/charts/metric-charts';
import { metricCards, candidatesMetricCards, statusCardsData, vacanciesMetricCards } from '../../lib/data';

export default function DashboardPage() {
    const { currentTheme } = useTheme();

    //Dados para o gráfico de linha
    const candidatesTimeSeriesData = [
        { 
            month: 'Jan', 
            online: 3, 
            'ativos_(180_dias)': 45, 
            candidaturas_totais: 200 
        },
        { 
            month: 'Fev', 
            online: 4, 
            'ativos_(180_dias)': 50, 
            candidaturas_totais: 220 
        },
        { 
            month: 'Mar', 
            online: 3, 
            'ativos_(180_dias)': 52, 
            candidaturas_totais: 230 
        },
        { 
            month: 'Abr', 
            online: 6, 
            'ativos_(180_dias)': 55, 
            candidaturas_totais: 245 
        },
        { 
            month: 'Mai', 
            online: 5, 
            'ativos_(180_dias)': 60, 
            candidaturas_totais: 260 
        },
    ];

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

            {/* Cards Gerais */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {metricCards.map((data, i) => (
                    <MetricCard key={`metric-${i}`} {...data} />
                ))}
            </div>

            {/* Gráficos de Candidatos - Pizza + Barras */}
            <MetricCharts 
                metricsData={candidatesMetricCards} 
                currentTheme={currentTheme}
                title="Análise de Candidatos"
                subtitle="Distribuição e comparação de candidatos por status"
                chartType="dual"
                skipFirst={true}
            />

            {/*Gráfico de Evolução Temporal */}
            <MetricCharts 
                metricsData={candidatesMetricCards} 
                currentTheme={currentTheme}
                title="Evolução de Candidatos"
                subtitle="Acompanhamento mensal das métricas"
                chartType="line"
                skipFirst={true}
                timeSeriesData={candidatesTimeSeriesData}
            />

            {/* Gráficos de Empresas */}
            <MetricCharts 
                metricsData={statusCardsData} 
                currentTheme={currentTheme}
                title="Análise de Empresas"
                subtitle="Distribuição de empresas por status"
                chartType="dual"
                skipFirst={true}
            />

            {/* Gráfico de Vagas */}
            <MetricCharts 
                metricsData={vacanciesMetricCards} 
                currentTheme={currentTheme}
                title="Análise de Vagas"
                subtitle="Visão geral das vagas e candidaturas"
                chartType="bar-only"
                skipFirst={false}
            />

            <CompaniesTable />
        </main>
    );
}