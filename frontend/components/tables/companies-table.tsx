'use client';

import { useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { useCompanies } from '../../hooks/useCompanies';
import { Pencil, Trash2 } from 'lucide-react';

interface CompaniesTableProps {
    onEdit: (company: any) => void;
    onDelete: (company: any) => void;
}

export const CompaniesTable = ({ onEdit, onDelete }: CompaniesTableProps) => {
    const { currentTheme } = useTheme();
    const { companies, fetchCompanies, loading } = useCompanies();

    useEffect(() => {
        fetchCompanies();
    }, []);

    const headers = ['EMPRESA', 'SETOR', 'PLANO', 'STATUS', 'AÇÕES'];

    if (loading) {
        return (
            <div className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg}`}>
                <p className={currentTheme.mainText}>Carregando empresas...</p>
            </div>
        );
    }

    return (
        <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg overflow-hidden`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className={`text-xl md:text-2xl font-semibold ${currentTheme.titleColor}`}>Empresas Cadastradas</h3>
            </div>
            
            <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                {headers.map((h) => (
                                    <th key={h} className={`px-3 md:px-6 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {companies.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">
                                        <p className={`${currentTheme.mainText} opacity-70`}>Nenhuma empresa cadastrada</p>
                                    </td>
                                </tr>
                            ) : (
                                companies.map((company) => (
                                    <tr key={company.id} className={`transition-colors ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                                        <td className={`px-3 md:px-6 py-4 ${currentTheme.mainText}`}>
                                            <div className="font-semibold text-sm md:text-base truncate max-w-[150px] md:max-w-none">
                                                {company.name}
                                            </div>
                                            <div className="text-xs opacity-70 truncate max-w-[150px] md:max-w-none">
                                                {company.domain}
                                            </div>
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                                            <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${currentTheme.name === 'Claro' ? 'bg-blue-500/20 text-blue-600' : 'bg-blue-500/20 text-blue-300'}`}>
                                                {company.industry || 'N/A'}
                                            </span>
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText} whitespace-nowrap`}>
                                            {company.plan?.name || 'Gratuito'}
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText}`}>
                                            <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                                                company.status === 'ACTIVE' 
                                                    ? currentTheme.name === 'Claro' ? 'bg-green-500/20 text-green-600' : 'bg-green-500/20 text-green-300'
                                                    : currentTheme.name === 'Claro' ? 'bg-yellow-500/20 text-yellow-600' : 'bg-yellow-500/20 text-yellow-300'
                                            }`}>
                                                {company.status === 'ACTIVE' ? 'Ativo' : company.status}
                                            </span>
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => onEdit(company)}
                                                    className={`p-2 ${currentTheme.name === 'Claro' ? 'hover:bg-blue-50 text-blue-600' : 'hover:bg-blue-900/20 text-blue-400'} rounded-lg transition-colors`}
                                                    title="Editar"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => onDelete(company)}
                                                    className={`p-2 ${currentTheme.name === 'Claro' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-900/20 text-red-400'} rounded-lg transition-colors`}
                                                    title="Deletar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
