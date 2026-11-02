/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { GoalList } from './components/GoalList';
import { GoalFormModal } from './components/GoalFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CategoryManagerModal } from './components/CategoryManagerModal';
import { ProductSpecsModal } from './components/ProductSpecsModal';
import { storageService } from './services/storageService';
import { GoalFilter, GoalFormData, GoalSortOption, GoalStatus, StudyGoal } from './types/goal';
import { Check, Sparkles } from 'lucide-react';

export default function App() {
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<GoalFilter>('todos');
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<GoalSortOption>('prazo_asc');

  // Modais
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<StudyGoal | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<StudyGoal | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSpecsModalOpen, setIsSpecsModalOpen] = useState(false);

  // Feedback Toast temporário
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  };

  // Carrega os objetivos e as categorias personalizadas do localStorage
  useEffect(() => {
    const loadedGoals = storageService.getGoals();
    const loadedCategories = storageService.getCategories();
    setGoals(loadedGoals);
    setCategories(loadedCategories);
  }, []);

  // Handlers de formulário (criação e edição de objetivos)
  const handleOpenCreateModal = () => {
    setGoalToEdit(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (goal: StudyGoal) => {
    setGoalToEdit(goal);
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setGoalToEdit(null);
  };

  const handleFormSubmit = (data: GoalFormData) => {
    if (goalToEdit) {
      // Edição
      const updated = storageService.updateGoal(goalToEdit.id, data);
      if (updated) {
        setGoals((prev) =>
          prev.map((g) => (g.id === goalToEdit.id ? updated : g))
        );
        // Atualiza a lista de categorias caso tenha sido adicionada uma nova
        setCategories(storageService.getCategories());
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      // Novo cadastro
      const created = storageService.createGoal(data);
      setGoals((prev) => [created, ...prev]);
      // Atualiza a lista de categorias caso tenha sido adicionada uma nova
      setCategories(storageService.getCategories());
      showToast('Novo objetivo cadastrado com sucesso!');
    }
    handleCloseFormModal();
  };

  // Handlers de exclusão de objetivo
  const handleRequestDelete = (goal: StudyGoal) => {
    setGoalToDelete(goal);
    setIsDeleteModalOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setGoalToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (!goalToDelete) return;

    const success = storageService.deleteGoal(goalToDelete.id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
      showToast('Objetivo excluído com sucesso.');
    }
    handleCancelDelete();
  };

  // Mudança rápida de status no próprio cartão
  const handleStatusChange = (goalId: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(goalId, { status: newStatus });
    if (updated) {
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? updated : g))
      );
      if (newStatus === 'concluido') {
        showToast('Parabéns! Mais um objetivo concluído 🎉');
      } else {
        showToast('Status atualizado.');
      }
    }
  };

  // Handlers do Gerenciador de Categorias
  const handleAddCategory = (name: string): boolean => {
    const success = storageService.addCategory(name);
    if (success) {
      setCategories(storageService.getCategories());
      showToast(`Categoria "${name}" adicionada!`);
      return true;
    }
    return false;
  };

  const handleRenameCategory = (
    oldName: string,
    newName: string
  ): { success: boolean; affectedGoals: number } => {
    const res = storageService.renameCategory(oldName, newName);
    if (res.success) {
      setCategories(storageService.getCategories());
      setGoals(storageService.getGoals());

      // Se o filtro ativo era a categoria antiga, atualiza para a nova
      if (selectedCategory.toLowerCase() === oldName.toLowerCase()) {
        setSelectedCategory(newName);
      }

      const msg =
        res.affectedGoals > 0
          ? `Categoria renomeada para "${newName}". ${res.affectedGoals} objetivos foram atualizados.`
          : `Categoria renomeada para "${newName}".`;
      showToast(msg);
    }
    return res;
  };

  const handleDeleteCategory = (
    name: string
  ): { success: boolean; affectedGoals: number } => {
    const res = storageService.deleteCategory(name, 'Geral');
    if (res.success) {
      setCategories(storageService.getCategories());
      setGoals(storageService.getGoals());

      // Se o filtro ativo foi deletado, volta para 'todas'
      if (selectedCategory.toLowerCase() === name.toLowerCase()) {
        setSelectedCategory('todas');
      }

      const msg =
        res.affectedGoals > 0
          ? `Categoria removida. ${res.affectedGoals} objetivos foram movidos para "Geral".`
          : `Categoria "${name}" removida.`;
      showToast(msg);
    }
    return res;
  };

  const handleResetCategories = () => {
    const defaults = storageService.resetCategories();
    setCategories(defaults);
    showToast('Categorias padrão restauradas.');
  };

  // Restauração de exemplos
  const handleRestoreSamples = () => {
    const samples = storageService.restoreSampleGoals();
    setGoals(samples);
    setCategories(storageService.getCategories());
    setSelectedCategory('todas');
    setActiveFilter('todos');
    showToast('Exemplos de objetivos carregados!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      {/* Header com Navegação, Atalho para Categorias e Visão de Produto */}
      <Header
        onOpenNewGoalModal={handleOpenCreateModal}
        onOpenProductSpecs={() => setIsSpecsModalOpen(true)}
        onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        {/* Banner acolhedor de boas-vindas para iniciantes */}
        <section className="bg-linear-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-blue-100 text-xs font-semibold mb-3 backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              Ambiente de Estudos Personalizável
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
              Transforme grandes intenções em passos simples.
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed mb-5">
              Organize seus estudos pelas matérias que você realmente precisa aprender — edite, adicione ou remova categorias livremente. Seus dados e matérias ficam salvos no navegador.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors"
              >
                + Cadastrar Objetivo
              </button>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-xl border border-white/20 transition-colors"
              >
                Personalizar Categorias
              </button>
            </div>
          </div>
        </section>

        {/* Estatísticas e Quantidade de Objetivos */}
        <StatsBar goals={goals} />

        {/* Lista de Objetivos com Filtros por Status e Categoria, Busca e Cartões */}
        <section aria-label="Lista de objetivos de estudo">
          <GoalList
            goals={goals}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            availableCategories={categories}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onEdit={handleOpenEditModal}
            onDeleteRequest={handleRequestDelete}
            onStatusChange={handleStatusChange}
            onOpenNewGoal={handleOpenCreateModal}
            onRestoreSamples={handleRestoreSamples}
            onOpenCategoryManager={() => setIsCategoryModalOpen(true)}
          />
        </section>
      </main>

      {/* Footer simples e acolhedor */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            <strong>StudyFlow</strong> · Planejamento educacional para estudantes iniciantes.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="hover:text-blue-600 transition-colors"
            >
              Gerenciar Categorias
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setIsSpecsModalOpen(true)}
              className="hover:text-blue-600 transition-colors"
            >
              Visão de Produto & Requisitos
            </button>
            <span>·</span>
            <span>Armazenamento local (localStorage)</span>
          </div>
        </div>
      </footer>

      {/* Modal de Cadastro / Edição de Objetivo */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        goalToEdit={goalToEdit}
        existingCategories={categories}
        onOpenCategoryManager={() => {
          setIsCategoryModalOpen(true);
        }}
      />

      {/* Modal Gerenciador de Categorias Editáveis */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        goals={goals}
        onAddCategory={handleAddCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        onResetToDefault={handleResetCategories}
      />

      {/* Modal de Confirmação de Exclusão de Objetivo */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        goal={goalToDelete}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {/* Modal com a Documentação do Produto */}
      <ProductSpecsModal
        isOpen={isSpecsModalOpen}
        onClose={() => setIsSpecsModalOpen(false)}
      />

      {/* Toast Notificação de Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2.5 text-xs sm:text-sm animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
