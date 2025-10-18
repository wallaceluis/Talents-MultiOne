'use client';
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  ListChecks,
  Menu,
  X,
  Search,
  
  Palette,
  LucideIcon, 
} from 'lucide-react';


interface ThemeStyle {
  name: string;
  bg: string;
  sidebar: string;
  sidebarActive: string;
  cardBg: string;
  cardBorder: string;
  iconColor: string;
  titleColor: string;
  cardText: string;
  mainText: string;
  buttonBg: string;
  sidebarHover: string;
}


type Themes = {
  [key: string]: ThemeStyle;
};


interface MenuItem {
    page: string;
    icon: LucideIcon;
    title: string;
}

interface MetricCardData {
    title: string;
    value: string;
    icon: LucideIcon;
    color: string;
}

interface TableRowData {
    empresa: string;
    email: string;
    setor: string;
    plano: string;
    status: string;
}


interface ThemeProp {
    currentTheme: ThemeStyle;
}

interface MetricCardProps extends MetricCardData, ThemeProp {}




const themes: Themes = {
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
    buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
};

const menuItems: MenuItem[] = [
  { page: 'Dashboard', icon: LayoutDashboard, title: 'Dashboard' },
  { page: 'Empresas', icon: Building2, title: 'Empresas' },
];

const metricCards: MetricCardData[] = [
  { title: 'Empresas Cadastradas', value: '8', icon: Building2, color: 'text-blue-500' },
  { title: 'Vagas Abertas', value: '2', icon: Briefcase, color: 'text-green-500' },
  { title: 'Total de Candidatos', value: '3', icon: Users, color: 'text-yellow-500' },
  { title: 'Total de Candidaturas', value: '0', icon: TrendingUp, color: 'text-red-500' },
];

const tableData: TableRowData[] = [
  { empresa: 'Empresa 10', email: 'teste@empresa.com', setor: 'Indústria', plano: 'Gratuito', status: 'Trial' },
  { empresa: 'Suprenova Telecom', email: 'filmar@gmail.com', setor: 'Logística', plano: 'Gratuito', status: 'Trial' },
  { empresa: 'MedCare Saúde', email: 'rh@medcare.com.br', setor: 'Saúde', plano: 'Enterprise', status: 'Ativo' },
  { empresa: 'EduTech Ensino', email: 'contato@edutech.edu.br', setor: 'Educação', plano: 'Básico', status: 'Ativo' },
  { empresa: 'LogFlow Logística', email: 'contato@logflow.com.br', setor: 'Serviços', plano: 'Profissional', status: 'Ativo' },
  { empresa: 'RetailMax Varejo', email: 'rh@retailmax.com.br', setor: 'Varejo', plano: 'Enterprise', status: 'Ativo' },
];


const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color, currentTheme }) => (
  <div className={`p-4 md:p-5 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all duration-300 shadow-lg`}>
    <div className="flex justify-between items-start">
      <div className="flex-1 min-w-0">
        <h3 className={`text-xs md:text-sm font-medium ${currentTheme.cardText} opacity-70 truncate`}>{title}</h3>
        <p className={`text-2xl md:text-3xl font-bold ${currentTheme.titleColor} mt-1`}>{value}</p>
      </div>
      <Icon className={`${color} opacity-80 flex-shrink-0 ml-2`} size={28} />
    </div>
  </div>
);

const CompaniesTable: React.FC<ThemeProp> = ({ currentTheme }) => (
  <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg overflow-hidden`}>
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h3 className={`text-xl md:text-2xl font-semibold ${currentTheme.titleColor}`}>Empresas Cadastradas</h3>
      <button className={`w-full sm:w-auto px-4 py-2 md:px-5 md:py-3 rounded-lg ${currentTheme.buttonBg} font-medium text-sm md:text-base whitespace-nowrap`}>
        + Nova Empresa
      </button>
    </div>

    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="inline-block min-w-full align-middle">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {['EMPRESA', 'SETOR', 'PLANO', 'STATUS', 'AÇÕES'].map((header) => (
                <th key={header} className={`px-3 md:px-6 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tableData.map((row, i) => (
              <tr key={i} className={`transition-colors ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                <td className={`px-3 md:px-6 py-4 ${currentTheme.mainText}`}>
                  <div className="font-semibold text-sm md:text-base truncate max-w-[150px] md:max-w-none">{row.empresa}</div>
                  <div className="text-xs opacity-70 truncate max-w-[150px] md:max-w-none">{row.email}</div>
                </td>
                <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                  <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${currentTheme.name === 'Claro' ? 'bg-blue-500/20 text-blue-600' : 'bg-blue-500/20 text-blue-300'}`}>
                    {row.setor}
                  </span>
                </td>
                <td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText} whitespace-nowrap`}>{row.plano}</td>
                <td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText}`}>
                  <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium
                    ${row.status === 'Ativo' 
                      ? currentTheme.name === 'Claro' ? 'bg-green-500/20 text-green-600' : 'bg-green-500/20 text-green-300'
                      : currentTheme.name === 'Claro' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                    {row.status}
                  </span>
                </td>
                <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                  <div className="flex space-x-2">
                    <button className={`${currentTheme.name === 'Claro' ? 'hover:text-blue-600' : 'hover:text-blue-300'} transition-colors`}>✏️</button>
                    <button className={`${currentTheme.name === 'Claro' ? 'hover:text-red-600' : 'hover:text-red-300'} transition-colors`}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const DashboardPage: React.FC<ThemeProp> = ({ currentTheme }) => (
  <main className="space-y-6 md:space-y-8">
    <div>
      <h1 className={`text-2xl md:text-4xl font-bold mb-2 ${currentTheme.mainText}`}>Bem-vindo!</h1>
      <p className={`text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
        Controle total da plataforma SaaS de recrutamento
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metricCards.map((data, i) => (
        <MetricCard key={`metric-${i}`} {...data} currentTheme={currentTheme} />
      ))}
    </div>

    <CompaniesTable currentTheme={currentTheme} />
  </main>
);

const CompaniesPage: React.FC<ThemeProp> = ({ currentTheme }) => {
  const statusCardsData: MetricCardData[] = [
    { title: 'Total', value: '8', icon: ListChecks, color: 'text-blue-500' },
    { title: 'Ativo', value: '6', icon: Users, color: 'text-green-500' },
    { title: 'Trial', value: '2', icon: Briefcase, color: 'text-yellow-500' },
    { title: 'Inativo', value: '0', icon: X, color: 'text-red-500' },
  ];

  return (
    <main className="space-y-6 md:space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className={`text-2xl md:text-4xl font-bold ${currentTheme.mainText}`}>Gerenciamento de Empresas</h1>
          <p className={`mt-2 text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
            Empresas cadastradas na plataforma
          </p>
        </div>
        <button className={`w-full md:w-auto px-5 py-3 rounded-lg ${currentTheme.buttonBg} font-medium whitespace-nowrap`}>
          + Cadastrar Empresa
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar empresas..."
            className={`w-full p-3 pl-12 pr-4 rounded-xl border ${
              currentTheme.name === 'Claro' 
                ? 'border-gray-300 bg-white text-gray-900' 
                : 'bg-gray-800/50 border-gray-700/50 text-white'
            } placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
          />
        </div>

        <select className={`w-full lg:w-56 p-3 rounded-xl border cursor-pointer ${
          currentTheme.name === 'Claro'
            ? 'border-gray-300 bg-white text-gray-900'
            : 'bg-gray-800/50 border-gray-700/50 text-white'
        } transition-all`}>
          <option value="">Todos os Setores</option>
          <option>Tecnologia</option>
          <option>Saúde</option>
          <option>Educação</option>
        </select>

        <select className={`w-full lg:w-52 p-3 rounded-xl border cursor-pointer ${
          currentTheme.name === 'Claro'
            ? 'border-gray-300 bg-white text-gray-900'
            : 'bg-gray-800/50 border-gray-700/50 text-white'
        } transition-all`}>
          <option value="">Todos os Planos</option>
          <option>Gratuito</option>
          <option>Básico</option>
          <option>Profissional</option>
          <option>Enterprise</option>
        </select>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statusCardsData.map((data, i) => (
          <MetricCard key={`status-${i}`} {...data} currentTheme={currentTheme} />
        ))}
      </div>

      <CompaniesTable currentTheme={currentTheme} />
    </main>
  );
};

export default function DashboardLayout() {
  const [theme, setTheme] = useState<keyof Themes>('whiteblue'); 
  const [activePage, setActivePage] = useState<string>('Dashboard'); 
  const [showThemeSelector, setShowThemeSelector] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);


  const currentTheme: ThemeStyle = themes[theme];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} transition-colors duration-500`}>
      
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      <aside
        className={`${currentTheme.sidebar} fixed top-0 left-0 h-full p-4 flex flex-col justify-between transition-all duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${sidebarOpen ? 'w-64' : 'lg:w-20'}`}
      >
        <div>
          <div className={`flex items-center mb-8 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            <div className="flex items-center">
              
              {sidebarOpen && <span className={`ml-2 text-xl font-bold ${currentTheme.titleColor}`}>MultiOne</span>}
            </div>
            
            <button onClick={toggleSidebar} className={`${currentTheme.mainText} ${isMobile || sidebarOpen ? '' : 'hidden lg:block'}`}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, i) => {
             
              const Icon = item.icon; 
              const isActive = item.page === activePage;

              return (
                <button
                  key={i}
                  onClick={() => {
                    setActivePage(item.page);
                    if (isMobile) setSidebarOpen(false);
                  }}
                  className={`w-full group flex items-center gap-3 ${currentTheme.mainText}
                    ${isActive ? currentTheme.sidebarActive : currentTheme.sidebarHover} 
                    rounded-xl px-3 py-3 transition-all duration-300 ${sidebarOpen ? '' : 'justify-center'}`}
                >
                  <Icon className={`${isActive ? 'text-blue-600' : currentTheme.iconColor} flex-shrink-0`} size={22} />
                  {sidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-2 py-3 rounded-lg w-full ${currentTheme.buttonBg} font-bold transition-all duration-300 px-3`}
        >
          <Palette size={20} />
          {sidebarOpen && <span>Tema</span>}
        </button>
      </aside>

      {/* Botão de menu para mobile */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className={`fixed top-4 left-4 z-20 p-3 rounded-lg ${currentTheme.buttonBg} shadow-lg lg:hidden`}
        >
          <Menu size={24} />
        </button>
      )}

    
      <div className={`transition-all duration-300 ${sidebarOpen && !isMobile ? 'lg:ml-64' : 'lg:ml-20'} p-4 md:p-6 lg:p-10`}>
        <div className="max-w-7xl mx-auto">
          {activePage === 'Dashboard' ? (
            <DashboardPage currentTheme={currentTheme} />
          ) : (
            <CompaniesPage currentTheme={currentTheme} />
          )}
        </div>
      </div>

     
      {showThemeSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className={`${currentTheme.cardBg} backdrop-blur-lg p-6 md:p-8 rounded-2xl border ${currentTheme.cardBorder} shadow-2xl w-full max-w-sm`}>
            <h3 className={`${currentTheme.mainText} text-lg font-bold mb-4 flex items-center justify-between`}>
              <div className='flex items-center gap-2'>
                <Palette size={20} />
                Escolha o Tema
              </div>
              <button onClick={() => setShowThemeSelector(false)} className={`${currentTheme.name === 'Claro' ? 'text-gray-600 hover:text-gray-900' : 'text-gray-400 hover:text-white'} transition-colors`}>
                <X size={20} />
              </button>
            </h3>
            <div className="space-y-3">
              {Object.keys(themes).map((key) => (
                <button
                  key={key}
                 
                  onClick={() => {
                    setTheme(key as keyof Themes); 
                    setShowThemeSelector(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    theme === key
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : currentTheme.name === 'Claro' 
                        ? 'bg-gray-100 text-gray-900 hover:bg-gray-200' 
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {themes[key].name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}