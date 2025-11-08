'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { 
  CHART_COLORS, 
  CHART_GRADIENTS, 
  BAR_CONFIG, 
  getChartTheme,
  createGradientDefs 
} from '../../components/charts/metric-charts';
import { useDashboard } from '../../hooks/useDashboard';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Users, Building2, Briefcase, Filter, TrendingUp } from 'lucide-react';

type AnalysisTab = 'candidates' | 'companies' | 'vacancies';

export default function DashboardPage() {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<AnalysisTab>('candidates');
  
  const {
    metrics,
    candidatesAnalysis,
    companiesAnalysis,
    vacanciesAnalysis,
    loading,
    error,
    fetchMetrics,
    fetchCandidatesAnalysis,
    fetchCompaniesAnalysis,
    fetchVacanciesAnalysis,
  } = useDashboard();

  // Carregar dados iniciais
  useEffect(() => {
    fetchMetrics();
    fetchCandidatesAnalysis();
    fetchCompaniesAnalysis();
    fetchVacanciesAnalysis();
  }, []);

  // Atualizar quando mudar de aba
  useEffect(() => {
    if (activeTab === 'candidates' && !candidatesAnalysis) {
      fetchCandidatesAnalysis();
    } else if (activeTab === 'companies' && !companiesAnalysis) {
      fetchCompaniesAnalysis();
    } else if (activeTab === 'vacancies' && !vacanciesAnalysis) {
      fetchVacanciesAnalysis();
    }
  }, [activeTab]);

  const chartTheme = getChartTheme(currentTheme);

  const tabs = [
    { id: 'candidates' as AnalysisTab, label: 'Candidatos', icon: Users },
    { id: 'companies' as AnalysisTab, label: 'Empresas', icon: Building2 },
    { id: 'vacancies' as AnalysisTab, label: 'Vagas', icon: Briefcase },
  ];

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className={`p-4 md:p-6 rounded-xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all hover:shadow-lg`}>
      <h3 className={`text-lg font-semibold ${currentTheme.titleColor} mb-4`}>{title}</h3>
      <div className="h-72 md:h-80">{children}</div>
    </div>
  );

  const tooltipStyle = {
    backgroundColor: chartTheme.tooltipBg,
    border: `1px solid ${chartTheme.tooltipBorder}`,
    color: chartTheme.tooltipTextColor,
    borderRadius: '8px'
  };

  // Métricas gerais
  const metricCardsData = [
    { title: 'Empresas Cadastradas', value: String(metrics.companies), icon: Building2, color: 'text-blue-500' },
    { title: 'Vagas Abertas', value: String(metrics.vacancies), icon: Briefcase, color: 'text-yellow-400' },
    { title: 'Total de Candidatos', value: String(metrics.candidates), icon: Users, color: 'text-green-500' },
    { title: 'Total de Candidaturas', value: String(metrics.applications), icon: TrendingUp, color: 'text-red-500' },
  ];

  if (loading && !candidatesAnalysis && !companiesAnalysis && !vacanciesAnalysis) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className={`text-xl ${currentTheme.mainText}`}>Carregando dados do dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-red-500">Erro: {error}</div>
      </div>
    );
  }

  return (
    <main className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${currentTheme.mainText}`}>Dashboard Analítico</h1>
        <p className={`text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
          Visão consolidada de recrutamento e seleção
        </p>
      </div>

      {/* KPIs Gerais */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {metricCardsData.map((data, i) => <MetricCard key={`metric-${i}`} {...data} />)}
      </div>

      {/* Tabs */}
      <div className={`p-2 rounded-xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} inline-flex gap-2 shadow-lg`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-200 ${
                isActive ? `${currentTheme.buttonBg} shadow-md scale-105` : `${currentTheme.cardText} hover:bg-black/5 dark:hover:bg-white/5`
              }`}>
              <Icon size={22} />
              <span className="text-base font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ANÁLISE DE CANDIDATOS */}
      {activeTab === 'candidates' && candidatesAnalysis && (
        <div className="space-y-6">
          <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.mainText}`}>Análise de Candidatos</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Evolução */}
            <ChartCard title="Evolução Total de Candidatos">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={candidatesAnalysis.evolution}>
                  {createGradientDefs('blueGradient', CHART_GRADIENTS.blue)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="month" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="total" stroke={CHART_COLORS[0]} strokeWidth={3} 
                    dot={{ fill: CHART_COLORS[0], r: 5 }} fill="url(#blueGradient)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Atividades */}
            <ChartCard title="Comparação por Atividade">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidatesAnalysis.activities} barSize={BAR_CONFIG.barSize}>
                  {createGradientDefs('bar1', CHART_GRADIENTS.blue)}
                  {createGradientDefs('bar2', CHART_GRADIENTS.green)}
                  {createGradientDefs('bar3', CHART_GRADIENTS.yellow)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="name" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" radius={BAR_CONFIG.radius} maxBarSize={BAR_CONFIG.maxBarSize}>
                    <Cell fill="url(#bar1)" />
                    <Cell fill="url(#bar2)" />
                    <Cell fill="url(#bar3)" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Estado */}
            <ChartCard title="Distribuição por Estado">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidatesAnalysis.byState} layout="vertical" barSize={BAR_CONFIG.barSize}>
                  {createGradientDefs('stateGradient', CHART_GRADIENTS.green)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis type="number" stroke={chartTheme.axisColor} />
                  <YAxis type="category" dataKey="state" stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="url(#stateGradient)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Gênero */}
            <ChartCard title="Distribuição por Gênero">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={candidatesAnalysis.byGender} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    dataKey="value" label>
                    {candidatesAnalysis.byGender.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Faixa Etária */}
            <ChartCard title="Distribuição por Faixa Etária">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidatesAnalysis.byAge} barSize={BAR_CONFIG.barSize}>
                  {createGradientDefs('ageGradient', CHART_GRADIENTS.yellow)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="range" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="url(#ageGradient)" radius={BAR_CONFIG.radius} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Top Cargos */}
            <ChartCard title="Top 5 Cargos Mais Buscados">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidatesAnalysis.topPositions} layout="vertical" barSize={BAR_CONFIG.barSize}>
                  {createGradientDefs('posGradient', CHART_GRADIENTS.purple)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis type="number" stroke={chartTheme.axisColor} />
                  <YAxis type="category" dataKey="position" stroke={chartTheme.axisColor} width={120} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="url(#posGradient)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {/* ANÁLISE DE EMPRESAS */}
      {activeTab === 'companies' && companiesAnalysis && (
        <div className="space-y-6">
          <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.mainText}`}>Análise de Empresas</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Evolução de Novas Empresas">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={companiesAnalysis.evolution}>
                  {createGradientDefs('greenGradient', CHART_GRADIENTS.green)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="month" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="total" stroke={CHART_COLORS[2]} strokeWidth={3}
                    dot={{ fill: CHART_COLORS[2], r: 5 }} fill="url(#greenGradient)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Empresas por Segmento">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={companiesAnalysis.bySegment} cx="50%" cy="50%" outerRadius={90} dataKey="value" label>
                    {companiesAnalysis.bySegment.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Empresas por Estado">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companiesAnalysis.byState} barSize={BAR_CONFIG.barSize}>
                  {createGradientDefs('compStateGradient', CHART_GRADIENTS.cyan)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="state" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="url(#compStateGradient)" radius={BAR_CONFIG.radius} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top 5 Empresas por Vagas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companiesAnalysis.topByVacancies} layout="vertical" barSize={BAR_CONFIG.barSize}>
                  {createGradientDefs('compVacGradient', CHART_GRADIENTS.yellow)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis type="number" stroke={chartTheme.axisColor} />
                  <YAxis type="category" dataKey="company" stroke={chartTheme.axisColor} width={150} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="vacancies" fill="url(#compVacGradient)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Top 5 Empresas por Candidaturas">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companiesAnalysis.topByCandidates} layout="vertical" barSize={BAR_CONFIG.barSize}>
                {createGradientDefs('compAppGradient', CHART_GRADIENTS.purple)}
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                <XAxis type="number" stroke={chartTheme.axisColor} />
                <YAxis type="category" dataKey="company" stroke={chartTheme.axisColor} width={150} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="applications" fill="url(#compAppGradient)" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* ANÁLISE DE VAGAS */}
      {activeTab === 'vacancies' && vacanciesAnalysis && (
        <div className="space-y-6">
          <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.mainText}`}>Análise de Vagas</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Evolução Total de Vagas">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vacanciesAnalysis.evolution}>
                  {createGradientDefs('redGradient', CHART_GRADIENTS.red)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="month" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="total" stroke={CHART_COLORS[8]} strokeWidth={3}
                    dot={{ fill: CHART_COLORS[8], r: 5 }} fill="url(#redGradient)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Vagas por Status">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={vacanciesAnalysis.byStatus} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    dataKey="value" label>
                    {vacanciesAnalysis.byStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Vagas por Setor">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vacanciesAnalysis.bySector} barSize={BAR_CONFIG.barSize}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="sector" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={BAR_CONFIG.radius}>
                    {vacanciesAnalysis.bySector.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Vagas por Cargo (Top 8)">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vacanciesAnalysis.byPosition} layout="vertical" barSize={BAR_CONFIG.barSize}>
                  {createGradientDefs('vacPosGradient', CHART_GRADIENTS.indigo)}
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis type="number" stroke={chartTheme.axisColor} />
                  <YAxis type="category" dataKey="position" stroke={chartTheme.axisColor} width={160} fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="url(#vacPosGradient)" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Vagas por Região">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vacanciesAnalysis.byRegion} barSize={BAR_CONFIG.barSize}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="region" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" radius={BAR_CONFIG.radius}>
                    {vacanciesAnalysis.byRegion.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}
    </main>
  );
}