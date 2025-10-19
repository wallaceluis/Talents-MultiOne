'use client';

import { useTheme } from '../../lib/theme';
import { tableData } from '../../lib/data';

export const CompaniesTable = () => {
    const { currentTheme } = useTheme();
    return (
        <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg overflow-hidden`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className={`text-xl md:text-2xl font-semibold ${currentTheme.titleColor}`}>Empresas Cadastradas</h3>
                <button className={`w-full sm:w-auto px-4 py-2 md:px-5 md:py-3 rounded-lg ${currentTheme.buttonBg} font-medium text-sm md:text-base whitespace-nowrap`}>+ Nova Empresa</button>
            </div>
            <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead><tr>{['EMPRESA', 'SETOR', 'PLANO', 'STATUS', 'AÇÕES'].map((h)=><th key={h} className={`px-3 md:px-6 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>{h}</th>)}</tr></thead>
                        <tbody className="divide-y divide-gray-200">{tableData.map((row,i)=>(<tr key={i} className={`transition-colors ${currentTheme.name==='Claro'?'hover:bg-gray-50':'hover:bg-white/5'}`}><td className={`px-3 md:px-6 py-4 ${currentTheme.mainText}`}><div className="font-semibold text-sm md:text-base truncate max-w-[150px] md:max-w-none">{row.empresa}</div><div className="text-xs opacity-70 truncate max-w-[150px] md:max-w-none">{row.email}</div></td><td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}><span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${currentTheme.name==='Claro'?'bg-blue-500/20 text-blue-600':'bg-blue-500/20 text-blue-300'}`}>{row.setor}</span></td><td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText} whitespace-nowrap`}>{row.plano}</td><td className={`px-3 md:px-6 py-4 text-xs md:text-sm ${currentTheme.cardText}`}><span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${row.status==='Ativo'?currentTheme.name==='Claro'?'bg-green-500/20 text-green-600':'bg-green-500/20 text-green-300':currentTheme.name==='Claro'?'bg-yellow-500/20 text-yellow-600':'bg-yellow-500/20 text-yellow-300'}`}>{row.status}</span></td><td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}><div className="flex space-x-2"><button className={`${currentTheme.name==='Claro'?'hover:text-blue-600':'hover:text-blue-300'} transition-colors`}>✏️</button><button className={`${currentTheme.name==='Claro'?'hover:text-red-600':'hover:text-red-300'} transition-colors`}>🗑️</button></div></td></tr>))}</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

