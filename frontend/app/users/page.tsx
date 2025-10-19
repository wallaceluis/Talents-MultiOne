'use client';

import { UserCircle } from 'lucide-react';
import { useTheme } from "../../lib/theme";
import { UsersTable } from '../../components/tables/users-table';

export default function UsersPage() {
    const { currentTheme } = useTheme();

    return (
        <main className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={`text-2xl md:text-4xl font-bold ${currentTheme.mainText}`}>Gerenciamento de Usuários</h1>
                    <p className={`mt-2 text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
                        Adicione, edite ou remova usuários da plataforma
                    </p>
                </div>
                <button className={`w-full md:w-auto px-5 py-3 rounded-lg ${currentTheme.buttonBg} font-medium whitespace-nowrap flex items-center justify-center gap-2`}>
                    <UserCircle size={20} />
                    Criar Novo Usuário
                </button>
            </div>
            <UsersTable />
        </main>
    );
}