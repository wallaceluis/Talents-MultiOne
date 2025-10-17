import "../styles/globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen bg-gray-100">
        <div className="flex-1 flex flex-col">
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
