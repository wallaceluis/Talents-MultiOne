'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { menuItems } from '../../lib/data';
import { useTheme } from '../../lib/theme';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
    const { currentTheme } = useTheme();
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <>
            {/* Botão fixo para abrir a sidebar no mobile */}
            {isMobile && !sidebarOpen && (
                <button
                    onClick={toggleSidebar}
                    className={`fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white shadow-lg hover:bg-gray-700 transition-all duration-200`}
                >
                    <Menu size={24} />
                </button>
            )}

            {/* Fundo escuro quando o menu estiver aberto no mobile */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Barra lateral */}
            <aside
                className={`${currentTheme.sidebar} fixed top-0 left-0 h-full p-4 flex flex-col justify-between transition-all duration-300 z-50
                ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:translate-x-0 lg:w-20'}`}
            >
                <div>
                    <div className={`flex items-center mb-8 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
                        <div className="flex items-center">
                            {sidebarOpen && (
                                <span className={`ml-2 text-xl font-bold ${currentTheme.titleColor}`}>
                                    MultiOne
                                </span>
                            )}
                        </div>

                        {/* Botão fecha no mobile ou alterna no desktop */}
                        <button
                            onClick={toggleSidebar}
                            className={`${currentTheme.mainText} ${isMobile || sidebarOpen ? '' : 'hidden lg:block'}`}
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>

                    {/* Links do menu */}
                    <nav className="space-y-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.page}
                                    href={item.href}
                                    onClick={() => {
                                        if (isMobile) setSidebarOpen(false);
                                    }}
                                    className={`w-full group flex items-center gap-3 ${currentTheme.mainText}
                                        ${isActive ? currentTheme.sidebarActive : currentTheme.sidebarHover} 
                                        rounded-xl px-3 py-3 transition-all duration-300 ${sidebarOpen ? '' : 'justify-center'}`}
                                >
                                    <Icon
                                        className={`${isActive ? 'text-blue-600' : currentTheme.iconColor} flex-shrink-0`}
                                        size={22}
                                    />
                                    {sidebarOpen && (
                                        <span className="text-sm font-medium">{item.title}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>
        </>
    );
};
