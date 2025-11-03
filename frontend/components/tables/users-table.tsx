'use client';

import { useEffect } from 'react';
import { useTheme } from '../../lib/theme';
import { useUsers } from '../../hooks/useUsers';
import { Shield } from 'lucide-react';

export const UsersTable = () => {
    const { currentTheme } = useTheme();
    const { users, fetchUsers, loading } = useUsers();

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className={`p-6 rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg}`}>
                <p className={currentTheme.mainText}>Carregando usuários...</p>
            </div>
        );
    }

    return (
        <div className={`p-4 md:p-6 rounded-xl md:rounded-2xl border ${currentTheme.cardBorder} ${currentTheme.cardBg} transition-all shadow-lg overflow-hidden`}>
            <div className="overflow-x-auto -mx-4 md:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                {['USUÁRIO', 'PERMISSÃO', 'STATUS', 'AÇÕES'].map(h => (
                                    <th key={h} className={`px-3 md:px-6 py-3 text-left text-xs font-medium ${currentTheme.mainText} uppercase tracking-wider opacity-60`}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center">
                                        <p className={`${currentTheme.mainText} opacity-70`}>Nenhum usuário encontrado</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className={`transition-colors ${currentTheme.name === 'Claro' ? 'hover:bg-gray-50' : 'hover:bg-white/5'}`}>
                                        <td className={`px-3 md:px-6 py-4 ${currentTheme.mainText}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm md:text-base">{user.name}</div>
                                                    <div className="text-xs opacity-70">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                                                user.role === 'ADMIN' 
                                                    ? currentTheme.name === 'Claro' ? 'bg-green-100 text-green-800' : 'bg-green-900/50 text-green-300'
                                                    : currentTheme.name === 'Claro' ? 'bg-blue-100 text-blue-800' : 'bg-blue-900/50 text-blue-300'
                                            }`}>
                                                <Shield size={14} />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                currentTheme.name === 'Claro' ? 'bg-green-100 text-green-800' : 'bg-green-900/50 text-green-300'
                                            }`}>
                                                {user.status || 'ACTIVE'}
                                            </span>
                                        </td>
                                        <td className={`px-3 md:px-6 py-4 text-sm ${currentTheme.cardText}`}>
                                            <div className="flex space-x-2">
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
