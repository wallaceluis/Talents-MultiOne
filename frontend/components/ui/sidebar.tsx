import React from 'react';
import { LayoutDashboard, Building2, Users, UserCircle, FileText, Rocket } from 'lucide-react';

export default function HomePage() {
  const menuItems = [
    { 
      href: "/dashboard", 
      icon: LayoutDashboard, 
      title: "Dashboard", 
      desc: "Visão geral do sistema" 
    },
    { 
      href: "/companies", 
      icon: Building2, 
      title: "Empresas", 
      desc: "Gerencie empresas cadastradas" 
    },
    { 
      href: "/candidates", 
      icon: UserCircle, 
      title: "Candidatos", 
      desc: "Gerencie candidatos" 
    },
    { 
      href: "/users", 
      icon: Users, 
      title: "Usuários", 
      desc: "Controle de acesso" 
    },
    { 
      href: "/plans", 
      icon: FileText, 
      title: "Planos", 
      desc: "Gerenciamento de planos" 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-4">
            Painel Talents MultiOne
          </h1>
          <p className="text-gray-400 text-lg">
            Sistema completo de gerenciamento de talentos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={i}
                href={item.href}
                className="group relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  <div className="text-blue-400 mb-4 group-hover:text-blue-300 transition-colors group-hover:scale-110 transform duration-300">
                    <Icon size={48} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {item.desc}
                  </p>
                </div>
              </a>
            );
          })}
        </div>

        <div className="text-center">
          <a
            href="/admin"
            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105"
          >
            <Rocket size={24} />
            <span>Ir para Painel Administrativo</span>
          </a>
        </div>
      </main>
    </div>
  );
}
