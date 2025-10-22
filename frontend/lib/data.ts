import { LayoutDashboard, Building2, Users, Briefcase, TrendingUp, ListChecks, LucideIcon, X, FileUser} from 'lucide-react';

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
    { page: 'vagas', icon: Briefcase, title: 'Vagas', href: '/vacancies' },
    
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

export interface CandidatesRowData { 
    nome: string; 
    email: string; 
    status: string; 
    candidaturas: string; 
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

export const CandidatesTableData: CandidatesRowData[] = [
    { nome: 'Desenvolvedor Full Stack', email: 'dev@empresa.com', status: 'Aberta', candidaturas: '5' },
    { nome: 'Analista de Logística', email: 'analista@empresa.com', status: 'Aberta', candidaturas: '3' },
];
