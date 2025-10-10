"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className={`bg-gray-900 text-white h-screen p-4 transition-all ${expanded ? 'w-64' : 'w-20'}`}>
      <button
        className="mb-6 p-2 bg-gray-700 rounded"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? '⬅️' : '➡️'}
      </button>
      <nav className="flex flex-col gap-4">
        <Link href="/dashboard">
          <span className="hover:text-indigo-400">{expanded ? 'Dashboard' : '🏠'}</span>
        </Link>
        <Link href="/companies">
          <span className="hover:text-indigo-400">{expanded ? 'Empresas' : '🏢'}</span>
        </Link>
        <Link href="/users">
          <span className="hover:text-indigo-400">{expanded ? 'Usuários' : '👤'}</span>
        </Link>
        <Link href="/plans">
          <span className="hover:text-indigo-400">{expanded ? 'Planos' : '💳'}</span>
        </Link>
      </nav>
    </div>
  );
}
