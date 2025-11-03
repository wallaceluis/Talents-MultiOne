'use client';

import React, { useEffect, useState } from 'react';
import { usePlans } from '../../hooks/usePlans';
import { Plan } from '../../types/plan';
import { Package, Plus, Trash2, Search, Check } from 'lucide-react';

export default function PlansPage() {
  const { plans, loading, error, fetchPlans, deletePlan } = usePlans();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const filteredPlans = plans.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      case 'FREE': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
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
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-600">{error}</div>
      ) : filteredPlans.length === 0 ? (
        <div className="p-8 text-center text-gray-600 dark:text-gray-400">Nenhum plano encontrado</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(plan.type)}`}>
                        {plan.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price === '0' ? 'Grátis' : `R$ ${plan.price}`}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">por mês</div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    <span>{plan.maxUsers} usuários</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    <span>{plan.maxCandidates} candidatos</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    <span>{plan.maxVacancies} vagas</span>
                  </div>
                </div>

                {plan.features && plan.features.length > 0 && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Recursos:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                          <Check className="w-4 h-4 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {plan._count?.companies || 0} empresas
                  </div>
                  <button
                    onClick={() => handleDelete(plan)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!plan.isActive && (
                <div className="bg-red-50 dark:bg-red-900/20 px-6 py-3 border-t border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">Plano inativo</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
