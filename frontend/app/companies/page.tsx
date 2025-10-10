'use client';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/ui/sidebar';
import Header from '../../components/ui/header';
import CompanyForm from '../../components/forms/company-form';
import Table from '../../components/ui/table';
import { getCompanies } from '../../hooks/useCompanies';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);

  const fetchCompanies = async () => {
    const data = await getCompanies();
    setCompanies(Array.isArray(data) ? data : []);
  };

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
