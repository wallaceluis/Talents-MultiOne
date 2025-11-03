import { LayoutDashboard, Building2, Users, Briefcase, TrendingUp, ListChecks, LucideIcon, X, FileUser, BarChart3 } from 'lucide-react';

// ============================================
// INTERFACES
// ============================================
export interface ThemeStyle {
    name: string; bg: string; sidebar: string; sidebarActive: string; cardBg: string;
    cardBorder: string; iconColor: string; titleColor: string; cardText: string;
    mainText: string; buttonBg: string; sidebarHover: string;
}
export type Themes = { [key: string]: ThemeStyle };
export interface MenuItem { page: string; icon: LucideIcon; title: string; href: string; }
export interface MetricCardData { title: string; value: string; icon: LucideIcon; color: string; }

// ============================================
// TEMAS
// ============================================
export const themes: Themes = {
    original: { 
        name: 'Escuro', 
        bg: 'bg-gradient-to-br from-black via-slate-900 to-black', 
        sidebar: 'bg-gray-900/95 backdrop-blur-sm border-r border-blue-900/30', 
        sidebarActive: 'bg-blue-600/70', 
        cardBg: 'bg-gray-800/70', 
        cardBorder: 'border-blue-700/30 hover:border-blue-600', 
        iconColor: 'text-blue-400', 
        titleColor: 'text-white', 
        cardText: 'text-gray-300', 
        mainText: 'text-white', 
        buttonBg: 'bg-blue-600 hover:bg-blue-700', 
        sidebarHover: 'hover:bg-slate-800/40' 
    },
    whiteblue: { 
        name: 'Claro', 
        bg: 'bg-white', 
        sidebar: 'bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl', 
        sidebarHover: 'hover:bg-blue-50/50', 
        sidebarActive: 'bg-blue-50 text-blue-800', 
        cardBg: 'bg-white shadow-lg', 
        cardBorder: 'border-gray-100 hover:border-blue-300', 
        iconColor: 'text-blue-500', 
        titleColor: 'text-gray-900', 
        cardText: 'text-gray-700', 
        mainText: 'text-gray-900', 
        buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white' 
    },
};

// ============================================
// MENU LATERAL
// ============================================
export const menuItems: MenuItem[] = [
    { page: 'Dashboard', icon: LayoutDashboard, title: 'Dashboard', href: '/dashboard' },
    { page: 'Empresas', icon: Building2, title: 'Empresas', href: '/companies' },
    { page: 'Candidatos', icon: FileUser, title: 'Candidatos', href: '/candidates' },
    { page: 'Users', icon: Users, title: 'Usuários', href: '/users' },
    { page: 'Vagas', icon: Briefcase, title: 'Vagas', href: '/vacancies' },
    { page: 'Relatórios', icon: BarChart3, title: 'Relatórios', href: '/reports' },
];

// ============================================
// DADOS MOCKADOS REMOVIDOS
// ============================================
// Todos os dados agora virão da API!
// Use os hooks personalizados para buscar dados reais:
// - useCompanies() para empresas
// - useCandidates() para candidatos  
// - useUsers() para usuários
// - useVacancies() para vagas
// - useDashboard() para estatísticas

export const metricCards: MetricCardData[] = [];
export const tableData: any[] = [];
export const usersData: any[] = [];
export const statusCardsData: MetricCardData[] = [];
export const vacanciesMetricCards: MetricCardData[] = [];
export const candidatesMetricCards: MetricCardData[] = [];
export const vacanciesTableData: any[] = [];
export const CandidatesTableData: any[] = [];

// ============================================
// RELATÓRIOS (mantido para funcionalidade)
// ============================================
export interface ReportCardData {
  id: string; 
  title: string;
  icon: LucideIcon;
  color: string;
  summary: { label: string; value: string | number; }[];
  detailedInfo: { label: string; value: string | number; }[];
  downloadFormats: ('pdf' | 'excel' | 'csv')[];
}

export const reportsData: ReportCardData[] = [
  {
    id: 'dashboard',
    title: 'Dashboard Geral',
    icon: LayoutDashboard,
    color: 'text-white',
    summary: [
      { label: 'Total de Métricas', value: 4 },
      { label: 'Período', value: 'Último mês' },
    ],
    detailedInfo: [
      { label: 'Empresas Cadastradas', value: '-' },
      { label: 'Vagas Abertas', value: '-' },
      { label: 'Total de Candidatos', value: '-' },
      { label: 'Candidaturas', value: '-' },
    ],
    downloadFormats: ['pdf', 'excel'],
  },
];
