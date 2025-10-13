<<<<<<< Updated upstream
// app/page.tsx
import React from 'react';
import Link from 'next/link';
=======
'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCircle,
  FileText,
  Rocket,
  Palette,
  Menu,
  X,
  Briefcase, // Icone para Vagas Abertas
  Award, // Icone para Total de Candidaturas
  BarChart2, // Icone para Métricas de Performance
  PieChart, // Icone para Distribuição por Planos
  ListChecks, // Icone para Empresas Cadastradas (na seção de tabela, se necessário)
  TrendingUp, // Icone para Total de Candidaturas (como no dashboard)
} from 'lucide-react';

type ThemeKey = 'original' | 'purple' | 'dark' | 'whiteblue';

const themes: Record<ThemeKey, any> = {
  original: {
    name: 'Original (Azul Escuro)',
    bg: 'bg-gradient-to-br from-black via-[#0a1a40] to-black', // mais preto, azul no meio
    header: 'bg-gray-900/80 backdrop-blur-md border-b border-blue-900/30',
    sidebar: 'bg-gray-900/80 border-r border-blue-900/30',
    cardBg: 'bg-gray-800/70',
    cardBorder: 'border-blue-700/30 hover:border-blue-600',
    iconColor: 'text-blue-400 group-hover:text-blue-300',
    titleColor: 'text-white group-hover:text-blue-300',
    cardText: 'text-white',
    mainText: 'text-white',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
    sidebarHover: 'hover:bg-[#0a1a40]/40',
  },
  purple: {
    name: 'Roxo Místico',
    bg: 'bg-gradient-to-br from-purple-950 via-gray-900 to-indigo-950',
    header: 'bg-purple-950/70 backdrop-blur-md border-b border-purple-800/50',
    sidebar: 'bg-purple-950/70 border-r border-purple-800/50',
    sidebarHover: 'hover:bg-gray-800/60',
    cardBg: 'bg-purple-900/60',
    cardBorder: 'border-purple-500/30 hover:border-purple-400/60',
    iconColor: 'text-purple-400 group-hover:text-purple-300',
    titleColor: 'text-white group-hover:text-purple-300',
    cardText: 'text-white',
    mainText: 'text-white',
    buttonBg: 'bg-purple-600 hover:bg-purple-700',
  },
  dark: {
    name: 'Escuro Total',
    bg: 'bg-gradient-to-br from-black via-[#0a1a40]/30 to-black',
    header: 'bg-black/90 backdrop-blur-md border-b border-gray-800/50',
    sidebar: 'bg-black/90 border-r border-gray-800/50',
    cardBg: 'bg-black/80',
    cardBorder: 'border-gray-700/40 hover:border-gray-600',
    iconColor: 'text-blue-400 group-hover:text-blue-300',
    titleColor: 'text-white group-hover:text-blue-300',
    cardText: 'text-white',
    mainText: 'text-white',
    buttonBg: 'bg-gray-800 hover:bg-gray-700',
    sidebarHover: 'hover:bg-[#0a1a40]/20',
  },

  whiteblue: {
    name: 'Branco → Azul #0a1a40',
    bg: 'bg-white',
    header: 'bg-white/95 backdrop-blur-md border-b border-blue-900 text-[#0a1a40]',
    sidebar: 'bg-white/95 border-r border-blue-900 text-[#0a1a40]',
    sidebarHover: 'hover:bg-gray-800/60',
    cardBg: 'bg-gradient-to-br from-[#0a1a40] via-[#243b6b] to-[#3b82f6]',
    cardBorder: 'border-blue-900/80 hover:border-blue-700',
    iconColor: 'text-white',
    titleColor: 'text-white',
    cardText: 'text-white',
    mainText: 'text-[#0a1a40]',
    buttonBg: 'bg-white hover:bg-blue-100 text-[#0a1a40]',
  },
};

const menuItems = [
  { href: '#', icon: LayoutDashboard, title: 'Dashboard', desc: 'Visão geral do sistema' },
  { href: '#', icon: Building2, title: 'Empresas', desc: 'Gerencie empresas cadastradas' },
  { href: '#', icon: UserCircle, title: 'Candidatos', desc: 'Gerencie candidatos' },
  { href: '#', icon: Users, title: 'Usuários', desc: 'Controle de acesso' },
  { href: '#', icon: FileText, title: 'Relatórios', desc: 'Gerenciamento de relatórios' },
];

// Novos dados para os cards de métricas/dashboard (simulados da 2ª imagem)
const metricCardsData = [
  {
    title: 'Empresas Cadastradas',
    value: '8',
    icon: Building2,
    color: 'text-blue-500',
    indicator: '',
    bg: 'bg-blue-500/10',
  },
  {
    title: 'Vagas Abertas',
    value: '2',
    icon: Briefcase,
    color: 'text-green-500',
    indicator: '→ 3 total',
    bg: 'bg-green-500/10',
  },
  {
    title: 'Total de Candidatos',
    value: '3',
    icon: Users,
    color: 'text-yellow-500',
    indicator: '',
    bg: 'bg-yellow-500/10',
  },
  {
    title: 'Total de Candidaturas',
    value: '0',
    icon: TrendingUp,
    color: 'text-red-500',
    indicator: '',
    bg: 'bg-red-500/10',
  },
];

// Componente para exibir as métricas de desempenho e planos (cards maiores)
const secondaryMetricCardsData = [
  {
    title: 'Métricas de Performance',
    icon: BarChart2,
    content: (
      <div className="space-y-3 pt-3">
        <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
          <span className="text-sm">Candidatos por Vaga</span>
          <span className="font-bold text-lg text-purple-400">0</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-green-500/10">
          <span className="text-sm">Vagas por Empresa</span>
          <span className="font-bold text-lg text-green-400">0.38</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
          <span className="text-sm">Taxa de Conversão</span>
          <span className="font-bold text-lg text-red-400">0%</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Distribuição por Planos',
    icon: PieChart,
    content: (
      <div className="space-y-3 pt-3">
        {[
          { name: 'Gratuito', count: 2, color: 'bg-blue-500' },
          { name: 'Enterprise', count: 2, color: 'bg-purple-500' },
          { name: 'Básico', count: 1, color: 'bg-yellow-500' },
          { name: 'Profissional', count: 3, color: 'bg-red-500' },
        ].map((plan) => (
          <div key={plan.name} className="flex items-center space-x-2">
            <span className="text-sm w-24">{plan.name}</span>
            <div className="flex-1 h-2 rounded-full bg-gray-700">
              <div
                className={`h-full rounded-full ${plan.color}`}
                style={{ width: `${(plan.count / 8) * 100}%` }} // 8 é o total de empresas
              ></div>
            </div>
            <span className="text-sm font-semibold">{plan.count}</span>
          </div>
        ))}
      </div>
    ),
  },
];

// Componente Card de Métrica (Topo)
const MetricCard = ({ title, value, icon: Icon, color, indicator, currentTheme }: any) => (
  <div
    className={`p-5 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} flex flex-col justify-between transition-all duration-300 shadow-lg`}
  >
    <div className="flex justify-between items-start">
      <div>
        <h3 className={`text-sm font-medium ${currentTheme.cardText} opacity-70`}>{title}</h3>
        <p className={`text-3xl font-bold ${currentTheme.titleColor} mt-1`}>{value}</p>
      </div>
      <Icon className={`${color} opacity-80`} size={32} />
    </div>
    {indicator && (
      <p className={`text-xs ${currentTheme.cardText} mt-2 opacity-60`}>{indicator}</p>
    )}
  </div>
);

// Componente Card de Métrica Secundária (Maior)
const SecondaryMetricCard = ({ title, icon: Icon, content, currentTheme }: any) => (
  <div
    className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all duration-300 shadow-lg lg:col-span-1`}
  >
    <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
      <Icon className={`${currentTheme.iconColor}`} size={24} />
      <h3 className={`text-xl font-semibold ${currentTheme.titleColor}`}>{title}</h3>
    </div>
    <div className={`${currentTheme.cardText}`}>{content}</div>
  </div>
);

export default function HomePage() {
  const [theme, setTheme] = useState<ThemeKey>('whiteblue');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    Object.values(themes).forEach(themeObj => {
      themeObj.bg.split(' ').forEach((cls: string) => {
        if (cls.trim()) document.body.classList.remove(cls);
      });
    });
    themes[theme].bg.split(' ').forEach((cls: string) => {
      if (cls.trim()) document.body.classList.add(cls);
    });
    document.body.classList.add('transition-colors', 'duration-500');
  }, [theme]);

  const currentTheme = themes[theme];
>>>>>>> Stashed changes

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gray-50">
      <h1 className="text-4xl font-bold">Painel Talents MultiOne</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        <Link
          href="/dashboard"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">📊 Dashboard</h2>
          <p className="text-gray-600 text-sm">Visão geral do sistema</p>
        </Link>

        <Link
          href="/companies"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">🏢 Empresas</h2>
          <p className="text-gray-600 text-sm">Gerencie empresas cadastradas</p>
        </Link>

<<<<<<< Updated upstream
        <Link
          href="/candidates"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">👤 Candidatos</h2>
          <p className="text-gray-600 text-sm">Gerencie candidatos</p>
        </Link>

        <Link
          href="/users"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">👥 Usuários</h2>
          <p className="text-gray-600 text-sm">Controle de acesso</p>
        </Link>

        <Link
          href="/plans"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">💼 Planos</h2>
          <p className="text-gray-600 text-sm">Gerenciamento de planos</p>
        </Link>
=======
        <main>
          {/* Seção de Boas-vindas (Mantida da 1ª imagem) */}
          <h2 className={`text-4xl font-bold mb-8 ${currentTheme.mainText}`}>Bem-vindo!</h2>
          <p className={`mb-8 ${currentTheme.mainText}`}>
            Explore as opções no menu lateral para navegar pelo painel.
          </p>

          {/* Cards de Métricas (Adicionados da 2ª imagem) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {metricCardsData.map((data, i) => (
              <MetricCard key={`metric-${i}`} {...data} currentTheme={currentTheme} />
            ))}
          </div>

          {/* Cards Maiores: Métricas de Performance e Distribuição por Planos (Adicionados da 2ª imagem) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {secondaryMetricCardsData.map((data, i) => (
              <SecondaryMetricCard key={`secondary-metric-${i}`} {...data} currentTheme={currentTheme} />
            ))}
          </div>

          {/* Cards de Navegação Principal (Mantidos da 1ª imagem, agora abaixo das métricas) */}
          <h3 className={`text-2xl font-bold mb-6 ${currentTheme.mainText}`}>Acesso Rápido</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={`nav-card-${i}`}
                  className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} hover:scale-105 transition-all duration-300 cursor-pointer`}
                  onClick={() => window.location.href = item.href} // Adiciona funcionalidade de navegação simulada
                >
                  <Icon className={`${currentTheme.iconColor} mb-3`} size={36} />
                  <h3 className={`text-xl font-semibold ${currentTheme.titleColor}`}>
                    {item.title}
                  </h3>
                  <p className={`mt-2 ${currentTheme.cardText}`}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </main>
>>>>>>> Stashed changes
      </div>
    </main>
  );
}
