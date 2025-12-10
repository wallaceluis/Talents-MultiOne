'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '../../lib/theme';
import { MetricCard } from '../../components/ui/card';
import { CandidatesTable } from '../../components/tables/candidates-table';
import { useCandidates } from '../../hooks/useCandidates';
import { useAuth } from '../../hooks/useAuth';
import { Search, Users, ListChecks, TrendingUp, Briefcase, BarChart3, Plus, X, Loader2 } from 'lucide-react';
import { Candidate, CreateCandidateDto, UpdateCandidateDto } from '../../types/candidate';

export default function CandidatesPage() {
    const { currentTheme } = useTheme();
    const { candidates, stats, fetchCandidates, fetchStats, createCandidate, updateCandidate, deleteCandidate, loading } = useCandidates();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
    const [formData, setFormData] = useState<CreateCandidateDto>({
        name: '',
        email: '',
        phone: '',
        status: 'ACTIVE'
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState('');

    useEffect(() => {
        if (fetchStats) fetchStats();
        if (fetchCandidates) fetchCandidates();
    }, []);

    const filteredCandidates = candidates.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const candidatesMetricCards = [
        { title: 'Totais', value: String(stats?.total || 0), icon: Users, color: 'text-blue-500' },
        { title: 'Online', value: '0', icon: ListChecks, color: 'text-green-500' },
        { title: 'Ativos', value: String(stats?.active || 0), icon: TrendingUp, color: 'text-yellow-500' },
        { title: 'Em Processo', value: String(stats?.inProcess || 0), icon: Briefcase, color: 'text-purple-500' },
        { title: 'Contratados', value: String(stats?.hired || 0), icon: BarChart3, color: 'text-red-500' },
    ];

    const handleOpenCreate = () => {
        setEditingCandidate(null);
        setFormData({
            name: '',
            email: '',
            phone: '',
            status: 'ACTIVE'
        });
        setFormError('');
        setShowModal(true);
    };

    const handleOpenEdit = (candidate: Candidate) => {
        setEditingCandidate(candidate);
        setFormData({
            name: candidate.name,
            email: candidate.email,
            phone: candidate.phone || '',
            status: candidate.status || 'ACTIVE'
        });
        setFormError('');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCandidate(null);
        setFormError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError('');

        try {
            if (editingCandidate) {
                // Remove campos não usados pelo UpdateCandidateDto se necessário
                const updateData: UpdateCandidateDto = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    status: formData.status
                };
                await updateCandidate(editingCandidate.id, updateData);
            } else {
                await createCandidate(formData);
            }
            handleCloseModal();
            if (fetchCandidates) await fetchCandidates();
            if (fetchStats) await fetchStats();
        } catch (err: any) {
            setFormError(err.message || 'Erro ao salvar candidato');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (candidate: Candidate) => {
        if (!confirm(`Deseja realmente excluir o candidato "${candidate.name}"?`)) return;
        try {
            await deleteCandidate(candidate.id);
            if (fetchStats) await fetchStats();
        } catch (err: any) {
            alert(err.message || 'Erro ao excluir candidato');
        }
    };

    return (
        <main className="space-y-6 md:space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className={`text-2xl md:text-4xl font-bold ${currentTheme.mainText}`}>Gerenciamento de Candidatos</h1>
                    <p className={`mt-2 text-sm md:text-base ${currentTheme.mainText} opacity-70`}>
                        Candidatos cadastrados na plataforma
                    </p>
                </div>
                {user?.role !== 'VIEWER' && (
                    <button
                        onClick={handleOpenCreate}
                        className={`${currentTheme.buttonBg} flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors`}
                    >
                        <Plus className="w-5 h-5" />
                        Novo Candidato
                    </button>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar candidatos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full p-3 pl-12 pr-4 rounded-xl border ${currentTheme.name === 'Claro'
                            ? 'border-gray-300 bg-white text-gray-900'
                            : 'bg-gray-800/50 border-gray-700/50 text-white'
                            } placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                    />
                </div>
            </div>

            {loading && !candidates.length ? (
                <div className="text-center">
                    <p className={currentTheme.mainText}>Carregando...</p>
                </div>
            ) : (
                <div className="grid-row-2 grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
                    {candidatesMetricCards.map((data, i) => (
                        <MetricCard key={`candidate-${i}`} {...data} />
                    ))}
                </div>
            )}

            <CandidatesTable
                candidates={filteredCandidates}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
                isReadOnly={user?.role === 'VIEWER'}
            />

            {/* Candidate Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className={`${currentTheme.cardBg} rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border ${currentTheme.cardBorder} shadow-xl`}>
                        <div className={`flex justify-between items-center p-6 border-b ${currentTheme.cardBorder} rounded-t-2xl`}>
                            <h3 className={`text-xl font-bold ${currentTheme.mainText}`}>
                                {editingCandidate ? 'Editar Candidato' : 'Novo Candidato'}
                            </h3>
                            <button onClick={handleCloseModal} className={`${currentTheme.cardText} hover:opacity-75`}>
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {formError && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                                    <p className="text-sm text-red-500">{formError}</p>
                                </div>
                            )}

                            <div>
                                <label className={`block text-sm font-medium ${currentTheme.cardText} mb-2`}>Nome *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${currentTheme.searchBg} ${currentTheme.mainText} ${currentTheme.cardBorder}`}
                                    disabled={formLoading}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${currentTheme.cardText} mb-2`}>Email *</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${currentTheme.searchBg} ${currentTheme.mainText} ${currentTheme.cardBorder}`}
                                    disabled={formLoading}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${currentTheme.cardText} mb-2`}>Telefone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${currentTheme.searchBg} ${currentTheme.mainText} ${currentTheme.cardBorder}`}
                                    disabled={formLoading}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${currentTheme.cardText} mb-2`}>Status *</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${currentTheme.searchBg} ${currentTheme.mainText} ${currentTheme.cardBorder}`}
                                    disabled={formLoading}
                                >
                                    <option value="ACTIVE">Ativo</option>
                                    <option value="INACTIVE">Inativo</option>
                                    <option value="IN_PROCESS">Em Processo</option>
                                </select>
                            </div>

                            <div className={`flex justify-end gap-3 pt-4 border-t ${currentTheme.cardBorder}`}>
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    disabled={formLoading}
                                    className={`px-6 py-3 border ${currentTheme.cardBorder} ${currentTheme.cardText} rounded-lg hover:opacity-75 transition-colors disabled:opacity-50 font-medium`}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                                >
                                    {formLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Salvando...
                                        </>
                                    ) : (
                                        editingCandidate ? 'Salvar Alterações' : 'Criar Candidato'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
