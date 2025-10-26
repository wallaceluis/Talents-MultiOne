'use client';

import { useTheme } from '../../lib/theme';
import { CandidatesTableData } from '../../lib/data';
import { Edit2, Trash2 } from 'lucide-react';

export const CandidatesTable = () => {
    const { currentTheme } = useTheme();

    return (
        <div className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg`}>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <h3 className={`text-lg sm:text-xl md:text-2xl font-semibold ${currentTheme.titleColor}`}>
                    Candidatos Cadastrados
                </h3>
            </div>

    
            <div className="block md:hidden space-y-3">
                {CandidatesTableData.map((row) => (
                    <div
                        key={row.email}
                        className={`p-3 rounded-lg border ${currentTheme.cardBorder} ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'} transition-colors`}
                    >
                        
                        <div className="mb-2">
                            <div className={`font-semibold text-sm ${currentTheme.mainText} mb-1`}>
                                {row.nome}
                            </div>
                            <div className={`text-xs ${currentTheme.cardText} opacity-70`}>
                                {row.email}
                            </div>
                        </div>

                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        currentTheme.name === 'Claro' 
                                            ? 'bg-green-500/20 text-green-600' 
                                            : 'bg-blue-500/20 text-blue-300'
                                    }`}
                                >
                                    {row.status}
                                </span>
                                <span className={`text-xs ${currentTheme.cardText}`}>
                                    {row.candidaturas} candidaturas
                                </span>
                            </div>

                            
                            <div className="flex gap-2">
                                <button 
                                    className={`p-1.5 rounded ${
                                        currentTheme.name === 'Claro' 
                                            ? 'hover:bg-blue-100 text-blue-600' 
                                            : 'hover:bg-blue-500/20 text-blue-400'
                                    } transition-colors`}
                                    aria-label="Editar"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button 
                                    className={`p-1.5 rounded ${
                                        currentTheme.name === 'Claro' 
                                            ? 'hover:bg-red-100 text-red-600' 
                                            : 'hover:bg-red-500/20 text-red-400'
                                    } transition-colors`}
                                    aria-label="Deletar"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
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
                            <th className={`px-4 py-3 text-center text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                STATUS
                            </th>
                            <th className={`px-4 py-3 text-center text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                CANDIDATURAS
                            </th>
                            <th className={`px-4 py-3 text-center text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                AÇÕES
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                        {CandidatesTableData.map((row) => (
                            <tr 
                                key={row.email} 
                                className={`transition-colors ${
                                    currentTheme.name === 'Claro' 
                                        ? 'hover:bg-gray-50' 
                                        : 'hover:bg-white/5'
                                }`}
                            >
                                
                                <td className={`px-4 py-4 ${currentTheme.mainText} text-left`}>
                                    <div className="font-semibold text-sm">
                                        {row.nome}
                                    </div>
                                    <div className="text-xs opacity-70">
                                        {row.email}
                                    </div>
                                </td>

                                
                                <td className="px-4 py-4 text-center">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            currentTheme.name === 'Claro' 
                                                ? 'bg-green-500/20 text-green-600' 
                                                : 'bg-blue-500/20 text-blue-300'
                                        }`}
                                    >
                                        {row.status}
                                    </span>
                                </td>

                                
                                <td className={`px-4 py-4 text-sm ${currentTheme.cardText} text-center`}>
                                    {row.candidaturas}
                                </td>

                                
                                <td className="px-4 py-4 text-center">
                                    <div className="flex gap-2 justify-center">
                                        <button 
                                            className={`p-2 rounded ${
                                                currentTheme.name === 'Claro' 
                                                    ? 'hover:bg-blue-100 text-blue-600' 
                                                    : 'hover:bg-blue-500/20 text-blue-400'
                                            } transition-colors`}
                                            aria-label="Editar"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            className={`p-2 rounded ${
                                                currentTheme.name === 'Claro' 
                                                    ? 'hover:bg-red-100 text-red-600' 
                                                    : 'hover:bg-red-500/20 text-red-400'
                                            } transition-colors`}
                                            aria-label="Deletar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};