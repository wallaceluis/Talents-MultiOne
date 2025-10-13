'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/ui/sidebar';
import Header from '../../components/ui/header';
import CompanyForm from '../../components/forms/company-form';
import Table from '../../components/ui/table';
import { getCompanies } from '../../hooks/useCompanies';

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
>>>>>>> Stashed changes

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <Header title="Empresas (Tenants)" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CompanyForm onSuccess={fetchCompanies} />
        </div>
        <Table columns={['Nome', 'CNPJ', 'Usuários']} data={companies} />
      </div>
    </div>
  );
}
