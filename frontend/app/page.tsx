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
    sidebarHover: 'hover:bg-[#0a1a40]/40'
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
  bg: 'bg-gradient-to-br from-black via-[#0a1a40]/30 to-black', // preto dominante, azul suave no meio
  header: 'bg-black/90 backdrop-blur-md border-b border-gray-800/50',
  sidebar: 'bg-black/90 border-r border-gray-800/50',
  cardBg: 'bg-black/80', // cards combinando com o fundo
  cardBorder: 'border-gray-700/40 hover:border-gray-600',
  iconColor: 'text-blue-400 group-hover:text-blue-300',
  titleColor: 'text-white group-hover:text-blue-300',
  cardText: 'text-white',
  mainText: 'text-white',
  buttonBg: 'bg-gray-800 hover:bg-gray-700',
  sidebarHover: 'hover:bg-[#0a1a40]/20', // hover leve azul escuro
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

  return (
    <div className={`min-h-screen flex ${currentTheme.bg} transition-colors duration-500`}>
      {/* Sidebar */}
      <aside
        className={`${currentTheme.sidebar} fixed top-0 left-0 h-full p-4 flex flex-col justify-between transition-all duration-500 ${sidebarOpen ? 'w-64' : 'w-20'
          }`}
      >
        <div>
          <button
            className="flex items-center justify-center w-full mb-8 text-[#0a1a40]"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <nav className="space-y-3">
            {menuItems.map((item, i) => {
              const Icon = item.icon;

              return (
                <a
                  key={i}
                  href={item.href}
                  className={`group flex items-center gap-3 ${currentTheme.mainText} hover:text-blue-900 hover:bg-blue-50 rounded-xl px-3 py-3 transition-all duration-300`}
                >
                  <Icon
                    className={`${theme === 'whiteblue' ? 'text-[#0a1a40]' : currentTheme.iconColor}`}
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
          className={`flex items-center justify-center gap-2 mt-auto py-3 rounded-lg w-full ${currentTheme.buttonBg} font-bold transition-all duration-300`}
        >
          <Palette size={20} />
          {sidebarOpen && <span>Tema</span>}
        </button>
      </aside>

      {/* Conteúdo principal */}
      <div
        className={`flex-1 transition-all duration-500 ${sidebarOpen ? 'ml-64' : 'ml-20'
          } p-10 ${currentTheme.mainText}`}
      >
        <header
          className={`flex justify-between items-center mb-12 rounded-xl p-5 shadow-md ${currentTheme.header}`}
        >
          <h1 className={`text-2xl font-bold ${currentTheme.mainText}`}>Painel MultiOne</h1>
          <Rocket size={28} />
        </header>

        <main>
          <h2 className={`text-4xl font-bold mb-8 ${currentTheme.mainText}`}>Bem-vindo!</h2>
          <p className={`mb-8 ${currentTheme.mainText}`}>
            Explore as opções no menu lateral para navegar pelo painel.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} hover:scale-105 transition-all duration-300`}
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
      </div>

      {/* Seletor de tema */}
      {showThemeSelector && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900/90 backdrop-blur-lg p-8 rounded-2xl border border-gray-700 shadow-2xl z-50 w-80">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            <Palette size={20} />
            Escolha o Tema
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
      )}
    </div>
  );
}