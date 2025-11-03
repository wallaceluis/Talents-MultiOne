'use client';

import { useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { useVacancies } from '../../hooks/useVacancies';

export function VacanciesTable() {
    const { currentTheme } = useTheme();
    const { vacancies, fetchVacancies, loading } = useVacancies();

    useEffect(() => {
        fetchVacancies();
    }, []);

    if (loading) {
        return (
            <div className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg}`}>
                <p className={currentTheme.mainText}>Carregando vagas...</p>
            </div>
        );
    }

    return (
        <div className={`${currentTheme.cardBg} backdrop-blur-sm rounded-xl border ${currentTheme.cardBorder} overflow-hidden`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${currentTheme.cardBg} border-b ${currentTheme.cardBorder}`}>
                        <tr>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.titleColor}`}>Título da Vaga</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.titleColor}`}>Empresa</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.titleColor}`}>Tipo</th>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${currentTheme.titleColor}`}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vacancies.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center">
                                    <p className={`${currentTheme.mainText} opacity-70`}>Nenhuma vaga cadastrada</p>
                                </td>
                            </tr>
                        ) : (
                            vacancies.map((vacancy) => (
                                <tr key={vacancy.id} className={`border-b ${currentTheme.cardBorder} ${currentTheme.sidebarHover} transition-colors`}>
                                    <td className={`px-6 py-4 ${currentTheme.cardText} font-medium`}>{vacancy.title}</td>
                                    <td className={`px-6 py-4 ${currentTheme.cardText}`}>{vacancy.company?.name || 'N/A'}</td>
                                    <td className={`px-6 py-4 ${currentTheme.cardText}`}>{vacancy.type}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            vacancy.status === 'OPEN' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {vacancy.status === 'OPEN' ? 'Aberta' : 'Fechada'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
