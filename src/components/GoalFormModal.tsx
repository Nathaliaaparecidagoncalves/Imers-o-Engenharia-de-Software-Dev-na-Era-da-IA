/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Calendar, CheckCircle2, Tag, Settings2 } from 'lucide-react';
import { DEFAULT_CATEGORIES, GoalFormData, GoalStatus, StudyGoal } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  goalToEdit: StudyGoal | null;
  existingCategories?: string[];
  onOpenCategoryManager?: () => void;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goalToEdit,
  existingCategories = [],
  onOpenCategoryManager,
}) => {
  const isEditing = !!goalToEdit;

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');
  const [categoria, setCategoria] = useState('');

  const [errors, setErrors] = useState<{
    titulo?: string;
    prazo?: string;
    categoria?: string;
  }>({});

  // Lista combinada de categorias sugeridas sem duplicatas
  const suggestedCategories = Array.from(
    new Set([...existingCategories.filter(Boolean), ...DEFAULT_CATEGORIES])
  );

  // Resetar ou preencher form ao abrir ou mudar goalToEdit
  useEffect(() => {
    if (goalToEdit) {
      setTitulo(goalToEdit.titulo);
      setDescricao(goalToEdit.descricao);
      setPrazo(goalToEdit.prazo);
      setStatus(goalToEdit.status);
      setCategoria(goalToEdit.categoria || (suggestedCategories[0] || 'Geral'));
    } else {
      // Data padrão: 7 dias à frente
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 7);
      const isoDate = defaultDate.toISOString().split('T')[0];

      setTitulo('');
      setDescricao('');
      setPrazo(isoDate);
      setStatus('nao_iniciado');
      setCategoria(suggestedCategories[0] || 'Geral');
    }
    setErrors({});
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { titulo?: string; prazo?: string; categoria?: string } = {};

    if (!titulo.trim()) {
      newErrors.titulo = 'Informe o título do seu objetivo de estudo.';
    } else if (titulo.trim().length < 3) {
      newErrors.titulo = 'O título deve ter no mínimo 3 caracteres.';
    }

    if (!prazo) {
      newErrors.prazo = 'Selecione uma data limite para o prazo.';
    }

    if (!categoria.trim()) {
      newErrors.categoria = 'Informe ou escolha uma categoria.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      prazo,
      status,
      categoria: categoria.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header do Modal */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 id="goal-modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Atualize as informações para refletir seu momento atual'
                : 'Defina o que você quer aprender de forma simples e realista'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Fechar formulário"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dica Pedagógica acolhedora para iniciantes */}
        <div className="px-6 pt-4 pb-1">
          <div className="flex items-start gap-2.5 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Dica pedagógica:</span> Categorizar seus objetivos ajuda a balancear diferentes matérias durante a semana sem cansar a mente com um único tópico.
            </div>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label htmlFor="goal-titulo" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-titulo"
              type="text"
              value={titulo}
              onChange={(e) => {
                setTitulo(e.target.value);
                if (errors.titulo) setErrors((prev) => ({ ...prev, titulo: undefined }));
              }}
              placeholder="Ex: Aprender laços for/while em JavaScript"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                errors.titulo ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500' : 'border-slate-300 focus:border-blue-500'
              }`}
            />
            {errors.titulo && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.titulo}
              </p>
            )}
          </div>

          {/* Campo Categoria (com sugestões e atalho de gerenciamento) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="goal-categoria" className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Categoria / Matéria</span> <span className="text-rose-500">*</span>
              </label>
              {onOpenCategoryManager && (
                <button
                  type="button"
                  onClick={onOpenCategoryManager}
                  className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  title="Editar ou criar novas categorias"
                >
                  <Settings2 className="w-3 h-3" />
                  <span>Gerenciar categorias</span>
                </button>
              )}
            </div>

            <div className="relative">
              <input
                id="goal-categoria"
                type="text"
                list="category-suggestions"
                value={categoria}
                onChange={(e) => {
                  setCategoria(e.target.value);
                  if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: undefined }));
                }}
                placeholder="Digite ou escolha uma matéria/categoria..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                  errors.categoria ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500' : 'border-slate-300 focus:border-blue-500'
                }`}
              />
              <datalist id="category-suggestions">
                {suggestedCategories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Sugestões rápidas das categorias ativas */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-slate-500 mr-1">Suas matérias:</span>
              {suggestedCategories.slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategoria(cat);
                    if (errors.categoria) setErrors((prev) => ({ ...prev, categoria: undefined }));
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    categoria.toLowerCase() === cat.toLowerCase()
                      ? 'bg-blue-50 text-blue-700 border-blue-300 font-medium'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {errors.categoria && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.categoria}
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="goal-descricao" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Descrição e plano de ação <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="goal-descricao"
              rows={3}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Assistir aulas 3 a 5, anotar dúvidas e resolver os 3 exercícios práticos do módulo."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
          </div>

          {/* Linha com Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prazo */}
            <div>
              <label htmlFor="goal-prazo" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Prazo limite <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="goal-prazo"
                  type="date"
                  value={prazo}
                  onChange={(e) => {
                    setPrazo(e.target.value);
                    if (errors.prazo) setErrors((prev) => ({ ...prev, prazo: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all ${
                    errors.prazo ? 'border-rose-300 bg-rose-50/20 focus:border-rose-500' : 'border-slate-300 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.prazo && (
                <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.prazo}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label htmlFor="goal-status" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status atual
              </label>
              <select
                id="goal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="nao_iniciado">Não iniciado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          {/* Rodapé com botões de ação */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all focus:ring-2 focus:ring-blue-500/30"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
