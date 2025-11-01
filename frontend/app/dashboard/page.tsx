'use client';

import { useState } from 'react';
import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { CHART_COLORS, getChartTheme } from '../../components/charts/metric-charts';
import { 
  metricCards, 
  candidatesAnalysisData, 
  companiesAnalysisData, 
  vacanciesAnalysisData 
} from '../../lib/data';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Users, Building2, Briefcase, Calendar, MapPin, Filter } from 'lucide-react';

type AnalysisTab = 'candidates' | 'companies' | 'vacancies';

export default function DashboardPage() {
  const { currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<AnalysisTab>('candidates');
  
  // Estados dos filtros de Candidatos
  const [candidateFilters, setCandidateFilters] = useState({
    region: '',
    gender: '',
    ageRange: '',
    status: '',
    dateStart: '',
    dateEnd: '',
  });
  
  // Estados dos filtros de Empresas
  const [companyFilters, setCompanyFilters] = useState({
    segment: '',
    state: '',
    dateStart: '',
    dateEnd: '',
  });
  
  // Estados dos filtros de Vagas
  const [vacancyFilters, setVacancyFilters] = useState({
    status: '',
    sector: '',
    position: '',
    region: '',
    dateStart: '',
    dateEnd: '',
  });

  // Importar configurações de tema
  const chartTheme = getChartTheme(currentTheme);

  // Tabs de navegação com tamanho maior
  const tabs = [
    { id: 'candidates' as AnalysisTab, label: 'Candidatos', icon: Users },
    { id: 'companies' as AnalysisTab, label: 'Empresas', icon: Building2 },
    { id: 'vacancies' as AnalysisTab, label: 'Vagas', icon: Briefcase },
  ];

  // Componente de gráfico reutilizável
  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className={`p-4 md:p-6 rounded-xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all hover:shadow-lg`}>
      <h3 className={`text-lg font-semibold ${currentTheme.titleColor} mb-4`}>{title}</h3>
      <div className="h-72 md:h-80">{children}</div>
    </div>
  );

  // Componente de filtro reutilizável
  const FilterSection = ({ children }: { children: React.ReactNode }) => (
    <div className={`p-4 rounded-xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} mb-6`}>
      <div className="flex items-center gap-2 mb-4">
        <Filter size={18} className={currentTheme.iconColor} />
        <h3 className={`text-sm font-semibold ${currentTheme.titleColor} uppercase tracking-wide`}>
          Filtros
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {children}
      </div>
    </div>
  );

  // Input de filtro estilizado
  const FilterInput = ({ 
    label, 
    type = 'text', 
    value, 
    onChange, 
    options 
  }: { 
    label: string; 
    type?: string; 
    value: string; 
    onChange: (value: string) => void;
    options?: { value: string; label: string }[];
  }) => (
    <div>
      <label className={`block text-xs font-medium ${currentTheme.cardText} mb-1.5`}>
        {label}
      </label>
      {type === 'select' && options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border text-sm ${
            currentTheme.name === 'Claro'
              ? 'bg-white border-gray-300 text-gray-900'
              : 'bg-gray-800/50 border-gray-700 text-white'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
        >
          <option value="">Todos</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 rounded-lg border text-sm ${
            currentTheme.name === 'Claro'
              ? 'bg-white border-gray-300 text-gray-900'
              : 'bg-gray-800/50 border-gray-700 text-white'
          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
        />
      )}
    </div>
  );

  return (
    <main className="space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${currentTheme.mainText}`}>
          Dashboard Analítico
        </h1>
        <p className={`text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
          Visão consolidada de recrutamento e seleção
        </p>
      </div>

      {/* KPIs Gerais */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {metricCards.map((data, i) => (
          <MetricCard key={`metric-${i}`} {...data} />
        ))}
      </div>

      {/* Tabs de Análise - AUMENTADO */}
      <div className={`p-2 rounded-xl ${currentTheme.cardBg} border ${currentTheme.cardBorder} inline-flex gap-2 shadow-lg`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-lg transition-all duration-200 ${
                isActive
                  ? `${currentTheme.buttonBg} shadow-md scale-105`
                  : `${currentTheme.cardText} hover:bg-black/5 dark:hover:bg-white/5`
              }`}
            >
              <Icon size={22} />
              <span className="text-base font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================ */}
      {/* ANÁLISE DE CANDIDATOS */}
      {/* ============================================ */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.mainText}`}>
            Análise de Candidatos
          </h2>

          {/* Filtros de Candidatos */}
          <FilterSection>
            <FilterInput
              label="Região"
              type="select"
              value={candidateFilters.region}
              onChange={(v) => setCandidateFilters({ ...candidateFilters, region: v })}
              options={[
                { value: 'sudeste', label: 'Sudeste' },
                { value: 'sul', label: 'Sul' },
                { value: 'nordeste', label: 'Nordeste' },
                { value: 'norte', label: 'Norte' },
                { value: 'centro-oeste', label: 'Centro-Oeste' },
              ]}
            />
            <FilterInput
              label="Gênero"
              type="select"
              value={candidateFilters.gender}
              onChange={(v) => setCandidateFilters({ ...candidateFilters, gender: v })}
              options={[
                { value: 'masculino', label: 'Masculino' },
                { value: 'feminino', label: 'Feminino' },
                { value: 'outros', label: 'Outros' },
              ]}
            />
            <FilterInput
              label="Faixa Etária"
              type="select"
              value={candidateFilters.ageRange}
              onChange={(v) => setCandidateFilters({ ...candidateFilters, ageRange: v })}
              options={[
                { value: '18-24', label: '18-24 anos' },
                { value: '25-34', label: '25-34 anos' },
                { value: '35-44', label: '35-44 anos' },
                { value: '45+', label: '45+ anos' },
              ]}
            />
            <FilterInput
              label="Status"
              type="select"
              value={candidateFilters.status}
              onChange={(v) => setCandidateFilters({ ...candidateFilters, status: v })}
              options={[
                { value: 'ativo', label: 'Ativo' },
                { value: 'inativo', label: 'Inativo' },
                { value: 'processo', label: 'Em Processo' },
              ]}
            />
            <FilterInput
              label="Data Inicial"
              type="date"
              value={candidateFilters.dateStart}
              onChange={(v) => setCandidateFilters({ ...candidateFilters, dateStart: v })}
            />
            <FilterInput
              label="Data Final"
              type="date"
              value={candidateFilters.dateEnd}
              onChange={(v) => setCandidateFilters({ ...candidateFilters, dateEnd: v })}
            />
          </FilterSection>

          {/* Gráficos de Candidatos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Evolução Total de Candidatos">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={candidatesAnalysisData.evolution}>
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS[1]} stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="month" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="total" stroke={CHART_COLORS[0]} strokeWidth={3} dot={{ fill: CHART_COLORS[0], r: 5 }} fill="url(#blueGradient)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Comparação por Atividade">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidatesAnalysisData.activities}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="name" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {candidatesAnalysisData.activities.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Distribuição por Estado">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidatesAnalysisData.byState} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis type="number" stroke={chartTheme.axisColor} />
                  <YAxis type="category" dataKey="state" stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Bar dataKey="count" fill={CHART_COLORS[2]} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Distribuição por Gênero">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={candidatesAnalysisData.byGender}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {candidatesAnalysisData.byGender.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Distribuição por Faixa Etária">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidatesAnalysisData.byAge}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="range" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Bar dataKey="count" fill={CHART_COLORS[4]} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top 5 Cargos Mais Buscados">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candidatesAnalysisData.topPositions} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis type="number" stroke={chartTheme.axisColor} />
                  <YAxis type="category" dataKey="position" stroke={chartTheme.axisColor} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Bar dataKey="count" fill={CHART_COLORS[6]} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* ANÁLISE DE EMPRESAS */}
      {/* ============================================ */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.mainText}`}>
            Análise de Empresas
          </h2>

          {/* Filtros de Empresas */}
          <FilterSection>
            <FilterInput
              label="Segmento"
              type="select"
              value={companyFilters.segment}
              onChange={(v) => setCompanyFilters({ ...companyFilters, segment: v })}
              options={[
                { value: 'tecnologia', label: 'Tecnologia' },
                { value: 'saude', label: 'Saúde' },
                { value: 'educacao', label: 'Educação' },
                { value: 'logistica', label: 'Logística' },
                { value: 'industria', label: 'Indústria' },
              ]}
            />
            <FilterInput
              label="Estado"
              type="select"
              value={companyFilters.state}
              onChange={(v) => setCompanyFilters({ ...companyFilters, state: v })}
              options={[
                { value: 'SP', label: 'São Paulo' },
                { value: 'RJ', label: 'Rio de Janeiro' },
                { value: 'MG', label: 'Minas Gerais' },
                { value: 'RS', label: 'Rio Grande do Sul' },
              ]}
            />
            <FilterInput
              label="Data Inicial"
              type="date"
              value={companyFilters.dateStart}
              onChange={(v) => setCompanyFilters({ ...companyFilters, dateStart: v })}
            />
            <FilterInput
              label="Data Final"
              type="date"
              value={companyFilters.dateEnd}
              onChange={(v) => setCompanyFilters({ ...companyFilters, dateEnd: v })}
            />
          </FilterSection>

          {/* Gráficos de Empresas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Evolução de Novas Empresas">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={companiesAnalysisData.evolution}>
                  <defs>
                    <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[2]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS[3]} stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="month" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="total" stroke={CHART_COLORS[2]} strokeWidth={3} dot={{ fill: CHART_COLORS[2], r: 5 }} fill="url(#greenGradient)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Empresas por Segmento">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companiesAnalysisData.bySegment}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {companiesAnalysisData.bySegment.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Empresas por Estado">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companiesAnalysisData.byState}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="state" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Bar dataKey="count" fill={CHART_COLORS[10]} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Top 5 Empresas por Vagas">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companiesAnalysisData.topByVacancies} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis type="number" stroke={chartTheme.axisColor} />
                  <YAxis type="category" dataKey="company" stroke={chartTheme.axisColor} width={150} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Bar dataKey="vacancies" fill={CHART_COLORS[4]} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Top 5 Empresas por Candidaturas">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companiesAnalysisData.topByCandidates} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                <XAxis type="number" stroke={chartTheme.axisColor} />
                <YAxis type="category" dataKey="company" stroke={chartTheme.axisColor} width={150} />
                <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                <Bar dataKey="applications" fill={CHART_COLORS[6]} radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* ============================================ */}
      {/* ANÁLISE DE VAGAS */}
      {/* ============================================ */}
      {activeTab === 'vacancies' && (
        <div className="space-y-6">
          <h2 className={`text-xl md:text-2xl font-bold ${currentTheme.mainText}`}>
            Análise de Vagas
          </h2>

          {/* Filtros de Vagas */}
          <FilterSection>
            <FilterInput
              label="Status da Vaga"
              type="select"
              value={vacancyFilters.status}
              onChange={(v) => setVacancyFilters({ ...vacancyFilters, status: v })}
              options={[
                { value: 'aberta', label: 'Aberta' },
                { value: 'encerrada', label: 'Encerrada' },
                { value: 'pausada', label: 'Pausada' },
              ]}
            />
            <FilterInput
              label="Setor"
              type="select"
              value={vacancyFilters.sector}
              onChange={(v) => setVacancyFilters({ ...vacancyFilters, sector: v })}
              options={[
                { value: 'tecnologia', label: 'Tecnologia' },
                { value: 'saude', label: 'Saúde' },
                { value: 'educacao', label: 'Educação' },
                { value: 'logistica', label: 'Logística' },
                { value: 'industria', label: 'Indústria' },
              ]}
            />
            <FilterInput
              label="Cargo"
              type="select"
              value={vacancyFilters.position}
              onChange={(v) => setVacancyFilters({ ...vacancyFilters, position: v })}
              options={[
                { value: 'desenvolvedor', label: 'Desenvolvedor' },
                { value: 'analista', label: 'Analista' },
                { value: 'gerente', label: 'Gerente' },
                { value: 'designer', label: 'Designer' },
              ]}
            />
            <FilterInput
              label="Região"
              type="select"
              value={vacancyFilters.region}
              onChange={(v) => setVacancyFilters({ ...vacancyFilters, region: v })}
              options={[
                { value: 'sudeste', label: 'Sudeste' },
                { value: 'sul', label: 'Sul' },
                { value: 'nordeste', label: 'Nordeste' },
                { value: 'centro-oeste', label: 'Centro-Oeste' },
              ]}
            />
            <FilterInput
              label="Data Inicial"
              type="date"
              value={vacancyFilters.dateStart}
              onChange={(v) => setVacancyFilters({ ...vacancyFilters, dateStart: v })}
            />
            <FilterInput
              label="Data Final"
              type="date"
              value={vacancyFilters.dateEnd}
              onChange={(v) => setVacancyFilters({ ...vacancyFilters, dateEnd: v })}
            />
          </FilterSection>

          {/* Gráficos de Vagas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="Evolução Total de Vagas">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={vacanciesAnalysisData.evolution}>
                  <defs>
                    <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CHART_COLORS[8]} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={CHART_COLORS[9]} stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                  <XAxis dataKey="month" stroke={chartTheme.axisColor} />
                  <YAxis stroke={chartTheme.axisColor} />
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="total" stroke={CHART_COLORS[8]} strokeWidth={3} dot={{ fill: CHART_COLORS[8], r: 5 }} fill="url(#redGradient)" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Vagas por Status">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vacanciesAnalysisData.byStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    dataKey="value"
                    label
                  >
                    {vacanciesAnalysisData.byStatus.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: chartTheme.tooltipBg, border: `1px solid ${chartTheme.tooltipBorder}`, color: chartTheme.tooltipTextColor, borderRadius: '8px' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Vagas por Setor">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vacanciesAnalysisData.bySector}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                <XAxis dataKey="sector" stroke={chartTheme.axisColor} />
                <YAxis stroke={chartTheme.axisColor} />
                <Tooltip
                    contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    border: `1px solid ${chartTheme.tooltipBorder}`,
                    color: chartTheme.tooltipTextColor,
                    borderRadius: '8px',
                    }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {vacanciesAnalysisData.bySector.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                </Bar>
                </BarChart>
            </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Vagas por Cargo (Top 8)">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vacanciesAnalysisData.byPosition} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                <XAxis type="number" stroke={chartTheme.axisColor} />
                <YAxis
                    type="category"
                    dataKey="position"
                    stroke={chartTheme.axisColor}
                    width={160}
                    fontSize={12}
                />
                <Tooltip
                    contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    border: `1px solid ${chartTheme.tooltipBorder}`,
                    color: chartTheme.tooltipTextColor,
                    borderRadius: '8px',
                    }}
                />
                <Bar dataKey="count" fill={CHART_COLORS[6]} radius={[0, 8, 8, 0]} />
                </BarChart>
            </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Vagas por Região">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={vacanciesAnalysisData.byRegion}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.gridColor} strokeOpacity={0.3} />
                <XAxis dataKey="region" stroke={chartTheme.axisColor} />
                <YAxis stroke={chartTheme.axisColor} />
                <Tooltip
                    contentStyle={{
                    backgroundColor: chartTheme.tooltipBg,
                    border: `1px solid ${chartTheme.tooltipBorder}`,
                    color: chartTheme.tooltipTextColor,
                    borderRadius: '8px',
                    }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {vacanciesAnalysisData.byRegion.map((_, index) => (
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