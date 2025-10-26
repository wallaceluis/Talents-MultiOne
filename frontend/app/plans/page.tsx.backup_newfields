'use client';

import React, { useEffect, useState } from 'react';
import { usePlans } from '../../hooks/usePlans';
import { Plan, CreatePlanDto, UpdatePlanDto } from '../../types/plan';
import { Package, Plus, Trash2, Search, X, Edit2 } from 'lucide-react';

export default function PlansPage() {
  const { plans, loading, error, fetchPlans, createPlan, updatePlan, deletePlan } = usePlans();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<CreatePlanDto>({
    name: '', type: 'FREE', price: 0, maxUsers: 1, maxCandidates: 10, maxVacancies: 1, features: [],
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const filteredPlans = plans.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setFormData({ name: '', type: 'FREE', price: 0, maxUsers: 1, maxCandidates: 10, maxVacancies: 1, features: [] });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      type: plan.type,
      price: plan.price,
      maxUsers: plan.maxUsers,
      maxCandidates: plan.maxCandidates,
      maxVacancies: plan.maxVacancies,
      features: plan.features || [],
    });
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormError('');
    setFeatureInput('');
  };

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...(formData.features || []), featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features?.filter((_, i) => i !== index) || [] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editingPlan) {
        const updateData: UpdatePlanDto = {};
        if (formData.name !== editingPlan.name) updateData.name = formData.name;
        if (formData.type !== editingPlan.type) updateData.type = formData.type;
        if (formData.price !== editingPlan.price) updateData.price = formData.price;
        if (formData.maxUsers !== editingPlan.maxUsers) updateData.maxUsers = formData.maxUsers;
        if (formData.maxCandidates !== editingPlan.maxCandidates) updateData.maxCandidates = formData.maxCandidates;
        if (formData.maxVacancies !== editingPlan.maxVacancies) updateData.maxVacancies = formData.maxVacancies;
        if (JSON.stringify(formData.features) !== JSON.stringify(editingPlan.features)) updateData.features = formData.features;
        await updatePlan(editingPlan.id, updateData);
      } else {
        await createPlan(formData);
      }
      handleCloseModal();
      await fetchPlans();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (plan: Plan) => {
    if (!confirm(`Deseja realmente excluir o plano "${plan.name}"?`)) return;
    try {
      await deletePlan(plan.id);
      await fetchPlans();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FREE': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      case 'BASIC': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'PREMIUM': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Planos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie os planos disponíveis</p>
        </div>
        <button onClick={handleOpenCreate} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-5 h-5" />Novo Plano
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Buscar por nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div><p className="mt-2 text-gray-600 dark:text-gray-400">Carregando...</p></div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : filteredPlans.length === 0 ? (
        <div className="p-8 text-center text-gray-600 dark:text-gray-400">Nenhum plano encontrado</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(plan.type)}`}>{plan.type}</span>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">R$ {Number(plan.price).toFixed(2)}<span className="text-sm text-gray-500">/mês</span></p>
              </div>
              <div className="space-y-2 mb-4">
                <div className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">{plan.maxUsers}</span> usuários</div>
                <div className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">{plan.maxCandidates}</span> candidatos</div>
                <div className="text-sm text-gray-600 dark:text-gray-400"><span className="font-semibold">{plan.maxVacancies}</span> vagas</div>
              </div>
              {plan.features && plan.features.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Features:</p>
                  <ul className="space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-start">
                        <span className="mr-2">•</span>{feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleOpenEdit(plan)} className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" />Editar
                </button>
                <button onClick={() => handleDelete(plan)} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 my-8">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{editingPlan ? 'Editar Plano' : 'Novo Plano'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo *</label>
                  <select required value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="FREE">Free</option><option value="BASIC">Basic</option><option value="PREMIUM">Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preço (R$) *</label>
                  <input type="number" required min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Máx. Usuários *</label>
                  <input type="number" required min="1" value={formData.maxUsers} onChange={(e) => setFormData({ ...formData, maxUsers: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Máx. Candidatos *</label>
                  <input type="number" required min="1" value={formData.maxCandidates} onChange={(e) => setFormData({ ...formData, maxCandidates: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Máx. Vagas *</label>
                  <input type="number" required min="1" value={formData.maxVacancies} onChange={(e) => setFormData({ ...formData, maxVacancies: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())} placeholder="Digite uma feature" className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button type="button" onClick={handleAddFeature} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Adicionar</button>
                  </div>
                  {formData.features && formData.features.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {formData.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-3 py-2 rounded">
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                          <button type="button" onClick={() => handleRemoveFeature(idx)} className="text-red-600 hover:text-red-800"><X className="w-4 h-4" /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {formError && <div className="text-red-600 text-sm mb-4">{formError}</div>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={handleCloseModal} className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Cancelar</button>
                <button type="submit" disabled={formLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">{formLoading ? 'Salvando...' : editingPlan ? 'Atualizar' : 'Criar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
