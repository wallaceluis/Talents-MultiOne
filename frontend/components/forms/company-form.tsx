import { useState } from 'react';
import { createCompany } from '../../hooks/useCompanies';

export default function CompanyForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCompany({ name, domain });
    setName('');
    setDomain('');
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-400 p-4 rounded-xl shadow space-y-4">
      <div>
        <label className="block mb-1">Nome da Empresa</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-white-700 text-black"
          required
        />
      </div>
      <div>
        <label className="block mb-1">Domínio</label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full p-2 rounded bg-white-700 text-black"
          required
        />
      </div>
      <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-indigo-500">
        Cadastrar
      </button>
    </form>
  );
}
