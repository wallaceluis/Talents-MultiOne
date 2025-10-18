'use client';

import React, { createContext, useContext, useState } from 'react';
import { UserCircle, Shield } from 'lucide-react';

// 1. DEPENDÊNCIAS CONSOLIDADAS (TIPOS, DADOS E CONTEXTO)

// --- Interfaces ---
interface ThemeStyle {
    name: string; bg: string; sidebar: string; sidebarActive: string; cardBg: string;
    cardBorder: string; iconColor: string; titleColor: string; cardText: string;
    mainText: string; buttonBg: string; sidebarHover: string;
}
type Themes = { [key: string]: ThemeStyle };
interface UserData { name: string; email: string; role: 'Admin' | 'Collaborator'; avatar: string; }

// --- Dados ---
const themes: Themes = {
    original: { name: 'Escuro', bg: 'bg-gradient-to-br from-black via-slate-900 to-black', sidebar: 'bg-gray-900/95 backdrop-blur-sm border-r border-blue-900/30', sidebarActive: 'bg-blue-600/70', cardBg: 'bg-gray-800/70', cardBorder: 'border-blue-700/30 hover:border-blue-600', iconColor: 'text-blue-400', titleColor: 'text-white', cardText: 'text-gray-300', mainText: 'text-white', buttonBg: 'bg-blue-600 hover:bg-blue-700', sidebarHover: 'hover:bg-slate-800/40' },
    whiteblue: { name: 'Claro', bg: 'bg-white', sidebar: 'bg-white/95 backdrop-blur-sm border-r border-gray-200 shadow-xl', sidebarHover: 'hover:bg-blue-50/50', sidebarActive: 'bg-blue-50 text-blue-800', cardBg: 'bg-white shadow-lg', cardBorder: 'border-gray-100 hover:border-blue-300', iconColor: 'text-blue-500', titleColor: 'text-gray-900', cardText: 'text-gray-700', mainText: 'text-gray-900', buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white' },
};

const usersData: UserData[] = [
    { name: 'Admin', email: 'admin@multione.com', role: 'Admin', avatar: 'https://i.pravatar.cc/150?u=admin' },
    { name: 'Colaborador', email: 'colab@multione.com', role: 'Collaborator', avatar: 'https://i.pravatar.cc/150?u=collab' },
];

// --- Contexto do Tema ---
interface ThemeContextType {
    theme: keyof Themes;
    currentTheme: ThemeStyle;
    toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType | null>(null);
const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
    }
    return context;
};

// 2. COMPONENTES DA PÁGINA

const UsersTable: React.FC = () => {
    const { currentTheme } = useTheme();
    return (
        <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg overflow-hidden`}>
            <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                {['USUÁRIO', 'PERMISSÃO', 'AÇÕES'].map((header) => (
                                    <th key={header} className={`px-3 md:px-6 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {usersData.map((user, i) => (
                                <tr key={i} className={`transition-colors ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
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
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${user.role === 'Admin' ? (currentTheme.name === 'Claro' ? 'bg-green-100 text-green-800' : 'bg-green-900/50 text-green-300') : (currentTheme.name === 'Claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/50 text-blue-300')}`}>
                                            <Shield size={14} />{user.role}
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
};

const UsersPageContent: React.FC = () => {
    const { currentTheme } = useTheme();

    return (
        <main className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={`text-2xl md:text-4xl font-bold ${currentTheme.mainText}`}>Gerenciamento de Usuários</h1>
                    <p className={`mt-2 text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
                        Adicione, edite ou remova usuários da plataforma
                    </p>
                </div>
                <button className={`w-full md:w-auto px-5 py-3 rounded-lg ${currentTheme.buttonBg} font-medium whitespace-nowrap flex items-center justify-center gap-2`}>
                    <UserCircle size={20} />
                    Criar Novo Usuário
                </button>
            </div>
            <UsersTable />
        </main>
    );
}


// 3. COMPONENTE PRINCIPAL COM PROVIDER

export default function UsersPage() {
    // Este estado é um placeholder. Em uma app real, ele viria de um layout pai.
    const [theme, setTheme] = useState<keyof Themes>('whiteblue');
    const toggleTheme = () => {
        setTheme(prev => (prev === 'whiteblue' ? 'original' : 'whiteblue'));
    };
    const currentTheme = themes[theme];
    const contextValue = { theme, currentTheme, toggleTheme };

    return (
        <ThemeContext.Provider value={contextValue}>
            <UsersPageContent />
        </ThemeContext.Provider>
    );
}

