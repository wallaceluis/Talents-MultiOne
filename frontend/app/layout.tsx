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
      {/* Remove o bg-white daqui, deixa o ThemeProvider controlar */}
      <body suppressHydrationWarning={true}>
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

  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <div
      className={`h-screen w-screen overflow-hidden ${currentTheme.bg} ${currentTheme.mainText} transition-colors duration-300`}
    >
      {isAuthPage ? (
        <div className="h-full w-full flex items-center justify-center">
          {children}
        </div>
      ) : (
        <div className="flex h-full">
          {/* SIDEBAR */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* CONTEÚDO PRINCIPAL */}
          <div
            className={`flex flex-col flex-1 transition-all duration-300 ${
              sidebarOpen ? "lg:ml-64" : "lg:ml-20"
            } ml-0`}
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
    </div>
  );
};
