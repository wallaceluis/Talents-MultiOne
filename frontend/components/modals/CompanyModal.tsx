'use client';

import { useState, useEffect } from 'react';
import { X, Building2, Globe, Loader2, Briefcase, Users, MapPin, FileText, Search, AlertCircle, CreditCard } from 'lucide-react';
import api from '../../lib/api';

interface CompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  company?: any;
  mode: 'create' | 'edit';
}

const SECTORS = [
  'Tecnologia',
  'Varejo',
  'Serviços',
  'Indústria',
  'Saúde',
  'Educação',
  'Financeiro',
  'Imobiliário',
  'Outros'
];

const SEGMENTS: Record<string, string[]> = {
  'Tecnologia': ['Desenvolvimento de Software', 'Consultoria TI', 'SaaS', 'Hardware', 'Telecomunicações'],
  'Varejo': ['E-commerce', 'Supermercado', 'Vestuário', 'Eletrônicos', 'Móveis'],
  'Serviços': ['Consultoria', 'Marketing', 'Recursos Humanos', 'Jurídico', 'Logística'],
  'Indústria': ['Manufatura', 'Automotiva', 'Alimentos', 'Têxtil', 'Química'],
  'Saúde': ['Hospitais', 'Clínicas', 'Farmacêutica', 'Laboratórios'],
  'Educação': ['Escolas', 'Universidades', 'Cursos Online', 'Treinamento Corporativo'],
  'Financeiro': ['Bancos', 'Seguros', 'Investimentos', ' Fintech'],
  'Imobiliário': ['Construção', 'Vendas', 'Aluguel', 'Gestão de Propriedades'],
  'Outros': ['Outros']
};

const BRAZIL_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

// Utility to format CNPJ
const formatCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
};

// Utility to format CEP
const formatCEP = (value: string) => {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d)/, '$1-$2')
    .slice(0, 9);
};

export function CompanyModal({ isOpen, onClose, onSubmit, company, mode }: CompanyModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingCNPJ, setFetchingCNPJ] = useState(false);
  const [fetchingCEP, setFetchingCEP] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  const [formData, setFormData] = useState({
    cnpj: '',
    name: '', // Razão Social
    fantasyName: '', // Nome Fantasia
    domain: '',
    sector: '',
    subSector: '',
    website: '',
    linkedin: '',
    description: '',
    zipCode: '', // CEP
    address: '', // Logradouro
    number: '',
    complement: '',
    neighborhood: '', // Bairro
    city: '',
    state: '', // UF
    planId: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (company && mode === 'edit') {
      setFormData({
        cnpj: company.cnpj || '',
        name: company.name || '',
        fantasyName: company.fantasyName || '',
        domain: company.domain || '',
        sector: company.sector || '',
        subSector: company.subSector || '',
        website: company.website || '',
        linkedin: company.linkedin || '',
        description: company.description || '',
        zipCode: company.zipCode || '',
        address: company.address || '',
        number: company.number || '',
        complement: company.complement || '',
        neighborhood: company.neighborhood || '',
        city: company.city || '',
        state: company.state || '',
        planId: company.planId || '',
        status: company.status || 'ACTIVE',
      });
    } else {
      setFormData({
        cnpj: '',
        name: '',
        fantasyName: '',
        domain: '',
        sector: '',
        subSector: '',
        website: '',
        linkedin: '',
        description: '',
        zipCode: '',
        address: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        planId: '',
        status: 'ACTIVE',
      });
    }
    setError(null);
  }, [company, mode, isOpen]);

  // Fetch plans
  useEffect(() => {
    if (isOpen) {
      fetchPlans();
    }
  }, [isOpen]);

  const fetchPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await api.get('/plans?includeInactive=true');
      const data = (response.data as any).data || response.data;
      setPlans(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch plans', err);
      // Fallback
      setPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const fetchCNPJData = async () => {
    // Only fetch if CNPJ is valid (14 digits)
    const cleanCNPJ = formData.cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14) {
      setError('CNPJ inválido ou incompleto.');
      return;
    }

    setFetchingCNPJ(true);
    setError(null);

    try {
      // Use our Next.js Proxy
      const response = await fetch(`/api/proxy/cnpj?cnpj=${cleanCNPJ}`);

      if (!response.ok) {
        if (response.status === 429) throw new Error('Muitas requisições. Tente novamente mais tarde.');
        throw new Error('Falha na consulta do CNPJ');
      }

      const data = await response.json();

      if (data.status === 'ERROR') {
        setError(data.message);
        return;
      }

      setFormData(prev => ({
        ...prev,
        name: data.nome || prev.name,
        fantasyName: data.fantasia || prev.fantasyName,
        zipCode: data.cep ? data.cep.replace('.', '') : prev.zipCode,
        address: data.logradouro || prev.address,
        number: data.numero || prev.number,
        complement: data.complement || prev.complement,
        neighborhood: data.bairro || prev.neighborhood,
        city: data.municipio || prev.city,
        state: data.uf || prev.state,
        // Attempt to guess domain from email if available
        domain: !prev.domain && data.email ? data.email.split('@')[1] : prev.domain
      }));

    } catch (err: any) {
      console.error('Erro ao consultar CNPJ:', err);
      setError(err.message || 'Erro ao consultar CNPJ');
    } finally {
      setFetchingCNPJ(false);
    }
  };

  const fetchCEPData = async () => {
    const cleanCEP = formData.zipCode.replace(/\D/g, '');
    if (cleanCEP.length !== 8) {
      // Don't error if empty, just ignore
      return;
    }

    setFetchingCEP(true);
    try {
      const response = await api.get(`https://brasilapi.com.br/api/cep/v1/${cleanCEP}`);
      const data = response.data as any;

      setFormData(prev => ({
        ...prev,
        address: data.street || prev.address,
        neighborhood: data.neighborhood || prev.neighborhood,
        city: data.city || prev.city,
        state: data.state || prev.state
      }));
    } catch (err) {
      console.error('Erro ao consultar CEP:', err);
    } finally {
      setFetchingCEP(false);
    }
  };

  const handleCNPJBlur = () => {
    if (formData.cnpj.replace(/\D/g, '').length === 14) {
      fetchCNPJData();
    }
  };

  const handleCEPBlur = () => {
    if (formData.zipCode.replace(/\D/g, '').length === 8) {
      fetchCEPData();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Clean data before sending (remove masks etc if needed)
      await onSubmit({
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        zipCode: formData.zipCode.replace(/\D/g, '')
      });
      onClose();
    } catch (err: any) {
      console.error('Erro ao salvar:', err);
      setError(err.response?.data?.message || 'Erro ao salvar empresa');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl transition-colors">

        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-zinc-100">
                {mode === 'create' ? 'Nova Empresa' : 'Editar Empresa'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400">Preencha os dados da empresa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800/50 p-2 rounded-full transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {error && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Seção 1: Dados Principais */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 tracking-wider uppercase flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Dados Corporativos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* CNPJ */}
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">CNPJ</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={formData.cnpj}
                      onChange={(e) => setFormData({ ...formData, cnpj: formatCNPJ(e.target.value) })}
                      onBlur={handleCNPJBlur}
                      placeholder="00.000.000/0000-00"
                      maxLength={18}
                      className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                      disabled={loading || fetchingCNPJ}
                    />
                    {fetchingCNPJ && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={fetchCNPJData}
                    disabled={fetchingCNPJ || loading}
                    className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                    title="Buscar CNPJ"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Razão Social */}
              <div className="md:col-span-8">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Razão Social</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome oficial da empresa"
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                  disabled={loading}
                />
              </div>

              {/* Nome Fantasia */}
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Nome Fantasia</label>
                <input
                  type="text"
                  value={formData.fantasyName}
                  onChange={(e) => setFormData({ ...formData, fantasyName: e.target.value })}
                  placeholder="Nome comercial"
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                  disabled={loading}
                />
              </div>

              {/* Domínio */}
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Domínio Corporativo</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    placeholder="empresa.com"
                    className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 pl-9 pr-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Setor */}
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Setor</label>
                <select
                  value={formData.sector}
                  onChange={(e) => setFormData({ ...formData, sector: e.target.value, subSector: '' })}
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                  disabled={loading}
                >
                  <option value="">Selecione...</option>
                  {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Segmento */}
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Segmento</label>
                <select
                  value={formData.subSector}
                  onChange={(e) => setFormData({ ...formData, subSector: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all disabled:opacity-50"
                  disabled={loading || !formData.sector}
                >
                  <option value="">Selecione...</option>
                  {(formData.sector && SEGMENTS[formData.sector]) ? (
                    SEGMENTS[formData.sector].map(s => <option key={s} value={s}>{s}</option>)
                  ) : null}
                </select>
              </div>

              {/* Website */}
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Website</label>
                <input
                  type="text"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="exemplo.com"
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                  disabled={loading}
                />
              </div>

              {/* LinkedIn */}
              <div className="md:col-span-6">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">LinkedIn</label>
                <input
                  type="text"
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  placeholder="linkedin.com/company/..."
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                  disabled={loading}
                />
              </div>

              {/* Descrição */}
              <div className="md:col-span-12">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Descrição</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Breve descrição sobre a empresa..."
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600 resize-none"
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          {/* Seção 2: Endereço */}
          <section className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800/50">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 tracking-wider uppercase flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* CEP */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">CEP</label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: formatCEP(e.target.value) })}
                      onBlur={handleCEPBlur}
                      placeholder="00000-000"
                      maxLength={9}
                      className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                      disabled={loading || fetchingCEP}
                    />
                    {fetchingCEP && (
                      <div className="absolute right-3 top-2.5">
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={fetchCEPData}
                    disabled={fetchingCEP || loading}
                    className="p-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Logradouro */}
              <div className="md:col-span-7">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Logradouro</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, Avenida..."
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                  disabled={loading}
                />
              </div>

              {/* Número */}
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Número</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="123"
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                  disabled={loading}
                />
              </div>

              {/* Complemento */}
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Complemento</label>
                <input
                  type="text"
                  value={formData.complement}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                  placeholder="Apto, Sala..."
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                  disabled={loading}
                />
              </div>

              {/* Bairro */}
              <div className="md:col-span-4">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Bairro</label>
                <input
                  type="text"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                  disabled={loading}
                />
              </div>

              {/* Cidade */}
              <div className="md:col-span-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Cidade</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                  disabled={loading}
                />
              </div>

              {/* UF */}
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">UF</label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-1 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                  disabled={loading}
                >
                  <option value=""></option>
                  {BRAZIL_STATES.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                </select>
              </div>

            </div>
          </section>

          {/* Seção 3: Configurações */}
          <section className="space-y-4 pt-4 border-t border-gray-200 dark:border-zinc-800/50">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-zinc-400 tracking-wider uppercase flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Plano e Status
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Plano */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Plano</label>
                <select
                  value={formData.planId}
                  onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                  disabled={loading || loadingPlans}
                >
                  <option value="">Selecione um plano...</option>
                  {plans.map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.name}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-zinc-400 mb-1.5 ml-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700/50 text-gray-900 dark:text-zinc-100 px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 outline-none transition-all"
                  disabled={loading}
                >
                  <option value="ACTIVE">Ativo</option>
                  <option value="INACTIVE">Inativo</option>
                  <option value="TRIAL">Trial</option>
                </select>
              </div>

            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-800/50">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-all disabled:opacity-50 font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                mode === 'create' ? 'Cadastrar Empresa' : 'Salvar Alterações'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
