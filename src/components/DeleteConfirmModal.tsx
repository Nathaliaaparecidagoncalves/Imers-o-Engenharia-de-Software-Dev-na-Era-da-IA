/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  goal: StudyGoal | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  goal,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen || !goal) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div className="flex-1">
            <h3 id="delete-modal-title" className="text-base font-bold text-slate-900">
              Confirmar exclusão
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Tem certeza de que deseja excluir o objetivo de estudo:
            </p>

            <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
              <span className="block text-sm font-semibold text-slate-800 break-words">
                "{goal.titulo}"
              </span>
              {goal.descricao && (
                <span className="block text-xs text-slate-500 mt-1 line-clamp-2">
                  {goal.descricao}
                </span>
              )}
            </div>

            <p className="text-xs text-rose-600 font-medium mt-2.5">
              Esta ação removerá o objetivo do seu armazenamento local e não poderá ser desfeita.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-all focus:ring-2 focus:ring-rose-500/30"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, excluir objetivo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
