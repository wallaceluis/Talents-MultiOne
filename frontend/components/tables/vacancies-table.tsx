'use client';

import { useTheme } from '../../lib/theme';
import { vacanciesTableData } from '../../lib/data';
import { Building2, Briefcase } from 'lucide-react';

export function VacanciesTable() {  
    const { currentTheme } = useTheme();

    return (
        <div className={`p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg`}>
            
            <div className="block md:hidden space-y-3">
                {vacanciesTableData.map((row, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-lg border ${currentTheme.cardBorder} ${
                            currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                        } transition-colors`}
                    >
                        
                        <div className="mb-2">
                            <div className={`font-semibold text-sm ${currentTheme.mainText} mb-1 flex items-start gap-2`}>
                                <Briefcase size={16} className={`${currentTheme.iconColor} flex-shrink-0 mt-0.5`} />
                                <span className="flex-1">{row.titulo}</span>
                            </div>
                        </div>

                       
                        <div className="mb-3 space-y-1">
                            <div className={`text-xs ${currentTheme.cardText} flex items-center gap-2`}>
                                <Building2 size={14} className="opacity-70" />
                                <span>{row.empresa}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                        currentTheme.name === 'Claro'
                                            ? 'bg-blue-500/20 text-blue-600'
                                            : 'bg-blue-500/20 text-blue-300'
                                    }`}
                                >
                                    {row.setor}
                                </span>
                            </div>
                        </div>

                        
                        <div className="flex items-center justify-between">
                            <div className={`text-xs ${currentTheme.cardText}`}>
                                <span className="font-semibold">{row.candidaturas}</span> candidatura{row.candidaturas !== '1' ? 's' : ''}
                            </div>
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    row.status === 'Aberta'
                                        ? currentTheme.name === 'Claro'
                                            ? 'bg-green-500/20 text-green-600'
                                            : 'bg-green-500/20 text-green-400'
                                        : currentTheme.name === 'Claro'
                                        ? 'bg-red-500/20 text-red-600'
                                        : 'bg-red-500/20 text-red-400'
                                }`}
                            >
                                {row.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b border-gray-700/30">
                        <tr>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                Título da Vaga
                            </th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                Empresa
                            </th>
                            <th className={`px-4 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                Setor
                            </th>
                            <th className={`px-4 py-3 text-center text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                Candidaturas
                            </th>
                            <th className={`px-4 py-3 text-center text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/30">
                        {vacanciesTableData.map((row, i) => (
                            <tr
                                key={i}
                                className={`transition-colors ${
                                    currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'
                                }`}
                            >
                                
                                <td className={`px-4 py-4 ${currentTheme.cardText} font-medium text-sm`}>
                                    {row.titulo}
                                </td>

                        
                                <td className={`px-4 py-4 ${currentTheme.cardText} text-sm`}>
                                    {row.empresa}
                                </td>

                                
                                <td className="px-4 py-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            currentTheme.name === 'Claro'
                                                ? 'bg-blue-500/20 text-blue-600'
                                                : 'bg-blue-500/20 text-blue-300'
                                        }`}
                                    >
                                        {row.setor}
                                    </span>
                                </td>

                            
                                <td className={`px-4 py-4 ${currentTheme.cardText} text-sm text-center font-semibold`}>
                                    {row.candidaturas}
                                </td>

                                
                                <td className="px-4 py-4 text-center">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                            row.status === 'Aberta'
                                                ? currentTheme.name === 'Claro'
                                                    ? 'bg-green-500/20 text-green-600'
                                                    : 'bg-green-500/20 text-green-400'
                                                : currentTheme.name === 'Claro'
                                                ? 'bg-red-500/20 text-red-600'
                                                : 'bg-red-500/20 text-red-400'
                                        }`}
                                    >
                                        {row.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}