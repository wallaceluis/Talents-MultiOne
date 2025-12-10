'use client';

import { useTheme } from '../../lib/theme';
import { Edit2, Trash2 } from 'lucide-react';
import { Candidate } from '../../types/candidate';

interface CandidatesTableProps {
    candidates: Candidate[];
    onEdit: (candidate: Candidate) => void;
    onDelete: (candidate: Candidate) => void;
    isReadOnly?: boolean;
}

export const CandidatesTable = ({ candidates, onEdit, onDelete, isReadOnly = false }: CandidatesTableProps) => {
    const { currentTheme } = useTheme();

    return (
        <div className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg`}>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className={`text-lg sm:text-xl md:text-2xl font-semibold ${currentTheme.titleColor}`}>
                    Candidatos Cadastrados
                </h3>
            </div>

            {candidates.length === 0 ? (
                <div className="text-center py-12">
                    <p className={`${currentTheme.cardText} text-lg mb-2`}>Nenhum candidato cadastrado ainda.</p>
                </div>
            ) : (
                <>
                    {/* Mobile View */}
                    <div className="block md:hidden space-y-3">
                        {candidates.map((candidate) => (
                            <div
                                key={candidate.id}
                                className={`p-3 rounded-lg border ${currentTheme.cardBorder} ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'} transition-colors`}
                            >
                                <div className="mb-2">
                                    <div className={`font-semibold text-sm ${currentTheme.mainText} mb-1`}>
                                        {candidate.name}
                                    </div>
                                    <div className={`text-xs ${currentTheme.cardText} opacity-70`}>
                                        {candidate.email}
                                    </div>
                                </div>


                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${candidate.status === 'ACTIVE'
                                                ? currentTheme.name === 'Claro'
                                                    ? 'bg-green-500/20 text-green-600'
                                                    : 'bg-blue-500/20 text-blue-300'
                                                : 'bg-gray-500/20 text-gray-500'
                                                }`}
                                        >
                                            {candidate.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </div>


                                    {!isReadOnly && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onEdit(candidate)}
                                                className={`p-1.5 rounded ${currentTheme.name === 'Claro'
                                                    ? 'hover:bg-blue-100 text-blue-600'
                                                    : 'hover:bg-blue-500/20 text-blue-400'
                                                    } transition-colors`}
                                                aria-label="Editar"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => onDelete(candidate)}
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
                            </div>
                        ))}
                    </div>


                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className={`px-4 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                        NOME
                                    </th>
                                    <th className={`px-4 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                        EMAIL
                                    </th>
                                    <th className={`px-4 py-3 text-center text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                        STATUS
                                    </th>
                                    {!isReadOnly && (
                                        <th className={`px-4 py-3 text-center text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                            AÇÕES
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/30">
                                {candidates.map((candidate) => (
                                    <tr
                                        key={candidate.id}
                                        className={`transition-colors ${currentTheme.name === 'Claro'
                                            ? 'hover:bg-gray-50'
                                            : 'hover:bg-white/5'
                                            }`}
                                    >

                                        <td className={`px-4 py-4 ${currentTheme.mainText} text-left`}>
                                            <div className="font-semibold text-sm">
                                                {candidate.name}
                                            </div>
                                        </td>

                                        <td className={`px-4 py-4 ${currentTheme.cardText} text-left`}>
                                            <div className="text-sm">
                                                {candidate.email}
                                            </div>
                                        </td>


                                        <td className="px-4 py-4 text-center">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${candidate.status === 'ACTIVE'
                                                    ? currentTheme.name === 'Claro'
                                                        ? 'bg-green-500/20 text-green-600'
                                                        : 'bg-green-500/20 text-green-300'
                                                    : 'bg-gray-500/20 text-gray-500'
                                                    }`}
                                            >
                                                {candidate.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>


                                        {!isReadOnly && (
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => onEdit(candidate)}
                                                        className={`p-2 rounded ${currentTheme.name === 'Claro'
                                                            ? 'hover:bg-blue-100 text-blue-600'
                                                            : 'hover:bg-blue-500/20 text-blue-400'
                                                            } transition-colors`}
                                                        aria-label="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => onDelete(candidate)}
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