
// app/dashboard/layout.tsx
'use client';

import { ThemeProvider } from '../../lib/theme'; // ajuste o caminho

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
