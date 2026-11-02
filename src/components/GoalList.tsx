/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { GoalFilter, GoalSortOption, GoalStatus, StudyGoal } from '../types/goal';
import { GoalCard } from './GoalCard';
import { GoalFilterBar } from './GoalFilterBar';
import { EmptyState } from './EmptyState';

interface GoalListProps {
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
  onEdit: (goal: StudyGoal) => void;
  onDeleteRequest: (goal: StudyGoal) => void;
  onStatusChange: (goalId: string, newStatus: GoalStatus) => void;
  onOpenNewGoal: () => void;
  onRestoreSamples: () => void;
  onOpenCategoryManager: () => void;
}

export const GoalList: React.FC<GoalListProps> = ({
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
  onEdit,
  onDeleteRequest,
  onStatusChange,
  onOpenNewGoal,
  onRestoreSamples,
  onOpenCategoryManager,
}) => {
  // Filtragem e busca combinando Status, Categoria e Texto
  const filteredGoals = useMemo(() => {
    let result = [...goals];

    // Filtro por status
    if (activeFilter !== 'todos') {
      result = result.filter((g) => g.status === activeFilter);
    }

    // Filtro por categoria
    if (selectedCategory !== 'todas') {
      result = result.filter(
        (g) => (g.categoria || 'Geral').toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Busca textual
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.titulo.toLowerCase().includes(q) ||
          g.descricao.toLowerCase().includes(q) ||
          (g.categoria || '').toLowerCase().includes(q)
      );
    }

    // Ordenação
    result.sort((a, b) => {
      switch (sortBy) {
        case 'prazo_asc':
          return (a.prazo || '').localeCompare(b.prazo || '');
        case 'prazo_desc':
          return (b.prazo || '').localeCompare(a.prazo || '');
        case 'alfabetica':
          return a.titulo.localeCompare(b.titulo);
        case 'recentes':
        default:
          return b.createdAt - a.createdAt;
      }
    });

    return result;
  }, [goals, activeFilter, selectedCategory, searchQuery, sortBy]);

  const hasAnyGoals = goals.length > 0;
  const isFiltered = hasAnyGoals && filteredGoals.length === 0;

  const handleClearFilters = () => {
    onFilterChange('todos');
    onCategoryChange('todas');
    onSearchChange('');
  };

  return (
    <div className="space-y-6">
      {/* Controles de Busca, Categoria e Filtro */}
      {hasAnyGoals && (
        <GoalFilterBar
          goals={goals}
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
          availableCategories={availableCategories}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          sortBy={sortBy}
          onSortChange={onSortChange}
          onOpenCategoryManager={onOpenCategoryManager}
        />
      )}

      {/* Grid de Cartões ou Estado Vazio */}
      {filteredGoals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={onEdit}
              onDeleteRequest={onDeleteRequest}
              onStatusChange={onStatusChange}
              onSelectCategory={onCategoryChange}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          isFiltered={isFiltered}
          onOpenNewGoal={onOpenNewGoal}
          onClearFilter={handleClearFilters}
          onRestoreSamples={onRestoreSamples}
        />
      )}
    </div>
  );
};
