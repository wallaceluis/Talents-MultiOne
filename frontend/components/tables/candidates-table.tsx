'use client';

import { useTheme } from '../../lib/theme';
import { CandidatesTableData } from '../../lib/data';

export const CandidatesTable = () => {
    const { currentTheme } = useTheme();

    const headers = [
        { title: 'NOME', align: 'text-left' },
        { title: 'STATUS', align: 'text-center' },
        { title: 'CANDIDATURAS', align: 'text-center' },
        { title: 'AÇÕES', align: 'text-center' }
    ];

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
                                    <th
                                        key={h.title}
                                        className={`px-3 md:px-6 py-3 ${h.align} text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}
                                    >
                                        {h.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* Usando row.email como key para evitar o erro de index */}
                            {CandidatesTableData.map((row) => (
                                <tr key={row.email} className={`transition-colors ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                                    
                                    {/* COLUNA 1: NOME E EMAIL - Alinhado à ESQUERDA */}
                                    <td className={`px-3 md:px-6 py-4 ${currentTheme.mainText} text-left`}>
                                        <div className="font-semibold text-sm md:text-base truncate max-w-[150px] md:max-w-none">
                                            {row.nome}
                                        </div>
                                        <div className="text-xs opacity-70 truncate max-w-[150px] md:max-w-none">
                                            {row.email}
                                        </div>
                                    </td>
                                    
                                    {/* COLUNA 2: STATUS - Alinhado ao CENTRO */}
                                    <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText} text-center`}>
                                        <span
                                            className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${currentTheme.name === 'Claro' ? 'bg-green-500/20 text-green-600' : 'bg-blue-500/20 text-blue-300'}`}
                                        >
                                            {row.status}
                                        </span>
                                    </td>
                                    
                                    {/* COLUNA 3: CANDIDATURAS - Alinhado ao CENTRO */}
                                    <td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText} whitespace-nowrap text-center`}>
                                        {row.candidaturas}
                                    </td>
                                    
                                    {/* COLUNA 4: AÇÕES - Alinhado ao CENTRO */}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};