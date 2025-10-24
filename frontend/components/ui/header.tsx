'use client';

import React, { useRef, useEffect } from 'react';
import { Sun, Moon, User, ChevronDown, LogOut, Bell } from 'lucide-react';
import { useTheme } from '../../lib/theme';

// Componente Header com menus de usuário e notificações
export const Header = () => {
  const { currentTheme, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: 1, text: 'Nova atualização disponível', time: '5 min atrás', unread: true },
    { id: 2, text: 'Backup concluído com sucesso', time: '1 hora atrás', unread: true },
    { id: 3, text: 'Seu relatório está pronto', time: '2 horas atrás', unread: false },
  ]);

  // Referências para detectar cliques fora dos menus
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  
  // Determinar classes baseadas no tema
  const isDarkMode = currentTheme.name !== 'Claro';
  const iconColorClass = isDarkMode ? 'text-white' : 'text-gray-700';
  const textColorClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const menuBgClass = isDarkMode ? 'bg-gray-800' : currentTheme.cardBg;
  const menuBorderClass = currentTheme.cardBorder;

  // Fechar menus ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Marcar notificação como lida
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  // Contar notificações não lidas
  const unreadCount = notifications.filter(n => n.unread).length;



  return (
    <header
      className={`sticky top-0 ${currentTheme.sidebar} z-20 border-b ${currentTheme.cardBorder} backdrop-blur-sm bg-opacity-95`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        {/* Logo/Título */}
        <div className="flex items-center gap-3"></div>

        {/* Ações da direita */}
        <div className="flex items-center gap-2">

          {/* Notificações */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`relative p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
              } ${iconColorClass} transition-colors`}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {notificationsOpen && (
              <div
                className={`absolute right-0 top-12 mt-2 w-80 ${menuBgClass} border ${menuBorderClass} rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`font-semibold ${textColorClass}`}>Notificações</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full">
                        {unreadCount} novas
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-3 rounded-lg ${
                          isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                        } cursor-pointer transition-colors ${
                          notif.unread ? 'border-l-2 border-blue-500' : ''
                        }`}
                      >
                        <p className={`text-sm ${textColorClass} ${notif.unread ? 'font-medium' : ''}`}>
                          {notif.text}
                        </p>
                        <p className={`text-xs ${iconColorClass} opacity-60 mt-1`}>
                          {notif.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Menu do usuário */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className={`flex items-center gap-2 p-2 rounded-lg ${
                isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
              } ${iconColorClass} transition-colors`}
            >
              <User size={22} className={iconColorClass} />
              <ChevronDown size={16} className={`hidden md:block transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {userMenuOpen && (
              <div
                className={`absolute right-0 top-12 mt-2 w-64 ${menuBgClass} border ${menuBorderClass} rounded-xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200`}
              >
                <div className="p-2">
                  {/* Informações do usuário */}
                  <div className="px-3 py-3 mb-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User size={20} className={iconColorClass} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${textColorClass} truncate`}>
                          Nome do Usuário
                        </p>
                        <p className={`text-xs ${iconColorClass} opacity-70 truncate`}>
                          usuario@email.com
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`h-px ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'} my-1`} />

                  

                  {/* Alternar tema */}
                  <button
                    onClick={toggleTheme}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                      isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                    } transition-colors`}
                  >
                    {isDarkMode ? (
                      <Sun size={18} className={iconColorClass} />
                    ) : (
                      <Moon size={18} className={iconColorClass} />
                    )}
                    <span className={`text-sm ${textColorClass}`}>
                      {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
                    </span>
                  </button>

                  <div className={`h-px ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'} my-1`} />

                  {/* Botão de sair */}
                  <button
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg ${
                      isDarkMode
                        ? 'hover:bg-red-900/20 text-red-400'
                        : 'hover:bg-red-50 text-red-600'
                    } transition-colors`}
                  >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Sair</span>
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