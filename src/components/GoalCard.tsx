/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Calendar, Edit3, Trash2, CheckCircle2, Clock, CircleDashed, Tag } from 'lucide-react';
import { GoalStatus, STATUS_CONFIG, StudyGoal } from '../types/goal';
import { formatDeadlineDate, getDeadlineRelativeStatus } from '../utils/dateUtils';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onDeleteRequest: (goal: StudyGoal) => void;
  onStatusChange: (goalId: string, newStatus: GoalStatus) => void;
  onSelectCategory?: (category: string) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
  onSelectCategory,
}) => {
  const isConcluded = goal.status === 'concluido';
  const statusInfo = STATUS_CONFIG[goal.status];
  const relativeDeadline = getDeadlineRelativeStatus(goal.prazo, isConcluded);
  const categoria = goal.categoria || 'Geral';

  const getStatusIcon = (status: GoalStatus) => {
    switch (status) {
      case 'concluido':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'em_andamento':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'nao_iniciado':
      default:
        return <CircleDashed className="w-4 h-4 text-slate-500" />;
    }
  };

  const getDeadlineBadgeClasses = () => {
    if (isConcluded) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
    }
    switch (relativeDeadline.tone) {
      case 'overdue':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'today':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'upcoming':
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <article
      className={`group relative bg-white rounded-2xl border transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
        isConcluded
          ? 'border-emerald-200/80 bg-linear-to-b from-white to-emerald-50/20'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="p-5">
        {/* Top bar do cartão: Status & Ações */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Seletor rápido de status */}
          <div className="relative inline-flex items-center">
            <label htmlFor={`status-select-${goal.id}`} className="sr-only">
              Alterar status de {goal.titulo}
            </label>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border ${statusInfo.badgeBg} ${statusInfo.badgeText} ${statusInfo.borderColor}`}
            >
              {getStatusIcon(goal.status)}
              <select
                id={`status-select-${goal.id}`}
                value={goal.status}
                onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
                className="bg-transparent font-medium cursor-pointer focus:outline-none pr-1"
                title="Clique para alterar rapidamente o status"
              >
                <option value="nao_iniciado">Não iniciado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(goal)}
              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Editar objetivo"
              aria-label={`Editar objetivo ${goal.titulo}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDeleteRequest(goal)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Excluir objetivo (solicitará confirmação)"
              aria-label={`Excluir objetivo ${goal.titulo}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Linha de Categoria (clicável para filtrar rapidamente) */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1.5 font-medium">
          <Tag className="w-3.5 h-3.5 text-blue-500" />
          {onSelectCategory ? (
            <button
              type="button"
              onClick={() => onSelectCategory(categoria)}
              className="text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors"
              title={`Filtrar objetivos pela categoria "${categoria}"`}
            >
              {categoria}
            </button>
          ) : (
            <span className="text-blue-600 font-semibold">{categoria}</span>
          )}
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-semibold leading-snug tracking-tight mb-2 ${
            isConcluded ? 'text-slate-700 line-through decoration-emerald-500/50' : 'text-slate-900'
          }`}
        >
          {goal.titulo}
        </h3>

        {/* Descrição */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4 whitespace-pre-line line-clamp-3">
          {goal.descricao || 'Sem descrição detalhada fornecida.'}
        </p>
      </div>

      {/* Rodapé do cartão: Prazo e indicador de tempo */}
      <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 rounded-b-2xl flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDeadlineDate(goal.prazo)}</span>
        </div>

        <span
          className={`px-2 py-0.5 rounded-md font-medium border text-[11px] ${getDeadlineBadgeClasses()}`}
        >
          {relativeDeadline.label}
        </span>
      </div>
    </article>
  );
};
