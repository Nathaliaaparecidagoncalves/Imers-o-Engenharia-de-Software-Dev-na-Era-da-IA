/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, Plus, FileText, Tag } from 'lucide-react';

interface HeaderProps {
  onOpenNewGoalModal: () => void;
  onOpenProductSpecs: () => void;
  onOpenCategoryManager: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewGoalModal,
  onOpenProductSpecs,
  onOpenCategoryManager,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                StudyFlow
              </span>
              <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">
                Iniciantes
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden md:block">
              Organize sua rotina de estudos sem sobrecarga
            </p>
          </div>
        </div>

        {/* Action Zone */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCategoryManager}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            title="Gerenciar e editar suas categorias de estudo"
          >
            <Tag className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Categorias</span>
          </button>

          <button
            type="button"
            onClick={onOpenProductSpecs}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            title="Ver documentação do produto (Problema, Público, Requisitos e Critérios de Teste)"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Visão do Produto</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewGoalModal}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs hover:shadow transition-all focus:ring-2 focus:ring-blue-500/30"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Objetivo</span>
          </button>
        </div>
      </div>
    </header>
  );
};
