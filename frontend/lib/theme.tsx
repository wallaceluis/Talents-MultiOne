'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';


export interface ThemeStyle {
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

  // NOVAS PROPRIEDADES PARA O PROBLEMA DA TABELA E BUSCA
  searchBg: string;
  tableContainerBg: string;
  tableHeadBg: string;
  tableRowHover: string;
  tableRowText: string;
}

export type Themes = Record<string, ThemeStyle>;


export const themes: Themes = {
  original: {
    name: 'Escuro',
    bg: 'bg-gradient-to-br from-black via-slate-900 to-slate-950',
    sidebar: 'bg-gray-900/95 backdrop-blur-sm border-r border-blue-900/30',
    sidebarHover: 'hover:bg-slate-800/40',
    sidebarActive: 'bg-blue-600/70',
    cardBg: 'bg-gray-800/70',
    cardBorder: 'border-blue-700/30 hover:border-blue-600',
    iconColor: 'text-black-400',
    titleColor: 'text-white',
    cardText: 'text-gray-300',
    mainText: 'text-white',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',

    // Configurações para o modo ESCURO
    searchBg: 'bg-gray-900 border border-gray-700',
    tableContainerBg: 'bg-gray-800 rounded-lg shadow overflow-hidden',
    tableHeadBg: 'bg-gray-900',
    tableRowHover: 'hover:bg-gray-700',
    tableRowText: 'text-gray-300',
  },
  whiteblue: {
    name: 'Claro',
    bg: 'bg-white',
    sidebar: 'bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl',
    sidebarHover: 'hover:bg-blue-50/50',
    sidebarActive: 'bg-blue-50 text-blue-800',
    cardBg: 'bg-white shadow-lg',
    cardBorder: 'border-gray-100 hover:border-blue-300',
    iconColor: 'text-black-500',
    titleColor: 'text-gray-900',
    cardText: 'text-gray-700',
    mainText: 'text-gray-900',
    buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white',

    // Configurações para o modo CLARO
    searchBg: 'bg-white border border-gray-400 shadow-sm',
    tableContainerBg: 'bg-white rounded-lg shadow overflow-hidden border border-gray-200',
    tableHeadBg: 'bg-gray-50',
    tableRowHover: 'hover:bg-gray-100',
    tableRowText: 'text-gray-700',
  },
};


interface ThemeContextType {
  theme: keyof Themes;
  currentTheme: ThemeStyle;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<keyof Themes>('whiteblue');

  // Efeito para adicionar/remover a classe 'dark' no elemento HTML
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'original') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'whiteblue' ? 'original' : 'whiteblue'));
  };

  const currentTheme = themes[theme];
  const value = { theme, currentTheme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};


export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};