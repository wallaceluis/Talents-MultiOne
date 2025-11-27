"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Building2, Mail, Lock, Key } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import "../../styles/globals.css";

export default function AuthPages() {
  const { login, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Estados do formulário
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await login(loginEmail, loginPassword);

    if (!result.success) {
      setError(result.error || 'Erro ao fazer login');
    }
  };

  const themeClasses = {
    screenBg: isDarkMode
      ? 'bg-gradient-to-br from-black via-slate-900 to-slate-950'
      : 'bg-gradient-to-br from-gray-100 via-white to-gray-50',
    blurEffect: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-200/50',
    cardBg: isDarkMode
      ? 'bg-slate-900/90 shadow-2xl shadow-slate-950/70 border border-slate-800/50'
      : 'bg-white/95 shadow-xl shadow-gray-300/50 border border-gray-200',
    titleText: isDarkMode ? 'text-white' : 'text-gray-900',
    subtitleText: isDarkMode ? 'text-slate-400' : 'text-gray-500',
    labelText: isDarkMode ? 'text-slate-300' : 'text-gray-700',
    inputClasses: isDarkMode
      ? 'bg-slate-800/50 border-slate-700 text-white placeholder-slate-500'
      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400',
    inputIcon: isDarkMode ? 'text-slate-500' : 'text-gray-400',
    passwordToggle: isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-gray-400 hover:text-gray-600',
  };

  return (
    <div className={`w-screen h-screen ${themeClasses.screenBg} flex items-center justify-center font-['Inter'] transition-colors overflow-x-hidden`}>
      <div className={`absolute top-0 right-0 w-96 h-96 ${themeClasses.blurEffect} rounded-full blur-3xl opacity-70 transition-colors`}></div>

      <div className="w-full max-w-md relative z-10 p-4">
        <div className={`${themeClasses.cardBg} backdrop-blur-md rounded-2xl p-8 transition-all`}>

          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-md ${isDarkMode
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-slate-950/50'
                : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 shadow-gray-400/30'
              } transition-colors`}>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold mb-2 ${themeClasses.titleText}`}>MultiOne Talents</h1>
            <p className={`text-sm ${themeClasses.subtitleText}`}>Entre na sua conta</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.labelText}`}>
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className={`w-5 h-5 ${themeClasses.inputIcon}`} />
                </div>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className={`w-full border rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm ${themeClasses.inputClasses}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.labelText}`}>
                Senha
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock className={`w-5 h-5 ${themeClasses.inputIcon}`} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className={`w-full border rounded-lg pl-11 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm ${themeClasses.inputClasses}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${themeClasses.passwordToggle}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-green-50/70 border border-green-300 shadow-md">
          <div className="flex items-center mb-2">
            <Key className="w-5 h-5 mr-2 text-green-700" />
            <h3 className="text-md font-semibold text-green-700">Acesso Administrador</h3>
          </div>
          <p className="text-sm mt-2 text-green-600">
            <span className="font-bold text-green-700">Email:</span> admin@multione.digital
          </p>
          <p className="text-sm text-green-600">
            <span className="font-bold text-green-700">Senha:</span> Admin@123
          </p>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">Plataforma de Atendimento ao Cliente</p>
        </div>
      </div>
    </div>
  );
}
