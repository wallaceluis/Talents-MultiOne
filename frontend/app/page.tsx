'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  BarChart2,
  PieChart,
  TrendingUp,
  ListChecks,
  UserCircle,
  FileText,
  Rocket,
  Palette,
  Menu,
  X,
  Search,
  Filter,
} from 'lucide-react';

type ThemeKey = 'original' | 'whiteblue';
type ActivePage = 'Dashboard' | 'Empresas';


const themes: Record<ThemeKey, any> = {
  original: {
    name: 'Escuro', 
    bg: 'bg-gradient-to-br from-black via-[#0a1a40] to-black',
    header: 'bg-gray-900/80 backdrop-blur-md border-b border-blue-900/30',
    sidebar: 'bg-gray-900/80 border-r border-blue-900/30',
    sidebarActive: 'bg-blue-600/70',
    cardBg: 'bg-gray-800/70',
    cardBorder: 'border-blue-700/30 hover:border-blue-600',
    iconColor: 'text-blue-400 group-hover:text-blue-300',
    titleColor: 'text-white group-hover:text-blue-300',
    cardText: 'text-gray-300',
    mainText: 'text-white',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
    sidebarHover: 'hover:bg-[#0a1a40]/40'
  },
  whiteblue: {
    name: 'Claro', 
    bg: 'bg-white',
    header: 'bg-white/95 backdrop-blur-sm border-b border-gray-100 text-gray-900 shadow-sm',
    sidebar: 'bg-white border-r border-gray-100 text-gray-900 shadow-xl',
    sidebarHover: 'hover:bg-blue-50/50',
    sidebarActive: 'bg-blue-50 text-blue-800',
    cardBg: 'bg-white shadow-lg',
    cardBorder: 'border-white hover:border-blue-300',
    iconColor: 'text-blue-500',
    titleColor: 'text-black-900',
    cardText: 'text-black-700',
    mainText: 'text-black-900',
    buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
};


const SECTORS_OPTIONS = [
    'Tecnologia da Informação (TI) / Software',
    'Educação e Treinamento',
    'Saúde e Bem-Estar',
    'Vendas e Comércio',
    'Marketing e Publicidade',
    'Recursos Humanos e Recrutamento',
    'Administração e Escritório',
    'Finanças e Contabilidade',
    'Engenharia e Projetos',
    'Logística e Transporte',
    'Indústria e Manufatura',
    'Construção Civil e Arquitetura',
    'Agronegócio e Agricultura',
    'Jurídico e Advocacia',
    'Hotelaria e Turismo',
    'Alimentação e Gastronomia',
    'Arte, Cultura e Entretenimento',
    'Ciência e Pesquisa',
    'Atendimento ao Cliente / Call Center',
    'Energia e Meio Ambiente',
    'Telecomunicações',
    'Seguros',
    'Imobiliário e Construção',
    'Transporte Aéreo, Marítimo e Ferroviário',
    'Setor Público e Governamental',
    'Organizações sem Fins Lucrativos / ONG',
    'Moda e Design',
    'Esportes e Lazer',
    'Mineração e Metalurgia',
    'Farmacêutico e Biotecnologia',
    'Outros',
];


const PLAN_OPTIONS = [
    'Gratuito',
    'Básico',
    'Profissional',
    'Enterprise',
];



const menuItems = [
  { page: 'Dashboard', icon: LayoutDashboard, title: 'Dashboard', desc: 'Visão geral do sistema' },
  { page: 'Empresas', icon: Building2, title: 'Empresas', desc: 'Gerencie empresas cadastradas' },
];

const metricCardsData = [
  { title: 'Empresas Cadastradas', value: '8', icon: Building2, color: 'text-blue-500', indicator: '', bg: 'bg-blue-500/10' },
  { title: 'Vagas Abertas', value: '2', icon: Briefcase, color: 'text-green-500', indicator: '→ 3 total', bg: 'bg-green-500/10' },
  { title: 'Total de Candidatos', value: '3', icon: Users, color: 'text-yellow-500', indicator: '', bg: 'bg-yellow-500/10' },
  { title: 'Total de Candidaturas', value: '0', icon: TrendingUp, color: 'text-red-500', indicator: '', bg: 'bg-red-500/10' },
];


const secondaryMetricCardsData = [
  {
    title: 'Métricas de Performance',
    icon: BarChart2,
    desc: 'Indicadores chave da plataforma',
    content: (
      <div className="space-y-3 pt-3">
        <div className="flex justify-between items-center p-2 rounded-lg bg-purple-500/10">
          <span className="text-sm">Candidatos por Vaga</span>
          <span className="font-bold text-lg text-purple-400">0</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-green-500/10">
          <span className="text-sm">Vagas por Empresa</span>
          <span className="font-bold text-lg text-green-400">0.38</span>
        </div>
        <div className="flex justify-between items-center p-2 rounded-lg bg-red-500/10">
          <span className="text-sm">Taxa de Conversão</span>
          <span className="font-bold text-lg text-red-400">0%</span>
        </div>
      </div>
    ),
  },
  {
    title: 'Distribuição por Planos',
    icon: PieChart,
    desc: 'Visão por tipo de assinatura',
    content: (
      <div className="space-y-4 pt-3">
        {[
          { name: 'Gratuito', count: 2, color: 'bg-blue-500' },
          { name: 'Enterprise', count: 2, color: 'bg-purple-500' },
          { name: 'Básico', count: 1, color: 'bg-yellow-500' },
          { name: 'Profissional', count: 3, color: 'bg-red-500' },
        ].map((plan) => (
          <div key={plan.name} className="flex items-center space-x-2">
            <span className="text-sm w-24">{plan.name}</span>
            <div className="flex-1 h-3 rounded-full bg-gray-700">
              <div
                className={`h-full rounded-full ${plan.color}`}
                style={{ width: `${(plan.count / 8) * 100}%` }}
              ></div>
            </div>
            <span className="text-sm font-semibold">{plan.count}</span>
          </div>
        ))}
      </div>
    ),
  },
];


const tableData = [
  { empresa: 'Empresa 10', email: 'teste@empresa.com', setor: 'Indústria e Manufatura', plano: 'Gratuito', status: 'Trial', estatisticas: '1 usuário, 0 vagas, 0 candidatos', size: 'Pequena' },
  { empresa: 'Suprenova Telecom', email: 'filmar@gmail.com', setor: 'Logística e Transporte', plano: 'Gratuito', status: 'Trial', estatisticas: '1 usuário, 1 vaga, 0 candidatos', size: 'Pequena' },
  { empresa: 'MedCare Saúde', email: 'rh@medcare.com.br', setor: 'Saúde', plano: 'Enterprise', status: 'Ativo', estatisticas: '5 usuários, 3 vagas, 12 candidatos', size: 'Média' },
  { empresa: 'EduTech Ensino', email: 'contato@edutech.edu.br', setor: 'Educação', plano: 'Básico', status: 'Ativo', estatisticas: '1 usuário, 0 vagas, 0 candidatos', size: 'Pequena' },
  { empresa: 'LogFlow Logística', email: 'contato@logflow.com.br', setor: 'Serviços', plano: 'Profissional', status: 'Ativo', estatisticas: '1 usuário, 0 vagas, 0 candidatos', size: 'Média' },
  { empresa: 'RetailMax Varejo', email: 'rh@retailmax.com.br', setor: 'Varejo', plano: 'Enterprise', status: 'Ativo', estatisticas: '1 usuário, 0 vagas, 0 candidatos', size: 'Grande' },
  { empresa: 'TechStart Inovação', email: 'contato@techstart.com.br', setor: 'Tecnologia', plano: 'Profissional', status: 'Ativo', estatisticas: '1 usuário, 0 vagas, 0 candidatos', size: 'Startup' },
  { empresa: 'TechCorp Inovação', email: 'contato@techcorp.com.br', setor: 'Tecnologia', plano: 'Profissional', status: 'Ativo', estatisticas: '1 usuário, 3 vagas, 3 candidatos', size: 'Média' },
];


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


const SecondaryMetricCard = ({ title, icon: Icon, desc, content, currentTheme }: any) => (
  <div
    className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all duration-300 shadow-lg lg:col-span-1`}
  >
    <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-3">
      <Icon className={`${currentTheme.iconColor}`} size={24} />
      <div>
        <h3 className={`text-xl font-semibold ${currentTheme.titleColor}`}>{title}</h3>
        <p className={`text-xs ${currentTheme.cardText} opacity-70`}>{desc}</p>
      </div>
    </div>
    <div className="text-sm">{content}</div>
  </div>
);


const CompaniesTable = ({ currentTheme, title = 'Empresas Cadastradas' }: any) => (
  <div
    className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all duration-300 shadow-lg`}
  >
    <div className="flex justify-between items-center mb-6">
      <h3 className={`text-2xl font-semibold ${currentTheme.titleColor}`}>{title}</h3>
      <button className={`p-3 rounded-lg ${currentTheme.buttonBg} text-white font-medium flex items-center`}>
        + Nova Empresa
      </button>
    </div>

   
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-white/10">
        <thead>
          <tr>
            {['EMPRESA', 'SETOR', 'PLANO', 'STATUS', 'ESTATÍSTICAS', 'AÇÕES'].map((header) => (
              <th
                key={header}
                className={`px-6 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {tableData.map((row, i) => (
            <tr key={i} className="hover:bg-white/5 transition-colors duration-150">
              <td className={`px-6 py-4 whitespace-nowrap ${currentTheme.mainText}`}>
                <div className="font-semibold">{row.empresa}</div>
                <div className="text-xs opacity-70">{row.email}</div>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.cardText}`}>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                  {row.setor}
                </span>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.cardText}`}>{row.plano}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.cardText}`}>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                  ${row.status === 'Ativo' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                  {row.status}
                </span>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.cardText} opacity-80`}>
                {row.estatisticas}
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${currentTheme.cardText}`}>
                <div className="flex space-x-2">
                  <button className="text-blue-400 hover:text-blue-300">✏️</button>
                  <button className="text-red-400 hover:text-red-300">🗑️</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);


const DashboardPage = ({ currentTheme }: { currentTheme: any }) => (
  <main>
   
    <h1 className={`text-4xl font-bold mb-2 ${currentTheme.mainText}`}>Bem-vindo!</h1>
    <p className={`mb-8 ${currentTheme.mainText} opacity-70`}>
      Controle total da plataforma SaaS de recrutamento
    </p>

    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {metricCardsData.map((data, i) => (
        <MetricCard key={`metric-${i}`} {...data} currentTheme={currentTheme} />
      ))}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
      {secondaryMetricCardsData.map((data, i) => (
        <SecondaryMetricCard key={`secondary-metric-${i}`} {...data} currentTheme={currentTheme} />
      ))}
    </div>

   
    <CompaniesTable currentTheme={currentTheme} />
  </main>
);


const CompaniesPage = ({ currentTheme }: { currentTheme: any }) => {


  const statusCardsData = [
    { title: 'Total', value: '8', icon: ListChecks, color: 'text-blue-500' },
    { title: 'Ativo', value: '6', icon: Users, color: 'text-green-500' },
    { title: 'Trial', value: '2', icon: Briefcase, color: 'text-yellow-500' },
    { title: 'Inativo', value: '0', icon: X, color: 'text-red-500' },
  ];

 
  const isLightTheme = currentTheme.name === 'Claro'; 

  return (
    <main>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-4xl font-bold ${currentTheme.mainText}`}>Gerenciamento de Empresas</h1>
        <button className={`p-3 rounded-lg ${currentTheme.buttonBg} text-white font-medium flex items-center`}>
          + Cadastrar Empresa Cliente
        </button>
      </div>
      <p className={`mb-8 ${currentTheme.mainText} opacity-70`}>
        Empresas que se cadastraram na plataforma MultiOne Talents
      </p>

      
      <div className="flex flex-col md:flex-row gap-4 mb-10">
       
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar empresas por nome ou email..."
            
            className={`w-full p-3 pl-12 pr-12 rounded-xl border ${isLightTheme ? 'border-gray-300 bg-white' : 'bg-gray-700/50 border-gray-600/50'} ${currentTheme.mainText} placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300`}
          />
         
          <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer hover:text-blue-500" size={20} />
        </div>


        <select
          className={`w-full md:w-56 p-3 rounded-xl appearance-none cursor-pointer border-2 font-medium
                      ${isLightTheme
              ? 'border-blue-500 bg-white text-blue-700 shadow-md focus:ring-blue-500 focus:border-blue-500' 
              : 'bg-gray-700/50 border-blue-600 text-white' 
            } ${currentTheme.mainText} transition-all duration-300`}
          defaultValue=""
        >
          <option value="" disabled>Todos os Setores</option>
          {SECTORS_OPTIONS.map(sector => <option key={sector} value={sector}>{sector}</option>)}
        </select>

        
        <select
          className={`w-full md:w-52 p-3 rounded-xl appearance-none cursor-pointer border font-medium
                      ${isLightTheme
              ? 'border-gray-300 bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500' 
              : 'bg-gray-700/50 border-gray-600/50 text-white' 
            } ${currentTheme.mainText} transition-all duration-300`}
          defaultValue=""
        >
          <option value="" disabled>Todos os Planos</option>
          {PLAN_OPTIONS.map(plan => <option key={plan} value={plan}>{plan}</option>)}
        </select>
      </div>

    
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statusCardsData.map((data, i) => (
         
          <div
            key={`status-card-${i}`}
            className={`p-5 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} flex flex-col justify-between transition-all duration-300 shadow-lg`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className={`text-sm font-medium ${currentTheme.cardText} opacity-70`}>{data.title}</h3>
                <p className={`text-3xl font-bold ${currentTheme.titleColor} mt-1`}>{data.value}</p>
              </div>
              <data.icon className={`${data.color} opacity-80`} size={32} />
            </div>
          </div>
        ))}
      </div>

     
      <CompaniesTable currentTheme={currentTheme} title="Lista Completa de Empresas" />
    </main>
  );
};



export default function DashboardLayout() {
  const [theme, setTheme] = useState<ThemeKey>('whiteblue'); 
  const [activePage, setActivePage] = useState<ActivePage>('Dashboard'); 
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    
    const themeClasses = themes[theme].bg.split(' ');
    document.body.className = `min-h-screen transition-colors duration-500 ${themeClasses.join(' ')}`;

    return () => {
      document.body.className = '';
    };
  }, [theme]);

  const currentTheme = themes[theme];

  return (
    <div className="flex min-h-screen">
  
      <aside
        className={`${currentTheme.sidebar} fixed top-0 left-0 h-full p-4 flex flex-col justify-between transition-all duration-500 z-40
          ${sidebarOpen ? 'w-64' : 'w-20'}`}
      >
        <div>
        
          <div className={`flex items-center p-2 mb-8 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            <Rocket className="text-blue-500 mr-2" size={32} />
            {sidebarOpen && <span className={`text-xl font-bold ${currentTheme.titleColor}`}>MultiOne ADMIN</span>}
            <button
              className="text-white"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

         
          <nav className="space-y-3">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              const isActive = item.page === activePage;

              return (
                <a
                  key={i}
                  onClick={() => setActivePage(item.page as ActivePage)} 
                  className={`group flex items-center gap-3 ${currentTheme.mainText} cursor-pointer
                    ${isActive ? currentTheme.sidebarActive : currentTheme.sidebarHover} rounded-xl px-3 py-3 transition-all duration-300`}
                >
                  <Icon
                    className={`${isActive ? 'text-white' : currentTheme.iconColor}`}
                    size={22}
                  />
                  {sidebarOpen && <span className="text-sm font-medium">{item.title}</span>}
                </a>
              );
            })}
          </nav>
        </div>

        
        <button
          onClick={() => setShowThemeSelector(!showThemeSelector)}
          className={`flex items-center ${sidebarOpen ? 'justify-start' : 'justify-center'} gap-2 mt-auto py-3 rounded-lg w-full ${currentTheme.buttonBg} text-white font-bold transition-all duration-300 px-3`}
        >
          <Palette size={20} />
          {sidebarOpen && <span>Tema</span>}
        </button>
      </aside>

    
      <div
        className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'ml-64' : 'ml-20'} p-10 ${currentTheme.mainText}`}
      >
        <div className="max-w-7xl mx-auto">
        
          {activePage === 'Dashboard' ? (
            <DashboardPage currentTheme={currentTheme} />
          ) : (
            <CompaniesPage currentTheme={currentTheme} />
          )}
        </div>
      </div>

   
      {showThemeSelector && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-gray-900/90 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 shadow-2xl w-80">
            <h3 className="text-white text-lg font-bold mb-4 flex items-center justify-between">
              <div className='flex items-center gap-2'>
                <Palette size={20} />
                Escolha o Tema
              </div>
              <button onClick={() => setShowThemeSelector(false)} className='text-gray-400 hover:text-white'>
                <X size={20} />
              </button>
            </h3>
            <div className="space-y-3">
              {(Object.keys(themes) as ThemeKey[]).map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key);
                    setShowThemeSelector(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${theme === key
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
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
