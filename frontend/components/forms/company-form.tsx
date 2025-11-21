import { useState } from 'react';
import { useCompanies } from '../../hooks/useCompanies';

export default function CompanyForm({ onSuccess }: { onSuccess: () => void }) {
  const { createCompany } = useCompanies();
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createCompany({ name, domain });
      setName('');
      setDomain('');
      onSuccess();
      alert('Empresa criada com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-400 p-4 rounded-xl shadow space-y-4">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label className="block mb-1">Nome da Empresa</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          required
          disabled={loading}
        />
      </div>

      <div>
        <label className="block mb-1">Domínio</label>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full p-2 rounded bg-white text-black"
          placeholder="empresa.com"
          required
          disabled={loading}
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 px-4 py-2 rounded hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </button>
    </form>
  );
}
