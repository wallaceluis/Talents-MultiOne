'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '../../lib/theme';
import { useCompanies } from '../../hooks/useCompanies';
import { Edit2, Trash2, Loader2, RefreshCw } from 'lucide-react';

interface CompaniesTableProps {
    onEdit: (company: any) => void;
    onDelete: (company: any) => void;
    isReadOnly?: boolean;
}

export const CompaniesTable = ({ onEdit, onDelete, isReadOnly = false }: CompaniesTableProps) => {
    const { currentTheme } = useTheme();
    const { companies, loading, error, fetchCompanies } = useCompanies();

    // Atualizar quando o componente montar
    useEffect(() => {
        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} flex items-center justify-center min-h-[200px]`}>
                <Loader2 className="animate-spin mr-2" size={24} />
                <span className={currentTheme.mainText}>Carregando empresas...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg}`}>
                <p className="text-red-500 mb-3">❌ {error}</p>
                <button
                    onClick={fetchCompanies}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
                >
                    <RefreshCw size={16} />
                    Tentar novamente
                </button>
            </div>
        );
    }

    return (
        <div className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg`}>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className={`text-lg sm:text-xl md:text-2xl font-semibold ${currentTheme.titleColor}`}>
                    Empresas Cadastradas ({companies.length})
                </h3>
                <button
                    onClick={fetchCompanies}
                    className={`w-full sm:w-auto px-4 py-2 rounded-lg ${currentTheme.buttonBg} font-medium text-sm whitespace-nowrap flex items-center justify-center gap-2`}
                >
                    <RefreshCw size={16} />
                    Atualizar
                </button>
            </div>

            {companies.length === 0 ? (
                <div className="text-center py-12">
                    <p className={`${currentTheme.cardText} text-lg mb-2`}>Nenhuma empresa cadastrada ainda.</p>
                    <p className={`${currentTheme.cardText} text-sm opacity-60`}>
                        Clique em &quot;+ Cadastrar Empresa&quot; para começar
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile View */}
                    <div className="block md:hidden space-y-3">
                        {companies.map((company) => (
                            <div
                                key={company.id}
                                className={`p-3 rounded-lg border ${currentTheme.cardBorder} ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                                    } transition-colors`}
                            >
                                <div className="mb-2">
                                    <div className={`font-semibold text-sm ${currentTheme.mainText} mb-1`}>
                                        {company.name}
                                    </div>
                                    <div className={`text-xs ${currentTheme.cardText} opacity-70`}>
                                        {company.domain}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    <span className={`text-xs ${currentTheme.cardText}`}>
                                        {company.plan?.name || 'Sem plano'}
                                    </span>
                                    <span
                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${company.status === 'ACTIVE'
                                            ? currentTheme.name === 'Claro'
                                                ? 'bg-green-500/20 text-green-600'
                                                : 'bg-green-500/20 text-green-300'
                                            : currentTheme.name === 'Claro'
                                                ? 'bg-yellow-500/20 text-yellow-600'
                                                : 'bg-yellow-500/20 text-yellow-300'
                                            }`}
                                    >
                                        {company.status === 'ACTIVE' ? 'Ativo' : company.status === 'TRIAL' ? 'Trial' : 'Inativo'}
                                    </span>
                                </div>

                                {!isReadOnly && (
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(company)}
                                            className={`p-1.5 rounded ${currentTheme.name === 'Claro'
                                                ? 'hover:bg-blue-100 text-blue-600'
                                                : 'hover:bg-blue-500/20 text-blue-400'
                                                } transition-colors`}
                                            aria-label="Editar"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(company)}
                                            className={`p-1.5 rounded ${currentTheme.name === 'Claro'
                                                ? 'hover:bg-red-100 text-red-600'
                                                : 'hover:bg-red-500/20 text-red-400'
                                                } transition-colors`}
                                            aria-label="Deletar"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    {['EMPRESA', 'DOMÍNIO', 'PLANO', 'STATUS', ...(isReadOnly ? [] : ['AÇÕES'])].map((h) => (
                                        <th
                                            key={h}
                                            className={`px-4 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/30">
                                {companies.map((company) => (
                                    <tr
                                        key={company.id}
                                        className={`transition-colors ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                                            }`}
                                    >
                                        <td className={`px-4 py-4 ${currentTheme.mainText}`}>
                                            <div className="font-semibold text-sm">{company.name}</div>
                                        </td>

                                        <td className={`px-4 py-4 text-sm ${currentTheme.cardText}`}>
                                            {company.domain}
                                        </td>

                                        <td className={`px-4 py-4 text-sm ${currentTheme.cardText}`}>
                                            {company.plan?.name || 'Sem plano'}
                                        </td>

                                        <td className="px-4 py-4">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${company.status === 'ACTIVE'
                                                    ? currentTheme.name === 'Claro'
                                                        ? 'bg-green-500/20 text-green-600'
                                                        : 'bg-green-500/20 text-green-300'
                                                    : company.status === 'TRIAL'
                                                        ? currentTheme.name === 'Claro'
                                                            ? 'bg-yellow-500/20 text-yellow-600'
                                                            : 'bg-yellow-500/20 text-yellow-300'
                                                        : currentTheme.name === 'Claro'
                                                            ? 'bg-red-500/20 text-red-600'
                                                            : 'bg-red-500/20 text-red-300'
                                                    }`}
                                            >
                                                {company.status === 'ACTIVE' ? 'Ativo' : company.status === 'TRIAL' ? 'Trial' : 'Inativo'}
                                            </span>
                                        </td>

                                        {!isReadOnly && (
                                            <td className="px-4 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => onEdit(company)}
                                                        className={`p-2 rounded ${currentTheme.name === 'Claro'
                                                            ? 'hover:bg-blue-100 text-blue-600'
                                                            : 'hover:bg-blue-500/20 text-blue-400'
                                                            } transition-colors`}
                                                        aria-label="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(company)}
                                                        className={`p-2 rounded ${currentTheme.name === 'Claro'
                                                            ? 'hover:bg-red-100 text-red-600'
                                                            : 'hover:bg-red-500/20 text-red-400'
                                                            } transition-colors`}
                                                        aria-label="Deletar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};
