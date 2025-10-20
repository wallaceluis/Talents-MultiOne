"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Building2, Mail, Lock, Key } from 'lucide-react'; 
import "../../styles/globals.css";

export default function AuthPages() {
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPage, setCurrentPage] = useState('login');

  const [isDarkMode, setIsDarkMode] = useState(false); 

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [corporateEmail, setCorporateEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 

  const handleLogin = () => {
    console.log('Tentativa de Login:', { loginEmail, loginPassword });
    
  };

  const handleRegister = () => {
    if (registerPassword !== confirmPassword) {
      console.error("Erro: As senhas não coincidem.");
      return;
    }
    console.log('Tentativa de Cadastro:', { companyName, corporateEmail, registerPassword, confirmPassword });
    
  };

  const AdminAccessBlock = () => (
    <div className={`p-10 rounded-lg shadow-md transition-colors ${
        isDarkMode 
        ? 'bg-green-900/40 border border-green-700/50 shadow-2xl' 
        : 'bg-green-50/70 border border-green-300 shadow-md'
    }`}>
      <div className="flex items-center mb-2">
        <Key className={`w-5 h-5 mr-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`} />
        <h3 className={`text-md font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Acesso Administrador</h3>
      </div>
      <p className={`text-sm mt-2 ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
        <span className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Super Admin:</span> admin@multione.digital / admin123
      </p>
      <p className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
        <span className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>Master:</span> master@multione.digital / master123
      </p>
    </div>
  );

  const themeClasses = {
    screenBg: isDarkMode 
      ? 'bg-gradient-to-br from-black via-slate-900 to-slate-950' 
      : 'bg-gradient-to-br from-gray-100 via-white to-gray-50',

    blurEffect: isDarkMode 
      ? 'bg-blue-900/30' 
      : 'bg-blue-200/50',

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
    separator: isDarkMode ? 'text-slate-600' : 'text-gray-400',
  };


  if (currentPage === 'register') {
    return (
      <div className={`w-screen h-screen ${themeClasses.screenBg} flex items-center justify-center font-['Inter'] transition-colors overflow-x-hidden`}>
        {/* Botão de Alternância de Tema */}
        

        {/* Efeito de fundo sutil (blur) */}
        <div className={`absolute top-0 right-0 w-96 h-96 ${themeClasses.blurEffect} rounded-full blur-3xl opacity-70 animate-pulse-slow transition-colors`}></div>
        
        {/* Contêiner do cartão do formulário (p-4 para margem em mobile) */}
        <div className="w-full max-w-md relative z-10 p-4">
          
          {/* === CARD PRINCIPAL DE CADASTRO === */}
          <div className={`${themeClasses.cardBg} backdrop-blur-md rounded-2xl p-8 transition-all`}>

            
            
            {/* Ícone de logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-400/50">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="9" y1="9" x2="15" y2="9"></line>
                  <line x1="9" y1="13" x2="15" y2="13"></line>
                  <line x1="9" y1="17" x2="15" y2="17"></line>
                </svg>
              </div>
            </div>

            {/* Títulos */}
            <div className="text-center mb-6">
              <h1 className={`text-2xl font-bold mb-2 ${themeClasses.titleText}`}>MultiOne Talents</h1>
              <p className={`text-sm ${themeClasses.subtitleText}`}>Crie sua conta</p>
            </div>

            {/* Indicador de passo (Passo 1/2) */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-semibold shadow-md">
                1
              </div>
              <div className="w-12 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-slate-400' : 'border-gray-300 bg-white text-gray-500'} font-semibold transition-colors`}>
                2
              </div>
            </div>

            {/* Início dos campos do formulário de registro */}
            <div className="space-y-5">
              
              {/* Campo Nome da Empresa */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${themeClasses.labelText}`}>
                  Nome da Empresa <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Building2 className={`w-5 h-5 ${themeClasses.inputIcon}`} />
                  </div>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Nome da sua empresa"
                    className={`w-full border rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm ${themeClasses.inputClasses}`}
                  />
                </div>
              </div>

              {/* Campo Email Corporativo */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${themeClasses.labelText}`}>
                  Email Corporativo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Mail className={`w-5 h-5 ${themeClasses.inputIcon}`} />
                  </div>
                  <input
                    type="email"
                    value={corporateEmail}
                    onChange={(e) => setCorporateEmail(e.target.value)}
                    placeholder="seu@corp.com.br"
                    className={`w-full border rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm ${themeClasses.inputClasses}`}
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${themeClasses.labelText}`}>
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className={`w-5 h-5 ${themeClasses.inputIcon}`} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full border rounded-lg pl-11 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm ${themeClasses.inputClasses}`}
                  />
                  {/* Botão para alternar a visibilidade da senha */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${themeClasses.passwordToggle}`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Campo Confirmar Senha */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${themeClasses.labelText}`}>
                  Confirmar Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Lock className={`w-5 h-5 ${themeClasses.inputIcon}`} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repita sua senha"
                    className={`w-full border rounded-lg pl-11 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm ${themeClasses.inputClasses}`}
                  />
                  {/* Botão para alternar a visibilidade da confirmação de senha */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${themeClasses.passwordToggle}`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botão de Cadastro (Próximo) */}
              <button
                onClick={handleRegister}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 mt-6"
              >
                Próximo
              </button>
            </div>

            {/* Link para mudar para a página de Login */}
            <div className="mt-6 text-center text-sm">
              <span className={`transition-colors ${themeClasses.subtitleText}`}>Já tem uma conta? </span>
              <button 
                onClick={() => setCurrentPage('login')}
                className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                Faça login
              </button>
            </div>
          </div>
          

          {/* Bloco de Credenciais Administrativas */}
          <div className="text-center mt-6">
            
          </div>

          {/* Rodapé informativo */}
          <div className="text-center mt-4">
            <p className={`text-sm ${themeClasses.subtitleText}`}>Plataforma de Atendimento ao Cliente</p>
          </div>
        </div>
      </div>
    );
  }

  
  return (
    <div className={`w-screen h-screen ${themeClasses.screenBg} flex items-center justify-center font-['Inter'] transition-colors overflow-x-hidden`}>
      {/* Botão de Alternância de Tema */}
    

      {/* Efeito de fundo sutil (blur) */}
      <div className={`absolute top-0 right-0 w-96 h-96 ${themeClasses.blurEffect} rounded-full blur-3xl opacity-70 transition-colors`}></div>
      
      {/* Contêiner do cartão do formulário (p-4 para margem em mobile) */}
      <div className="w-full max-w-md relative z-10 p-4">
        
        {/* CARD PRINCIPAL DE LOGIN  */}
        <div className={`${themeClasses.cardBg} backdrop-blur-md rounded-2xl p-8 transition-all`}>
          
          {/* Ícone de logo no login */}
          <div className="flex justify-center mb-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 shadow-md ${
                isDarkMode 
                ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 shadow-slate-950/50' 
                : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 shadow-gray-400/30'
            } transition-colors`}>
              <Building2 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Títulos */}
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold mb-2 ${themeClasses.titleText}`}>MultiOne Talents</h1>
            <p className={`text-sm ${themeClasses.subtitleText}`}>Entre na sua conta </p>
          </div>
          
          {/* Início dos campos do formulário de login */}
          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.labelText}`}>
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail className={`w-5 h-5 ${themeClasses.inputIcon}`} />
                </div>
                {/* Campo de input de Email */}
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seu@email.com"
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
                {/* Campo de input de Senha */}
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full border rounded-lg pl-11 pr-12 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm ${themeClasses.inputClasses}`}
                />
                {/* Botão para alternar a visibilidade da senha */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${themeClasses.passwordToggle}`}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão de Login */}
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 mt-6"
            >
              Entrar
            </button>
          </div>

          {/* Esqueci a senha e Cadastro */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
            <button className="text-blue-600 hover:text-blue-800 transition-colors font-medium">
              Esqueci minha senha
            </button>
            <span className={`hidden sm:inline ${themeClasses.separator}`}>|</span>
            <button 
              onClick={() => setCurrentPage('register')}
              className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
            >
              Não tem uma conta? Cadastre-se
            </button>
          </div>
        </div>
       

        
        <div className="mt-6">
          <AdminAccessBlock />
        </div>

        {/* Rodapé informativo */}
        <div className="text-center mt-4">
          <p className={`text-sm ${themeClasses.subtitleText}`}>Plataforma de Atendimento ao Cliente</p>
        </div>
      </div>
    </div>
  );
}
