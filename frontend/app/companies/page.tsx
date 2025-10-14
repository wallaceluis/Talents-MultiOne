import React, { useState } from 'react';
import { Rocket } from 'lucide-react';

<<<<<<< HEAD
<<<<<<< Updated upstream
export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);

  const fetchCompanies = async () => {
    const data = await getCompanies();
    setCompanies(Array.isArray(data) ? data : []);
  };
=======
type ThemeKey = 'original'  | 'whiteblue';

const themes: Record<ThemeKey, any> = {
  original: { /* ... */ },

=======
type ThemeKey = 'original' | 'purple' | 'dark' | 'whiteblue';

const themes: Record<ThemeKey, any> = {
  original: { /* ... */ },
  purple: { /* ... */ },
  dark: { /* ... */ },
>>>>>>> 761e983e54a6abff8633245392de60498ac4e7d9
  whiteblue: {
    name: 'Branco → Azul #0a1a40',
    bg: 'bg-white',
    header: 'bg-white/95 backdrop-blur-md border-b border-blue-900 text-[#0a1a40]',
    sidebar: 'bg-white/95 border-r border-blue-900 text-[#0a1a40]',
    cardBg: 'bg-gradient-to-br from-[#0a1a40] via-[#243b6b] to-[#3b82f6]',
    cardBorder: 'border-blue-900/80 hover:border-blue-700',
    iconColor: 'text-white',
    titleColor: 'text-white',
    cardText: 'text-white',
    mainText: 'text-[#0a1a40]',
    buttonBg: 'bg-white hover:bg-blue-100 text-[#0a1a40]',
  },
};
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> 761e983e54a6abff8633245392de60498ac4e7d9

const menuItems = [
  { href: '#', icon: Rocket, title: 'Dashboard', desc: 'Visão geral do sistema' },
  // ...outros itens...
];

export default function HomePage() {
  const [theme] = useState<ThemeKey>('whiteblue');
  const currentTheme = themes[theme];

  return (
    <div>
      {/* ...seu código... */}
    </div>
  );
}