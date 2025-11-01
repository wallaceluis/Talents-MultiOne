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
    original: { name: 'Escuro', 
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
        sidebarHover: 'hover:bg-slate-800/40' },
        
        whiteblue: { name: 'Claro', 
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
        buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white' },
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
    { title: 'Empresas Cadastradas', value: '8', icon: Building2, color: 'text-blue-500' }, 
    { title: 'Vagas Abertas', value: '2', icon: Briefcase, color: 'text-yellow-400' },
    { title: 'Total de Candidatos', value: '3', icon: Users, color: 'text-green-500' }, 
    { title: 'Total de Candidaturas', value: '0', icon: TrendingUp, color: 'text-red-500' },
];

export const tableData: TableRowData[] = [
    { empresa: 'Empresa 10', email: 'teste@empresa.com', setor: 'Indústria', plano: 'Gratuito', status: 'Trial' }, 
    { empresa: 'Suprenova Telecom', email: 'filmar@gmail.com', setor: 'Logística', plano: 'Gratuito', status: 'Trial' },
    { empresa: 'MedCare Saúde', email: 'rh@medcare.com.br', setor: 'Saúde', plano: 'Enterprise', status: 'Ativo' }, 
    { empresa: 'EduTech Ensino', email: 'contato@edutech.edu.br', setor: 'Educação', plano: 'Básico', status: 'Ativo' },
];

export const usersData: UserData[] = [
    { name: 'Wallace', email: 'wallace@multione.com', role: 'Admin', avatar: 'https://avatarfiles.alphacoders.com/354/354743.jpeg' },
    { name: 'Wesley', email: 'wesley@multione.com', role: 'Admin', avatar: 'https://img.freepik.com/vetores-premium/pato-bonito-usando-oculos-de-sol-personagem-de-desenho-animado_1087248-1639.jpg' },
    { name: 'Felipe', email: 'felipe@multione.com', role: 'Collaborator', avatar: 'https://pt.quizur.com/_image?href=https://img.quizur.com/f/img5e23301dcebb41.04472536.jpg?lastEdited=1579364385&w=1024&h=1024&f=webp' },
];

export const statusCardsData = [
    { title: 'Total', value: '8', icon: ListChecks, color: 'text-blue-500' },
    { title: 'Ativo', value: '6', icon: Users, color: 'text-green-500' },
    { title: 'Trial', value: '2', icon: Briefcase, color: 'text-yellow-400' },
    { title: 'Inativo', value: '9', icon: X, color: 'text-red-500' },
];


export interface VacancyRowData {
    titulo: string;
    empresa: string;
    setor: string;
    candidaturas: string;
    status: string;
    
}

export interface CandidatesRowData { 
    nome: string; 
    email: string; 
    status: string; 
    candidaturas: string; 
}

export const vacanciesMetricCards: MetricCardData[] = [
    { title: 'Vagas Abertas', value: '2', icon: Briefcase, color: 'text-yellow-400' },
    { title: 'Total de Candidaturas', value: '0', icon: TrendingUp, color: 'text-red-500' },
    { title: 'Total de Candidatos', value: '3', icon: Users, color: 'text-green-500' },
];

export const candidatesMetricCards: MetricCardData[] = [
  { title: 'Totais', value: '100', icon: Users, color: 'text-green-500' },
  { title: 'Online', value: '5', icon: ListChecks, color: 'text-blue-500' },
  { title: 'Ativos (180 dias)', value: '60', icon: TrendingUp, color: 'text-red-500' },
  { title: 'Candidaturas Totais', value: '260', icon: Briefcase, color: 'text-yellow-400' },
  { title: 'Média de Candidaturas', value: '2.6', icon: BarChart3, color: 'text-purple-500' },
];


export const vacanciesTableData: VacancyRowData[] = [
    { titulo: 'Desenvolvedor Full Stack', empresa: 'Empresa 10', setor: 'Indústria', candidaturas: '5', status: 'Aberta' },
    { titulo: 'Analista de Logística', empresa: 'Suprenova Telecom', setor: 'Logística', candidaturas: '3', status: 'Aberta' },
];

export const CandidatesTableData: CandidatesRowData[] = [
    { nome: 'Wallace Luis Santos da Silva', email: 'wallace@empresa.com', status: 'Ativo', candidaturas: '5' },
    { nome: 'Wesley Costa', email: 'wesley@empresa.com', status: 'Ativo', candidaturas: '3' },
    { nome: 'Felipe Fernandes', email: 'felipe@empresa.com', status: 'Ativo', candidaturas: '3' },
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
    color: 'text-blue-500',
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
    color: 'text-purple-500',
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
    color: 'text-red-500',
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
    color: 'text-green-500',
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
    color: 'text-yellow-400',
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

// ============================================
// ADICIONAR NO FINAL DE frontend/lib/data.ts
// ============================================

// Configurações de cores com gradientes
export const chartGradients = {
  blue: ['#3B82F6', '#60A5FA', '#93C5FD'],
  green: ['#10B981', '#34D399', '#6EE7B7'],
  yellow: ['#F59E0B', '#FBBF24', '#FCD34D'],
  purple: ['#A855F7', '#C084FC', '#D8B4FE'],
  red: ['#EF4444', '#F87171', '#FCA5A5'],
  cyan: ['#06B6D4', '#22D3EE', '#67E8F9'],
};

// Dados para Análise de Candidatos
export const candidatesAnalysisData = {
  // Evolução temporal
  evolution: [
    { month: 'Jan', total: 120 },
    { month: 'Fev', total: 145 },
    { month: 'Mar', total: 180 },
    { month: 'Abr', total: 210 },
    { month: 'Mai', total: 260 },
  ],
  
  // Comparação por atividade
  activities: [
    { name: 'Cadastros', value: 260 },
    { name: 'Logins', value: 180 },
    { name: 'Candidaturas', value: 320 },
  ],
  
  // Distribuição por estado
  byState: [
    { state: 'SP', count: 85 },
    { state: 'RJ', count: 62 },
    { state: 'MG', count: 45 },
    { state: 'RS', count: 38 },
    { state: 'PR', count: 30 },
  ],
  
  // Gênero
  byGender: [
    { name: 'Masculino', value: 140 },
    { name: 'Feminino', value: 110 },
    { name: 'Outros', value: 10 },
  ],
  
  // Faixa etária
  byAge: [
    { range: '18-24', count: 45 },
    { range: '25-34', count: 120 },
    { range: '35-44', count: 70 },
    { range: '45+', count: 25 },
  ],
  
  // Top cargos buscados
  topPositions: [
    { position: 'Desenvolvedor', count: 85 },
    { position: 'Analista', count: 62 },
    { position: 'Gerente', count: 48 },
    { position: 'Designer', count: 35 },
    { position: 'Vendedor', count: 30 },
  ],
};

// Dados para Análise de Empresas
export const companiesAnalysisData = {
  // Evolução temporal
  evolution: [
    { month: 'Jan', total: 5 },
    { month: 'Fev', total: 6 },
    { month: 'Mar', total: 7 },
    { month: 'Abr', total: 7 },
    { month: 'Mai', total: 8 },
  ],
  
  // Por segmento
  bySegment: [
    { name: 'Tecnologia', value: 3 },
    { name: 'Saúde', value: 2 },
    { name: 'Educação', value: 1 },
    { name: 'Logística', value: 1 },
    { name: 'Indústria', value: 1 },
  ],
  
  // Por estado
  byState: [
    { state: 'SP', count: 4 },
    { state: 'RJ', count: 2 },
    { state: 'MG', count: 1 },
    { state: 'RS', count: 1 },
  ],
  
  // Vagas por empresa (top 5)
  topByVacancies: [
    { company: 'Empresa 10', vacancies: 5 },
    { company: 'Suprenova Telecom', vacancies: 4 },
    { company: 'MedCare Saúde', vacancies: 3 },
    { company: 'EduTech Ensino', vacancies: 2 },
    { company: 'LogiExpress', vacancies: 1 },
  ],
  
  // Top 5 empresas com mais candidaturas
  topByCandidates: [
    { company: 'Empresa 10', applications: 45 },
    { company: 'Suprenova Telecom', applications: 38 },
    { company: 'MedCare Saúde', applications: 32 },
    { company: 'EduTech Ensino', applications: 25 },
    { company: 'LogiExpress', applications: 20 },
  ],
};

// Dados para Análise de Vagas
export const vacanciesAnalysisData = {
  // Evolução temporal
  evolution: [
    { month: 'Jan', total: 8 },
    { month: 'Fev', total: 12 },
    { month: 'Mar', total: 15 },
    { month: 'Abr', total: 18 },
    { month: 'Mai', total: 22 },
  ],
  
  // Por status
  byStatus: [
    { name: 'Abertas', value: 12 },
    { name: 'Encerradas', value: 8 },
    { name: 'Pausadas', value: 2 },
  ],
  
  // Por setor
  bySector: [
    { sector: 'Tecnologia', count: 8 },
    { sector: 'Saúde', count: 5 },
    { sector: 'Educação', count: 4 },
    { sector: 'Logística', count: 3 },
    { sector: 'Indústria', count: 2 },
  ],
  
  // Por cargo
  byPosition: [
    { position: 'Desenvolvedor Full Stack', count: 5 },
    { position: 'Analista de Dados', count: 4 },
    { position: 'Gerente de Projetos', count: 3 },
    { position: 'Designer UX/UI', count: 3 },
    { position: 'Analista de Logística', count: 2 },
    { position: 'Vendedor', count: 2 },
    { position: 'Professor', count: 2 },
    { position: 'Enfermeiro', count: 1 },
  ],
  
  // Por região
  byRegion: [
    { region: 'Sudeste', count: 12 },
    { region: 'Sul', count: 5 },
    { region: 'Nordeste', count: 3 },
    { region: 'Centro-Oeste', count: 2 },
  ],
};