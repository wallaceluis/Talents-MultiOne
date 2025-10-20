'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

// -----------------------------
// 1. Tipos
// -----------------------------
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
}

export type Themes = Record<string, ThemeStyle>;

// -----------------------------
// 2. Dados de Tema
// -----------------------------
export const themes: Themes = {
  original: {
    name: 'Escuro',
    bg: 'bg-gradient-to-br from-black via-slate-900 to-slate-950',
    sidebar: 'bg-gray-900/95 backdrop-blur-sm border-r border-blue-900/30',
    sidebarActive: 'bg-blue-600/70',
    cardBg: 'bg-gray-800/70',
    cardBorder: 'border-blue-700/30 hover:border-blue-600',
    iconColor: 'text-blue-400',
    titleColor: 'text-white',
    cardText: 'text-gray-300',
    mainText: 'text-white',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
    sidebarHover: 'hover:bg-slate-800/40',
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

// -----------------------------
// 3. Contexto
// -----------------------------
interface ThemeContextType {
  theme: keyof Themes;
  currentTheme: ThemeStyle;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// -----------------------------
// 4. Provider
// -----------------------------
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<keyof Themes>('whiteblue');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'whiteblue' ? 'original' : 'whiteblue'));
  };

  const currentTheme = themes[theme];
  const value = { theme, currentTheme, toggleTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// -----------------------------
// 5. Hook customizado
// -----------------------------
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};