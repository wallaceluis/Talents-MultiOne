'use client';

import "../styles/globals.css";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider, useTheme } from "../lib/theme";
import { Sidebar } from "../components/ui/sidebar";
import { Header } from "../components/ui/header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}

// Componente interno para consumir ThemeProvider
const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Verifica se está na página de autenticação
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <html lang="pt-BR">
      <body className={`h-screen w-screen overflow-hidden ${currentTheme.bg}`}>
        {isAuthPage ? (
          // Layout simples para páginas de autenticação
          <div className="h-full w-full">
            {children}
          </div>
        ) : (
          // Layout completo com sidebar e header para outras páginas
          <div className="flex h-full">
            {/* SIDEBAR */}
            <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            {/* CONTEÚDO PRINCIPAL */}
            <div
              className={`flex flex-col flex-1 transition-all duration-300
                ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}
            >
              {/* HEADER FIXO */}
              <Header />

              {/* CONTEÚDO SCROLLÁVEL */}
              <main
                className={`flex-1 overflow-y-auto p-4 md:p-6 ${currentTheme.bg} ${currentTheme.mainText}`}
              >
                {children}
              </main>
            </div>
          </div>
        )}
      </body>
    </html>
  );
};