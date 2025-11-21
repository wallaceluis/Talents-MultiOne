'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { CompaniesTable } from '../../components/tables/companies-table';
import { CompanyModal } from '../../components/modals/CompanyModal';
import { DeleteModal } from '../../components/modals/DeleteModal';
import { useCompanies } from '../../hooks/useCompanies';
import { useAuth } from '../../hooks/useAuth';
import { Search, ListChecks, Users, Briefcase, X } from 'lucide-react';

export default function CompaniesPage() {
    const { currentTheme } = useTheme();
    const { user } = useAuth();
    const { stats, fetchStats, createCompany, updateCompany, deleteCompany } = useCompanies();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (fetchStats) fetchStats();
    }, []);

    const statusCardsData = [
        { title: 'Total', value: String(stats?.total || 0), icon: ListChecks, color: 'text-blue-500' },
        { title: 'Ativo', value: String(stats?.active || 0), icon: Users, color: 'text-green-500' },
        { title: 'Trial', value: String(stats?.trial || 0), icon: Briefcase, color: 'text-yellow-500' },
        { title: 'Inativo', value: String(stats?.inactive || 0), icon: X, color: 'text-blue-500' },
    ];

    const handleCreate = () => {
        setSelectedCompany(null);
        setModalMode('create');
        setIsModalOpen(true);
    };

    const handleEdit = (company: any) => {
        setSelectedCompany(company);
        setModalMode('edit');
        setIsModalOpen(true);
    };

    const handleDeleteClick = (company: any) => {
        setSelectedCompany(company);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (data: any) => {
        if (modalMode === 'create') {
            await createCompany(data);
            await fetchStats();
        } else {
            await updateCompany(selectedCompany.id, data);
            await fetchStats();
        }
    };

    const handleDeleteConfirm = async () => {
        setDeleteLoading(true);
        try {
            await deleteCompany(selectedCompany.id);
            await fetchStats();
            setIsDeleteModalOpen(false);
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <main className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={`text-2xl md:text-4xl font-bold ${currentTheme.mainText}`}>Gerenciamento de Empresas</h1>
                    <p className={`mt-2 text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
                        Empresas cadastradas na plataforma
                    </p>
                </div>
                {user?.role !== 'VIEWER' && (
                    <button
                        onClick={handleCreate}
                        className={`w-full md:w-auto px-5 py-3 rounded-lg ${currentTheme.buttonBg} font-medium whitespace-nowrap`}
                    >
                        + Cadastrar Empresa
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar empresas..."
                        className={`w-full p-3 pl-12 pr-4 rounded-xl border ${currentTheme.name === 'Claro' ? 'border-gray-300 bg-white text-gray-900' : 'bg-gray-800/50 border-gray-700/50 text-white'} placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {statusCardsData.map((data, i) => (
                    <MetricCard key={`status-${i}`} {...data} />
                ))}
            </div>

            <CompaniesTable onEdit={handleEdit} onDelete={handleDeleteClick} isReadOnly={user?.role === 'VIEWER'} />

            <CompanyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSubmit}
                company={selectedCompany}
                mode={modalMode}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Deletar Empresa"
                description="Tem certeza que deseja deletar esta empresa? Esta ação não pode ser desfeita."
                itemName={selectedCompany?.name}
                loading={deleteLoading}
            />
        </main>
    );
}
