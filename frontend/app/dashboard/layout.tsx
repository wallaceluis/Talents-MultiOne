'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
    LayoutDashboard, Building2, Users, Briefcase, TrendingUp, ListChecks, 
    LucideIcon, Menu, X, User, ChevronDown, LogOut, Sun, Moon, Shield, UserCircle
} from 'lucide-react';

//==============================================================================
// 1. TIPOS E DADOS
//==============================================================================

interface ThemeStyle {
    name: string; bg: string; sidebar: string; sidebarActive: string; cardBg: string;
    cardBorder: string; iconColor: string; titleColor: string; cardText: string;
    mainText: string; buttonBg: string; sidebarHover: string;
}
type Themes = { [key: string]: ThemeStyle };
interface MenuItem { page: string; icon: LucideIcon; title: string; }
interface MetricCardData { title: string; value: string; icon: LucideIcon; color: string; }
interface TableRowData { empresa: string; email: string; setor: string; plano: string; status: string; }
interface UserData { name: string; email: string; role: 'Admin' | 'Collaborator'; avatar: string; }

const themes: Themes = {
    original: { name: 'Escuro', bg: 'bg-gradient-to-br from-black via-slate-900 to-black', sidebar: 'bg-gray-900/95 backdrop-blur-sm border-r border-blue-900/30', sidebarActive: 'bg-blue-600/70', cardBg: 'bg-gray-800/70', cardBorder: 'border-blue-700/30 hover:border-blue-600', iconColor: 'text-blue-400', titleColor: 'text-white', cardText: 'text-gray-300', mainText: 'text-white', buttonBg: 'bg-blue-600 hover:bg-blue-700', sidebarHover: 'hover:bg-slate-800/40' },
    whiteblue: { name: 'Claro', bg: 'bg-white', sidebar: 'bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl', sidebarHover: 'hover:bg-blue-50/50', sidebarActive: 'bg-blue-50 text-blue-800', cardBg: 'bg-white shadow-lg', cardBorder: 'border-gray-100 hover:border-blue-300', iconColor: 'text-blue-500', titleColor: 'text-gray-900', cardText: 'text-gray-700', mainText: 'text-gray-900', buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white' },
};

const menuItems: MenuItem[] = [
    { page: 'Dashboard', icon: LayoutDashboard, title: 'Dashboard' },
    { page: 'Empresas', icon: Building2, title: 'Empresas' },
    { page: 'Usuários', icon: Users, title: 'Usuários' },
];

const metricCards: MetricCardData[] = [
    { title: 'Empresas Cadastradas', value: '8', icon: Building2, color: 'text-blue-500' }, 
    { title: 'Vagas Abertas', value: '2', icon: Briefcase, color: 'text-green-500' },
    { title: 'Total de Candidatos', value: '3', icon: Users, color: 'text-yellow-500' }, 
    { title: 'Total de Candidaturas', value: '0', icon: TrendingUp, color: 'text-red-500' },
];

const companiesData: TableRowData[] = [
    { empresa: 'Empresa 10', email: 'teste@empresa.com', setor: 'Indústria', plano: 'Gratuito', status: 'Trial' }, 
    { empresa: 'Suprenova Telecom', email: 'filmar@gmail.com', setor: 'Logística', plano: 'Gratuito', status: 'Trial' },
    { empresa: 'MedCare Saúde', email: 'rh@medcare.com.br', setor: 'Saúde', plano: 'Enterprise', status: 'Ativo' }, 
    { empresa: 'EduTech Ensino', email: 'contato@edutech.edu.br', setor: 'Educação', plano: 'Básico', status: 'Ativo' },
];

const usersData: UserData[] = [
    { name: 'Admin', email: 'admin@multione.com', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
    { name: 'Colaborador', email: 'colab@multione.com', role: 'Collaborator', avatar: 'https://i.pravatar.cc/150?u=collab' },
];

//==============================================================================
// 2. CONTEXTO DO TEMA
//==============================================================================

interface ThemeContextType {
    theme: keyof Themes;
    currentTheme: ThemeStyle;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

// EXPORTAÇÃO NOMEADA DO HOOK
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    return context;
};

//==============================================================================
// 3. COMPONENTES REUTILIZÁVEIS
//==============================================================================

const MetricCard: React.FC<{ data: MetricCardData }> = ({ data }) => {
    const { currentTheme } = useTheme();
    const Icon = data.icon;
    return (
        <div className={`p-4 md:p-5 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all duration-300 shadow-lg`}>
            <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                    <h3 className={`text-xs md:text-sm font-medium ${currentTheme.cardText} opacity-70 truncate`}>{data.title}</h3>
                    <p className={`text-2xl md:text-3xl font-bold ${currentTheme.titleColor} mt-1`}>{data.value}</p>
                </div>
                <Icon className={`${data.color} opacity-80 flex-shrink-0 ml-2`} size={28} />
            </div>
        </div>
    );
};

const CompaniesTable: React.FC = () => {
    const { currentTheme } = useTheme();
    return (
        <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg overflow-hidden`}>
            <h3 className={`text-xl md:text-2xl font-semibold ${currentTheme.titleColor} mb-6`}>Empresas Recentes</h3>
            <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            {['EMPRESA', 'SETOR', 'PLANO', 'STATUS', 'AÇÕES'].map(h=>
                                <th key={h} className={`px-3 md:px-6 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>{h}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {companiesData.map((row,i)=>
                            <tr key={i} className={`transition-colors ${currentTheme.name==='Claro'?'hover:bg-gray-50':'hover:bg-white/5'}`}>
                                <td className={`px-3 md:px-6 py-4 ${currentTheme.mainText}`}>
                                    <div className="font-semibold text-sm md:text-base">{row.empresa}</div>
                                    <div className="text-xs opacity-70">{row.email}</div>
                                </td>
                                <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                                    <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${currentTheme.name==='Claro'?'bg-blue-100 text-blue-800':'bg-blue-900/50 text-blue-300'}`}>{row.setor}</span>
                                </td>
                                <td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText}`}>{row.plano}</td>
                                <td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText}`}>
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${row.status==='Ativo'?(currentTheme.name==='Claro'?'bg-green-100 text-green-800':'bg-green-900/50 text-green-300'):(currentTheme.name==='Claro'?'bg-yellow-100 text-yellow-800':'bg-yellow-900/50 text-yellow-300')}`}>{row.status}</span>
                                </td>
                                <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                                    <div className="flex space-x-2">
                                        <button className="hover:text-blue-400">✏️</button>
                                        <button className="hover:text-red-400">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const UsersTable: React.FC = () => {
    const { currentTheme } = useTheme();
    return (
        <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg overflow-hidden`}>
            <div className="overflow-x-auto -mx-4 md:mx-0">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            {['USUÁRIO', 'PERMISSÃO', 'AÇÕES'].map(h=>
                                <th key={h} className={`px-3 md:px-6 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>{h}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {usersData.map((user,i)=>
                            <tr key={i} className={`transition-colors ${currentTheme.name==='Claro'?'hover:bg-gray-50':'hover:bg-white/5'}`}>
                                <td className={`px-3 md:px-6 py-4 ${currentTheme.mainText}`}>
                                    <div className="flex items-center gap-4">
                                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <div className="font-semibold text-sm md:text-base">{user.name}</div>
                                            <div className="text-xs opacity-70">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${user.role==='Admin'?(currentTheme.name==='Claro'?'bg-green-100 text-green-800':'bg-green-900/50 text-green-300'):(currentTheme.name==='Claro'?'bg-blue-100 text-blue-800':'bg-blue-900/50 text-blue-300')}`}>
                                        <Shield size={14}/>{user.role}
                                    </span>
                                </td>
                                <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                                    <div className="flex space-x-2">
                                        <button className="hover:text-blue-400">✏️</button>
                                        <button className="hover:text-red-400">🗑️</button>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

//==============================================================================
// 4. PÁGINAS
//==============================================================================

const DashboardPage: React.FC = () => {
    const { currentTheme } = useTheme();
    return (
        <main className="space-y-6 md:space-y-8">
            <div>
                <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${currentTheme.mainText}`}>Bem-vindo!</h1>
                <p className={`text-sm md:text-base ${currentTheme.mainText} opacity-70`}>Controle total da plataforma SaaS de recrutamento</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {metricCards.map((data,i)=><MetricCard key={i} data={data}/>)}
            </div>
            <CompaniesTable/>
        </main>
    );
};

const CompaniesPage: React.FC = () => {
    const { currentTheme } = useTheme();
    return (
        <main className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={`text-2xl md:text-4xl font-bold ${currentTheme.mainText}`}>Gerenciamento de Empresas</h1>
                    <p className={`mt-2 text-sm md:text-base ${currentTheme.mainText} opacity-70`}>Empresas cadastradas na plataforma</p>
                </div>
                <button className={`w-full md:w-auto px-5 py-3 rounded-lg ${currentTheme.buttonBg} font-medium whitespace-nowrap`}>+ Cadastrar Empresa</button>
            </div>
            <CompaniesTable/>
        </main>
    );
};

const UsersPage: React.FC = () => {
    const { currentTheme } = useTheme();
    return (
        <main className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={`text-2xl md:text-4xl font-bold ${currentTheme.mainText}`}>Gerenciamento de Usuários</h1>
                    <p className={`mt-2 text-sm md:text-base ${currentTheme.mainText} opacity-70`}>Adicione, edite ou remova usuários</p>
                </div>
                <button className={`w-full md:w-auto px-5 py-3 rounded-lg ${currentTheme.buttonBg} font-medium whitespace-nowrap flex items-center justify-center gap-2`}>
                    <UserCircle size={20}/>Criar Novo Usuário
                </button>
            </div>
            <UsersTable/>
        </main>
    );
};

//==============================================================================
// 5. LAYOUT PRINCIPAL
//==============================================================================

const AppContent: React.FC = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [activePage, setActivePage] = useState('Dashboard');
    
    const { theme, currentTheme, toggleTheme } = useTheme();

    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const renderActivePage = () => {
        switch (activePage) {
            case 'Empresas': return <CompaniesPage />;
            case 'Usuários': return <UsersPage />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-500`}>
            <aside className={`${currentTheme.sidebar} fixed top-0 left-0 h-full p-4 flex flex-col justify-between transition-all duration-300 z-40 ${sidebarOpen ? 'w-64' : 'lg:w-20'}`}>
                <div>
                    <div className={`flex items-center mb-8 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
                        {sidebarOpen && <span className={`ml-2 text-xl font-bold ${currentTheme.titleColor}`}>MultiOne</span>}
                        <button onClick={toggleSidebar} className={currentTheme.mainText}>
                            {sidebarOpen ? <X size={24}/> : <Menu size={24}/>}
                        </button>
                    </div>
                    <nav className="space-y-2">
                        {menuItems.map(item => {
                            const Icon = item.icon;
                            const isActive = activePage === item.title;
                            return (
                                <button 
                                    key={item.page} 
                                    onClick={()=>{setActivePage(item.title); if(isMobile) setSidebarOpen(false);}} 
                                    className={`w-full group flex items-center gap-3 ${currentTheme.mainText} ${isActive?currentTheme.sidebarActive:currentTheme.sidebarHover} rounded-xl px-3 py-3 transition-all duration-300 ${sidebarOpen?'':'justify-center'}`}
                                >
                                    <Icon className={`${isActive?(currentTheme.name==='Claro'?'text-blue-600':'text-white'):currentTheme.iconColor} flex-shrink-0`} size={22}/>
                                    {sidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
                                </button>
                            )
                        })}
                    </nav>
                </div>
            </aside>
            {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black/50 z-30" onClick={()=>setSidebarOpen(false)}/>}
            
            <div className={`transition-all duration-300 ${sidebarOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-20'}`}>
                <header className={`flex items-center justify-between sticky top-0 ${currentTheme.sidebar} ${isMobile ? 'py-3 px-4' : 'py-3 px-10'} border-b ${currentTheme.cardBorder} z-20`}>
                    <div>{isMobile && !sidebarOpen && (<button onClick={()=>setSidebarOpen(true)} className={`p-2 rounded-lg ${currentTheme.buttonBg} shadow-lg`}><Menu size={22}/></button>)}</div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <button onClick={()=>setUserMenuOpen(!userMenuOpen)} className={`flex items-center gap-2 p-2 rounded-lg ${currentTheme.name==='Claro'?'hover:bg-gray-100':'hover:bg-gray-800/50'}`}>
                                <User className={`${currentTheme.mainText} opacity-80`} size={24}/>
                                <span className={`hidden md:block font-medium ${currentTheme.mainText}`}>Admin</span>
                                <ChevronDown className={`${currentTheme.mainText} opacity-60`} size={16}/>
                            </button>
                            {userMenuOpen && (
                                <div className={`absolute right-0 top-10 mt-2 w-56 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl shadow-2xl z-50`}>
                                    <div className="p-2">
                                        <div className="px-3 py-2">
                                            <p className={`text-sm font-medium ${currentTheme.titleColor} truncate`}>Admin</p>
                                            <p className={`text-xs ${currentTheme.cardText} opacity-70 truncate`}>admin@multione.com</p>
                                        </div>
                                        <div className={`h-px ${currentTheme.name==='Claro'?'bg-gray-200':'bg-gray-700/50'} my-1`}/>
                                        <button onClick={()=>window.location.href='/auth'} className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg ${currentTheme.name==='Claro'?'hover:bg-gray-100 text-red-600':'hover:bg-gray-800 text-red-400'}`}>
                                            <LogOut size={18}/><span className="font-medium text-sm">Sair</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={toggleTheme} className={`p-2 rounded-lg ${currentTheme.name==='Claro'?'hover:bg-gray-100':'hover:bg-gray-800/50'}`}>
                            {theme==='whiteblue'?<Moon className={`${currentTheme.mainText} opacity-80`} size={22}/>:<Sun className={`${currentTheme.mainText} opacity-80`} size={22}/>}
                        </button>
                    </div>
                </header>
                <main className="p-4 md:p-6 lg:p-10">
                    <div className="max-w-7xl mx-auto">{renderActivePage()}</div>
                </main>
            </div>
        </div>
    );
};

//==============================================================================
// 6. COMPONENTE RAIZ COM PROVIDER
//==============================================================================

const AppContentWrapper = () => {
    const [theme, setTheme] = useState<keyof Themes>('whiteblue');

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'whiteblue' ? 'original' : 'whiteblue'));
    };

    const currentTheme = themes[theme];
    const contextValue = { theme, currentTheme, toggleTheme };

    return (
        <ThemeContext.Provider value={contextValue}>
            <AppContent />
        </ThemeContext.Provider>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <AppContentWrapper />;
}