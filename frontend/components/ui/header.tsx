'use client';

import React, { useRef, useEffect } from 'react';
import { Sun, Moon, User, ChevronDown, LogOut, Bell } from 'lucide-react';
import { useTheme } from '../../lib/theme';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { currentTheme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: 1, text: 'Nova atualização disponível', time: '5 min atrás', unread: true },
    { id: 2, text: 'Backup concluído com sucesso', time: '1 hora atrás', unread: true },
    { id: 3, text: 'Seu relatório está pronto', time: '2 horas atrás', unread: false },
  ]);

  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const isDarkMode = currentTheme.name !== 'Claro';
  const iconColorClass = isDarkMode ? 'text-white' : 'text-gray-700';
  const textColorClass = isDarkMode ? 'text-white' : 'text-gray-800';
  const menuBgClass = isDarkMode ? 'bg-gray-800' : currentTheme.cardBg;
  const menuBorderClass = currentTheme.cardBorder;

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

  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <header
      className={`sticky top-0 ${currentTheme.sidebar} z-20 ${isDarkMode ? 'border-b-0 shadow-[0_10px_40px_-10px_rgba(2,10,30,0.9)]' : `border-b ${currentTheme.cardBorder}`} backdrop-blur-sm bg-opacity-95`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 h-16">
        <div className="flex items-center gap-3"></div>

        <div className="flex items-center gap-2">
          {/* Notificações */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className={`relative p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
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
                        className={`p-3 rounded-lg ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                          } cursor-pointer transition-colors ${notif.unread ? 'border-l-2 border-blue-500' : ''
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
              className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100'
                } ${iconColorClass} transition-colors`}
            >
              <User size={20} className={iconColorClass} />
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
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${textColorClass} truncate`}>
                          {user?.name || 'Usuário'}
                        </p>
                        <p className={`text-xs ${iconColorClass} opacity-70 truncate`}>
                          {user?.email || 'usuario@email.com'}
                        </p>
                      </div>
                    </div>
                    {user?.role && (
                      <div className="mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-800'
                          }`}>
                          {user.role === 'SUPER_ADMIN' ? 'Super Admin' :
                            user.role === 'MASTER' ? 'Master' :
                              user.role === 'ADMIN' ? 'Admin' : user.role}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={`h-px ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-200'} my-1`} />

                  {/* Alternar tema */}
                  <button
                    onClick={toggleTheme}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg ${isDarkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
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
                    onClick={handleLogout}
                    className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg ${isDarkMode
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
