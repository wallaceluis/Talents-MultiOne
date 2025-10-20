'use client';

import { useTheme } from '../../lib/theme';
import { vacanciesTableData } from '../../lib/data';

export function VacanciesTable() {
    const { currentTheme } = useTheme();

    return (
        <div className={`${currentTheme.cardBg} backdrop-blur-sm rounded-xl border ${currentTheme.cardBorder} overflow-hidden`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${currentTheme.cardBg} border-b ${currentTheme.cardBorder}`}>
                        <tr>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.titleColor}`}>Título da Vaga</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.titleColor}`}>Empresa</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.titleColor}`}>Setor</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.titleColor}`}>Candidaturas</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.titleColor}`}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vacanciesTableData.map((row, i) => (
                            <tr key={i} className={`border-b ${currentTheme.cardBorder} ${currentTheme.sidebarHover} transition-colors`}>
                                <td className={`px-6 py-4 ${currentTheme.cardText} font-medium`}>{row.titulo}</td>
                                <td className={`px-6 py-4 ${currentTheme.cardText}`}>{row.empresa}</td>
                                <td className={`px-6 py-4 ${currentTheme.cardText}`}>{row.setor}</td>
                                <td className={`px-6 py-4 ${currentTheme.cardText}`}>{row.candidaturas}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        row.status === 'Aberta' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
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