'use client';

import { useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { useCandidates } from '../../hooks/useCandidates';

export const CandidatesTable = () => {
    const { currentTheme } = useTheme();
    const { candidates, fetchCandidates, loading } = useCandidates();

    useEffect(() => {
        fetchCandidates();
    }, []);

    const headers = [
        { title: 'NOME', align: 'text-left' },
        { title: 'STATUS', align: 'text-center' },
        { title: 'EMAIL', align: 'text-left' },
        { title: 'AÇÕES', align: 'text-center' }
    ];

    if (loading) {
        return (
            <div className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg}`}>
                <p className={currentTheme.mainText}>Carregando candidatos...</p>
            </div>
        );
    }

    return (
        <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg overflow-hidden`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className={`text-xl md:text-2xl font-semibold ${currentTheme.titleColor}`}>Candidatos Cadastrados</h3>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                {headers.map((h) => (
                                    <th key={h.title} className={`px-3 md:px-6 py-3 ${h.align} text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                        {h.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {candidates.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center">
                                        <p className={`${currentTheme.mainText} opacity-70`}>Nenhum candidato cadastrado</p>
                                    </td>
                                </tr>
                            ) : (
                                candidates.map((candidate) => (
                                    <tr key={candidate.id} className={`transition-colors ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                                        <td className={`px-3 md:px-6 py-4 ${currentTheme.mainText} text-left`}>
                                            <div className="font-semibold text-sm md:text-base truncate max-w-[150px] md:max-w-none">
                                                {candidate.name}
                                            </div>
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText} text-center`}>
                                            <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                                                currentTheme.name === 'Claro' ? 'bg-green-500/20 text-green-600' : 'bg-blue-500/20 text-blue-300'
                                            }`}>
                                                {candidate.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText} text-left`}>
                                            {candidate.email}
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText} text-center`}>
                                            <div className="flex space-x-2 justify-center">
                                                <button className={`${currentTheme.name === 'Claro' ? 'hover:text-blue-600' : 'hover:text-blue-300'} transition-colors`}>
                                                    ✏️
                                                </button>
                                                <button className={`${currentTheme.name === 'Claro' ? 'hover:text-red-600' : 'hover:text-red-300'} transition-colors`}>
                                                    🗑️
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
