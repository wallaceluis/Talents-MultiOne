import "../styles/globals.css";
import Sidebar from "../components/ui/sidebar";
import Header from "../components/ui/header";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header title="Dashboard" />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
