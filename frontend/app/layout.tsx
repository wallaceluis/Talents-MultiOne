import "../styles/globals.css";
<<<<<<< HEAD


=======
>>>>>>> 761e983e54a6abff8633245392de60498ac4e7d9
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
<<<<<<< HEAD
      <body className="flex min-h-screen bg-gray-100">
       
        <div className="flex-1 flex flex-col">
          
          <main className="p-6">{children}</main>
        </div>
=======
      <body className="min-h-screen transition-colors duration-500">
        {children}
>>>>>>> 761e983e54a6abff8633245392de60498ac4e7d9
      </body>
    </html>
  );
}
