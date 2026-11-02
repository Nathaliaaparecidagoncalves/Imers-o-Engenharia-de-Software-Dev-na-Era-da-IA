/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Check, Tag, RotateCcw, AlertCircle, BookOpen } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  goals: StudyGoal[];
  onAddCategory: (name: string) => boolean;
  onRenameCategory: (oldName: string, newName: string) => { success: boolean; affectedGoals: number };
  onDeleteCategory: (name: string) => { success: boolean; affectedGoals: number };
  onResetToDefault: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
  categories,
  goals,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onResetToDefault,
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmDeleteCat, setConfirmDeleteCat] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setErrorMsg('Digite um nome para a categoria.');
      return;
    }

    if (categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg('Essa categoria já existe na sua lista.');
      return;
    }

    const ok = onAddCategory(trimmed);
    if (ok) {
      setNewCategoryName('');
      setErrorMsg(null);
    }
  };

  const startEditing = (cat: string) => {
    setEditingCategory(cat);
    setEditedName(cat);
    setErrorMsg(null);
    setConfirmDeleteCat(null);
  };

  const handleSaveRename = (oldName: string) => {
    setErrorMsg(null);
    const trimmed = editedName.trim();
    if (!trimmed) {
      setErrorMsg('O nome da categoria não pode ficar vazio.');
      return;
    }

    if (
      trimmed.toLowerCase() !== oldName.toLowerCase() &&
      categories.some((c) => c.toLowerCase() === trimmed.toLowerCase())
    ) {
      setErrorMsg('Já existe outra categoria com esse nome.');
      return;
    }

    const res = onRenameCategory(oldName, trimmed);
    if (res.success) {
      setEditingCategory(null);
      setEditedName('');
    }
  };

  const handleConfirmDelete = (cat: string) => {
    onDeleteCategory(cat);
    setConfirmDeleteCat(null);
  };

  // Sugestões rápidas por área de estudo
  const presetPacks: { label: string; items: string[] }[] = [
    { label: 'Tecnologia', items: ['Programação', 'Banco de Dados', 'DevOps', 'Design'] },
    { label: 'Ensino Médio / ENEM', items: ['Matemática', 'Física', 'Química', 'História', 'Redação'] },
    { label: 'Direito & Concursos', items: ['Direito Constitucional', 'Direito Administrativo', 'Português', 'Raciocínio Lógico'] },
    { label: 'Saúde & Biológicas', items: ['Anatomia', 'Fisiologia', 'Farmacologia', 'Bioquímica'] },
    { label: 'Idiomas', items: ['Inglês', 'Espanhol', 'Vocabulário', 'Gramática'] },
  ];

  const handleApplyPreset = (items: string[]) => {
    items.forEach((item) => {
      onAddCategory(item);
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-manager-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 id="category-manager-title" className="text-base font-bold text-slate-900">
                Gerenciar Categorias
              </h2>
              <p className="text-xs text-slate-500">
                Personalize as matérias e temas de acordo com seus estudos
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Fechar gerenciador de categorias"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Adicionar nova categoria */}
          <div>
            <label htmlFor="new-cat-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Criar nova categoria
            </label>
            <form onSubmit={handleAdd} className="flex gap-2">
              <input
                id="new-cat-input"
                type="text"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Ex: Direito Constitucional, Anatomia, Música..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </form>
            {errorMsg && (
              <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errorMsg}
              </p>
            )}
          </div>

          {/* Sugestões rápidas por área de estudo */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-800 block mb-1.5">
              Pacotes rápidos de matérias sugeridas:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presetPacks.map((pack) => (
                <button
                  key={pack.label}
                  type="button"
                  onClick={() => handleApplyPreset(pack.items)}
                  className="text-xs px-2.5 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded-lg transition-colors font-medium"
                  title={`Adicionar categorias de ${pack.label}`}
                >
                  + {pack.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Categorias Existentes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700">
                Categorias ativas ({categories.length})
              </span>
              <button
                type="button"
                onClick={onResetToDefault}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
                title="Restaurar categorias padrão"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Restaurar padrão</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">
                  Nenhuma categoria cadastrada. Adicione uma acima!
                </div>
              ) : (
                categories.map((cat) => {
                  const goalCount = goals.filter(
                    (g) => (g.categoria || 'Geral').toLowerCase() === cat.toLowerCase()
                  ).length;
                  const isEditingThis = editingCategory === cat;
                  const isConfirmingDelete = confirmDeleteCat === cat;

                  return (
                    <div
                      key={cat}
                      className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                    >
                      {isEditingThis ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="flex-1 px-2.5 py-1 text-sm border border-blue-400 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveRename(cat);
                              if (e.key === 'Escape') setEditingCategory(null);
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(cat)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-md"
                            title="Salvar novo nome"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded-md"
                            title="Cancelar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                          <span className="text-sm font-semibold text-slate-800 truncate">
                            {cat}
                          </span>
                          <span className="text-xs text-slate-400 shrink-0">
                            ({goalCount} {goalCount === 1 ? 'objetivo' : 'objetivos'})
                          </span>
                        </div>
                      )}

                      {!isEditingThis && (
                        <div className="flex items-center gap-1 shrink-0">
                          {isConfirmingDelete ? (
                            <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-lg border border-rose-200">
                              <span className="text-[11px] font-medium text-rose-700 px-1">
                                Excluir?
                              </span>
                              <button
                                type="button"
                                onClick={() => handleConfirmDelete(cat)}
                                className="px-2 py-0.5 bg-rose-600 text-white text-[11px] font-bold rounded hover:bg-rose-700"
                              >
                                Sim
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteCat(null)}
                                className="px-1.5 py-0.5 text-slate-600 text-[11px] hover:bg-slate-200 rounded"
                              >
                                Não
                              </button>
                            </div>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => startEditing(cat)}
                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Renomear categoria"
                                aria-label={`Renomear categoria ${cat}`}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteCat(cat)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Excluir categoria"
                                aria-label={`Excluir categoria ${cat}`}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Ao renomear uma categoria, todos os objetivos vinculados a ela são atualizados automaticamente.
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors shadow-2xs"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
};
