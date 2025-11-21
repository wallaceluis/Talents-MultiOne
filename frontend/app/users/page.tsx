'use client';

import React, { useEffect, useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { User, CreateUserDto, UpdateUserDto } from '../../types/user';
import { User as UserIcon, Plus, Trash2, Search, X, Edit2, Shield, Building2 } from 'lucide-react';
import { useTheme } from '../../lib/theme';

export default function UsersPage() {
  const { users, loading, error, fetchUsers, createUser, updateUser, deleteUser } = useUsers();
  const { currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<CreateUserDto>({
    name: '', email: '', password: '', role: 'USER', status: 'ACTIVE', companyId: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', password: '', role: 'USER', status: 'ACTIVE', companyId: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      status: user.status,
      companyId: user.companyId || '',
    });
    setFormError('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      if (editingUser) {
        const updateData: UpdateUserDto = {};
        if (formData.name !== editingUser.name) updateData.name = formData.name;
        if (formData.email !== editingUser.email) updateData.email = formData.email;
        if (formData.password) updateData.password = formData.password;
        if (formData.role !== editingUser.role) updateData.role = formData.role;
        if (formData.status !== editingUser.status) updateData.status = formData.status;
        if (formData.companyId !== editingUser.companyId) updateData.companyId = formData.companyId;
        await updateUser(editingUser.id, updateData);
      } else {
        const { status, ...createData } = formData;
        await createUser(createData);
      }
      handleCloseModal();
      await fetchUsers();
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Deseja realmente excluir o usuário "${user.name}"?`)) return;
    try {
      await deleteUser(user.id);
      await fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const getRoleColor = (role: string) => {
    const isDark = currentTheme.name === 'Escuro';
    if (role === 'ADMIN') return isDark ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
    if (role === 'RECRUITER') return isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800';
    return isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const isDark = currentTheme.name === 'Escuro';
    if (status === 'ACTIVE') return isDark ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
    return isDark ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-3xl font-bold ${currentTheme.titleColor}`}>Usuários</h1>
          <p className={`mt-1 ${currentTheme.cardText}`}>Gerencie os usuários do sistema</p>
        </div>
        <button onClick={handleOpenCreate} className={`${currentTheme.buttonBg} flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors`}>
          <Plus className="w-5 h-5" />Novo Usuário
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg ${currentTheme.searchBg} ${currentTheme.mainText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      </div>

      <div className={currentTheme.tableContainerBg}>
        {loading ? (
          <div className="p-8 text-center"><div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div><p className={`mt-2 ${currentTheme.cardText}`}>Carregando...</p></div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : filteredUsers.length === 0 ? (
          <div className={`p-8 text-center ${currentTheme.cardText}`}>Nenhum usuário encontrado</div>
        ) : (
          <table className="w-full">
            <thead className={currentTheme.tableHeadBg}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Papel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className={currentTheme.tableRowHover}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className={`h-10 w-10 ${currentTheme.name === 'Escuro' ? 'bg-indigo-900' : 'bg-indigo-100'} rounded-full flex items-center justify-center`}>
                        <UserIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="ml-4">
                        <div className={`text-sm font-medium ${currentTheme.mainText}`}>{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.tableRowText}`}>{user.email}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${currentTheme.tableRowText}`}>
                    {user.company?.name ? (
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1" />
                        {user.company.name}
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)} flex items-center gap-1 w-fit`}>
                      {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}{user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>{user.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button onClick={() => handleOpenEdit(user)} className="text-blue-600 hover:text-blue-900 mr-3" title="Editar"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-900" title="Deletar"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className={`${currentTheme.cardBg} ${currentTheme.name === 'Escuro' ? 'bg-opacity-100' : ''} rounded-lg shadow-xl max-w-md w-full border ${currentTheme.cardBorder} max-h-[90vh] overflow-y-auto`}>
            <div className={`flex justify-between items-center p-6 border-b ${currentTheme.name === 'Escuro' ? 'border-gray-700 bg-gray-900' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-semibold ${currentTheme.mainText}`}>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className={`p-6 ${currentTheme.name === 'Escuro' ? 'bg-gray-900' : ''}`}>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.cardText} mb-1`}>Nome *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${currentTheme.searchBg} ${currentTheme.mainText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.cardText} mb-1`}>Email *</label>
                  <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${currentTheme.searchBg} ${currentTheme.mainText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.cardText} mb-1`}>Senha {editingUser ? '(deixe vazio para manter)' : '*'}</label>
                  <input type="password" required={!editingUser} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`w-full px-3 py-2 rounded-lg ${currentTheme.searchBg} ${currentTheme.mainText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.cardText} mb-1`}>Papel *</label>
                  <select required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-lg ${currentTheme.searchBg} ${currentTheme.mainText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="USER">Usuário</option><option value="RECRUITER">Recrutador</option><option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.cardText} mb-1`}>Status *</label>
                  <select required value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={`w-full px-3 py-2 rounded-lg ${currentTheme.searchBg} ${currentTheme.mainText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="ACTIVE">Ativo</option><option value="INACTIVE">Inativo</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${currentTheme.cardText} mb-1`}>ID da Empresa</label>
                  <input type="text" value={formData.companyId} onChange={(e) => setFormData({ ...formData, companyId: e.target.value })} placeholder="UUID da empresa (opcional)"
                    className={`w-full px-3 py-2 rounded-lg ${currentTheme.searchBg} ${currentTheme.mainText} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                </div>
              </div>
              {formError && <div className="text-red-600 text-sm mt-4">{formError}</div>}
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={handleCloseModal} className={`px-4 py-2 ${currentTheme.cardText} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg`}>Cancelar</button>
                <button type="submit" disabled={formLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50">{formLoading ? 'Salvando...' : editingUser ? 'Atualizar' : 'Criar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
