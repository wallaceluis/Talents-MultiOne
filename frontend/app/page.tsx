// app/page.tsx
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 bg-gray-50">
      <h1 className="text-4xl font-bold">Painel Talents MultiOne</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
        <Link
          href="/dashboard"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">📊 Dashboard</h2>
          <p className="text-gray-600 text-sm">Visão geral do sistema</p>
        </Link>

        <Link
          href="/companies"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">🏢 Empresas</h2>
          <p className="text-gray-600 text-sm">Gerencie empresas cadastradas</p>
        </Link>

        <Link
          href="/candidates"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">👤 Candidatos</h2>
          <p className="text-gray-600 text-sm">Gerencie candidatos</p>
        </Link>

        <Link
          href="/users"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">👥 Usuários</h2>
          <p className="text-gray-600 text-sm">Controle de acesso</p>
        </Link>

        <Link
          href="/plans"
          className="p-6 bg-white rounded-2xl shadow hover:shadow-md transition"
        >
          <h2 className="text-lg font-semibold">💼 Planos</h2>
          <p className="text-gray-600 text-sm">Gerenciamento de planos</p>
        </Link>
      </div>
    </main>
  );
}
