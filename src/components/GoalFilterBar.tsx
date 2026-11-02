/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, ArrowUpDown, X, Tag, Filter, Settings2 } from 'lucide-react';
import { GoalFilter, GoalSortOption, StudyGoal } from '../types/goal';

interface GoalFilterBarProps {
  goals: StudyGoal[];
  activeFilter: GoalFilter;
  onFilterChange: (filter: GoalFilter) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  availableCategories: string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: GoalSortOption;
  onSortChange: (sort: GoalSortOption) => void;
  onOpenCategoryManager: () => void;
}

export const GoalFilterBar: React.FC<GoalFilterBarProps> = ({
  goals,
  activeFilter,
  onFilterChange,
  selectedCategory,
  onCategoryChange,
  availableCategories,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onOpenCategoryManager,
}) => {
  // Contadores por status
  const counts = {
    todos: goals.length,
    nao_iniciado: goals.filter((g) => g.status === 'nao_iniciado').length,
    em_andamento: goals.filter((g) => g.status === 'em_andamento').length,
    concluido: goals.filter((g) => g.status === 'concluido').length,
  };

  const filterTabs: { id: GoalFilter; label: string; count: number }[] = [
    { id: 'todos', label: 'Todos', count: counts.todos },
    { id: 'nao_iniciado', label: 'Não iniciados', count: counts.nao_iniciado },
    { id: 'em_andamento', label: 'Em andamento', count: counts.em_andamento },
    { id: 'concluido', label: 'Concluídos', count: counts.concluido },
  ];

  return (
    <div className="space-y-3">
      {/* Linha 1: Busca, Categoria e Ordenação */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Campo de Busca */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título, matéria ou descrição..."
            className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filtro por Categoria (Select) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <label htmlFor="category-select" className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Categoria:</span>
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={`px-3 py-2 rounded-xl border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-2xs ${
              selectedCategory !== 'todas'
                ? 'border-blue-300 bg-blue-50/50 text-blue-900 font-semibold'
                : 'border-slate-200 bg-white text-slate-800'
            }`}
          >
            <option value="todas">Todas as categorias</option>
            {availableCategories.map((cat) => {
              const countForCat = goals.filter(
                (g) => (g.categoria || 'Geral').toLowerCase() === cat.toLowerCase()
              ).length;
              return (
                <option key={cat} value={cat}>
                  {cat} ({countForCat})
                </option>
              );
            })}
          </select>

          {selectedCategory !== 'todas' && (
            <button
              type="button"
              onClick={() => onCategoryChange('todas')}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Limpar filtro de categoria"
              aria-label="Limpar filtro de categoria"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-1.5 shrink-0">
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Ordenar:</span>
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as GoalSortOption)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-2xs"
          >
            <option value="prazo_asc">Prazo: Mais próximo primeiro</option>
            <option value="prazo_desc">Prazo: Mais distante primeiro</option>
            <option value="recentes">Data de criação: Mais recentes</option>
            <option value="alfabetica">Ordem alfabética (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Linha 2: Segmented Controls de Status + Chips de Categoria com Botão de Gerenciamento */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl overflow-x-auto">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/40'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-md tabular-nums ${
                    isActive
                      ? 'bg-slate-100 text-slate-800 font-bold'
                      : 'bg-slate-300/50 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Chips de Categoria + Botão Gerenciar Categorias */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-[11px] font-medium text-slate-500 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Matérias:
          </span>
          <button
            type="button"
            onClick={() => onCategoryChange('todas')}
            className={`text-xs px-2.5 py-1 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              selectedCategory === 'todas'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            Todas
          </button>
          {availableCategories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-blue-600 text-white font-semibold shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}

          {/* Botão de Edição/Gerenciamento de Categorias */}
          <button
            type="button"
            onClick={onOpenCategoryManager}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-medium transition-colors whitespace-nowrap shrink-0 border border-slate-200/80"
            title="Editar, adicionar ou renomear categorias"
          >
            <Settings2 className="w-3 h-3 text-slate-500" />
            <span>Editar Categorias</span>
          </button>
        </div>
      </div>
    </div>
  );
};
