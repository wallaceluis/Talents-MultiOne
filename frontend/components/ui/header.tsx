'use client';

import React from 'react';
import { Sun, Moon, User, ChevronDown, LogOut } from 'lucide-react';
import { useTheme } from '../../lib/theme';

export const Header = () => {
    const { currentTheme, toggleTheme } = useTheme();
    const [userMenuOpen, setUserMenuOpen] = React.useState(false);

    return (
        <header className={`sticky top-0 ${currentTheme.sidebar} z-20 border-b ${currentTheme.cardBorder}`}>
            <div className="flex items-center justify-end px-4 md:px-6 h-16">
                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className={`p-2 rounded-full ${currentTheme.name === 'Claro' ? 'hover:bg-gray-100' : 'hover:bg-gray-800/50'}`}
                    >
                        {currentTheme.name === 'Claro' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                    
                    <div className="relative">
                        <button
                            onClick={() => setUserMenuOpen(!userMenuOpen)}
                            className={`flex items-center gap-2 p-2 rounded-lg ${currentTheme.name === 'Claro' ? 'hover:bg-gray-100' : 'hover:bg-gray-800/50'}`}
                        >
                            <User size={22} />
                            <ChevronDown size={16} />
                        </button>
                        {userMenuOpen && (
                             <div className={`absolute right-0 top-12 mt-2 w-56 ${currentTheme.cardBg} border ${currentTheme.cardBorder} rounded-xl shadow-2xl z-50`}>
                                 <div className="p-2">
                                     <div className="px-3 py-2">
                                         <p className={`text-sm font-medium ${currentTheme.titleColor} truncate`}>Nome do Usuário</p>
                                         <p className={`text-xs ${currentTheme.cardText} opacity-70 truncate`}>usuario@email.com</p>
                                     </div>
                                     <div className={`h-px ${currentTheme.name === 'Claro' ? 'bg-gray-200' : 'bg-gray-700/50'} my-1`} />
                                     <button className={`w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg ${currentTheme.name === 'Claro' ? 'hover:bg-gray-100 text-red-600' : 'hover:bg-gray-800 text-red-400'} transition-colors`}>
                                         <LogOut size={18} />
                                         <span className="font-medium text-sm">Sair</span>
                                     </button>
                                 </div>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

