/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Plus, RotateCcw, Search } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewGoal: () => void;
  onClearFilter: () => void;
  onRestoreSamples: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewGoal,
  onClearFilter,
  onRestoreSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3.5">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
          Não encontramos nenhum objetivo correspondente aos filtros de status ou termo de busca selecionados.
        </p>
        <button
          type="button"
          onClick={onClearFilter}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <span>Limpar filtros e busca</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-14 text-center max-w-xl mx-auto shadow-xs">
      <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-7 h-7" />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Nenhum objetivo cadastrado ainda
      </h3>

      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6">
        Comece registrando o primeiro assunto que você deseja aprender. Estabelecer metas pequenas é o melhor caminho para construir o hábito de estudos!
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenNewGoal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>

        <button
          type="button"
          onClick={onRestoreSamples}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
          title="Carrega 3 exemplos práticos para você conhecer o sistema"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Carregar exemplos prontos</span>
        </button>
      </div>
    </div>
  );
};
