import { LayoutDashboard, Building2, Users, Briefcase, TrendingUp, ListChecks, LucideIcon, X, FileUser, BarChart3 } from 'lucide-react';

// Interfaces
export interface ThemeStyle {
    name: string; bg: string; sidebar: string; sidebarActive: string; cardBg: string;
    cardBorder: string; iconColor: string; titleColor: string; cardText: string;
    mainText: string; buttonBg: string; sidebarHover: string;
}
export type Themes = { [key: string]: ThemeStyle };
export interface MenuItem { page: string; icon: LucideIcon; title: string; href: string; }
export interface MetricCardData { title: string; value: string; icon: LucideIcon; color: string; }
export interface TableRowData { empresa: string; email: string; setor: string; plano: string; status: string; }
export interface UserData { name: string; email: string; role: 'Admin' | 'Collaborator'; avatar: string; }

// Data
export const themes: Themes = {
    original: { name: 'Escuro', bg: 'bg-gradient-to-br from-black via-slate-900 to-black', sidebar: 'bg-gray-900/95 backdrop-blur-sm border-r border-blue-900/30', sidebarActive: 'bg-blue-600/70', cardBg: 'bg-gray-800/70', cardBorder: 'border-blue-700/30 hover:border-blue-600', iconColor: 'text-blue-400', titleColor: 'text-white', cardText: 'text-gray-300', mainText: 'text-white', buttonBg: 'bg-blue-600 hover:bg-blue-700', sidebarHover: 'hover:bg-slate-800/40' },
    whiteblue: { name: 'Claro', bg: 'bg-white', sidebar: 'bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl', sidebarHover: 'hover:bg-blue-50/50', sidebarActive: 'bg-blue-50 text-blue-800', cardBg: 'bg-white shadow-lg', cardBorder: 'border-gray-100 hover:border-blue-300', iconColor: 'text-blue-500', titleColor: 'text-gray-900', cardText: 'text-gray-700', mainText: 'text-gray-900', buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white' },
};

export const menuItems: MenuItem[] = [
    { page: 'Dashboard', icon: LayoutDashboard, title: 'Dashboard', href: '/dashboard' },
    { page: 'Empresas', icon: Building2, title: 'Empresas', href: '/companies' },
    { page: 'Candidatos', icon: FileUser, title: 'Candidatos', href: '/candidates' },
    { page: 'Users', icon: Users, title: 'Usuários', href: '/users' },
    { page: 'Vagas', icon: Briefcase, title: 'Vagas', href: '/vacancies' },
    { page: 'Relatórios', icon: BarChart3, title: 'Relatórios', href: '/reports' },


];

export const metricCards: MetricCardData[] = [
    { title: 'Empresas Cadastradas', value: '8', icon: Building2, color: 'text-blue-500' }, { title: 'Vagas Abertas', value: '2', icon: Briefcase, color: 'text-green-500' },
    { title: 'Total de Candidatos', value: '3', icon: Users, color: 'text-yellow-500' }, { title: 'Total de Candidaturas', value: '0', icon: TrendingUp, color: 'text-red-500' },
];

export const tableData: TableRowData[] = [
    { empresa: 'Empresa 10', email: 'teste@empresa.com', setor: 'Indústria', plano: 'Gratuito', status: 'Trial' }, { empresa: 'Suprenova Telecom', email: 'filmar@gmail.com', setor: 'Logística', plano: 'Gratuito', status: 'Trial' },
    { empresa: 'MedCare Saúde', email: 'rh@medcare.com.br', setor: 'Saúde', plano: 'Enterprise', status: 'Ativo' }, { empresa: 'EduTech Ensino', email: 'contato@edutech.edu.br', setor: 'Educação', plano: 'Básico', status: 'Ativo' },
];

export const usersData: UserData[] = [
    { name: 'Wallace', email: 'wallace@multione.com', role: 'Admin', avatar: 'https://avatarfiles.alphacoders.com/354/354743.jpeg' },
    { name: 'Wesley', email: 'wesley@multione.com', role: 'Admin', avatar: 'https://img.freepik.com/vetores-premium/pato-bonito-usando-oculos-de-sol-personagem-de-desenho-animado_1087248-1639.jpg' },
    { name: 'Felipe', email: 'felipe@multione.com', role: 'Collaborator', avatar: 'https://pt.quizur.com/_image?href=https://img.quizur.com/f/img5e23301dcebb41.04472536.jpg?lastEdited=1579364385&w=1024&h=1024&f=webp' },
];

export const statusCardsData = [
    { title: 'Total', value: '8', icon: ListChecks, color: 'text-blue-500' },
    { title: 'Ativo', value: '6', icon: Users, color: 'text-green-500' },
    { title: 'Trial', value: '2', icon: Briefcase, color: 'text-yellow-500' },
    { title: 'Inativo', value: '0', icon: X, color: 'text-red-500' },
];


export interface VacancyRowData {
    titulo: string;
    empresa: string;
    setor: string;
    candidaturas: string;
    status: string;
}

export const vacanciesMetricCards: MetricCardData[] = [
    { title: 'Vagas Abertas', value: '2', icon: Briefcase, color: 'text-green-500' },
    { title: 'Total de Candidaturas', value: '0', icon: TrendingUp, color: 'text-red-500' },
    { title: 'Total de Candidatos', value: '3', icon: Users, color: 'text-yellow-500' },
];

export const vacanciesTableData: VacancyRowData[] = [
    { titulo: 'Desenvolvedor Full Stack', empresa: 'Empresa 10', setor: 'Indústria', candidaturas: '5', status: 'Aberta' },
    { titulo: 'Analista de Logística', empresa: 'Suprenova Telecom', setor: 'Logística', candidaturas: '3', status: 'Aberta' },
];

export interface ReportCardData {
  id: string; 
  title: string;
  icon: LucideIcon;
  color: string;
  summary: {
    label: string;
    value: string | number;
  }[];
  detailedInfo: {
    label: string;
    value: string | number;
  }[];
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
      { label: 'Empresas Cadastradas', value: 8 },
      { label: 'Vagas Abertas', value: 2 },
      { label: 'Total de Candidatos', value: 3 },
      { label: 'Candidaturas', value: 0 },
      { label: 'Taxa de Conversão', value: '0%' },
      { label: 'Última Atualização', value: 'Hoje' },
    ],
    downloadFormats: ['pdf', 'excel'],
  },
  {
    id: 'companies',
    title: 'Empresas',
    icon: Building2,
    color: 'text-white',
    summary: [
      { label: 'Total', value: 8 },
      { label: 'Ativas', value: 6 },
    ],
    detailedInfo: [
      { label: 'Total de Empresas', value: 8 },
      { label: 'Empresas Ativas', value: 6 },
      { label: 'Em Trial', value: 2 },
      { label: 'Inativas', value: 0 },
      { label: 'Plano Enterprise', value: 1 },
      { label: 'Plano Básico', value: 1 },
      { label: 'Plano Gratuito', value: 6 },
    ],
    downloadFormats: ['pdf', 'excel', 'csv'],
  },
  {
    id: 'candidates',
    title: 'Candidatos',
    icon: FileUser,
    color: 'text-white',
    summary: [
      { label: 'Total', value: 3 },
      { label: 'Em Processo', value: 2 },
    ],
    detailedInfo: [
      { label: 'Total de Candidatos', value: 3 },
      { label: 'Candidatos Ativos', value: 3 },
      { label: 'Em Processo Seletivo', value: 2 },
      { label: 'Aprovados', value: 0 },
      { label: 'Reprovados', value: 0 },
      { label: 'Taxa de Aprovação', value: '0%' },
    ],
    downloadFormats: ['pdf', 'excel', 'csv'],
  },
  {
    id: 'users',
    title: 'Usuários',
    icon: Users,
    color: 'text-white',
    summary: [
      { label: 'Total', value: 3 },
      { label: 'Admins', value: 2 },
    ],
    detailedInfo: [
      { label: 'Total de Usuários', value: 3 },
      { label: 'Administradores', value: 2 },
      { label: 'Colaboradores', value: 1 },
      { label: 'Usuários Ativos', value: 3 },
      { label: 'Último Login', value: 'Hoje' },
    ],
    downloadFormats: ['pdf', 'csv'],
  },
  {
    id: 'vacancies',
    title: 'Vagas',
    icon: Briefcase,
    color: 'text-white',
    summary: [
      { label: 'Total', value: 2 },
      { label: 'Abertas', value: 2 },
    ],
    detailedInfo: [
      { label: 'Vagas Abertas', value: 2 },
      { label: 'Vagas Fechadas', value: 0 },
      { label: 'Total de Candidaturas', value: 8 },
      { label: 'Média por Vaga', value: 4 },
      { label: 'Tempo Médio Aberto', value: '15 dias' },
      { label: 'Taxa de Preenchimento', value: '0%' },
    ],
    downloadFormats: ['pdf', 'excel', 'csv'],
  },
];

