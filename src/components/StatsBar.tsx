/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Target, Clock, CheckCircle2, CircleDashed } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface StatsBarProps {
  goals: StudyGoal[];
}

export const StatsBar: React.FC<StatsBarProps> = ({ goals }) => {
  const total = goals.length;
  const naoIniciados = goals.filter((g) => g.status === 'nao_iniciado').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;

  const percentConcluido = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Resumo dos Seus Estudos
          </h2>
          <p className="text-xs text-slate-500">
            Acompanhe seu ritmo de aprendizado com passos gerenciáveis
          </p>
        </div>

        {total > 0 && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 px-3.5 py-1.5 rounded-xl">
            <div className="text-right">
              <span className="text-xs text-slate-500">Progresso geral</span>
              <div className="text-sm font-bold text-slate-800 tabular-nums">
                {percentConcluido}%
              </div>
            </div>
            <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-500 rounded-full"
                style={{ width: `${percentConcluido}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Grid de Contadores de Objetivos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xl font-bold text-slate-900 tabular-nums">
              {total}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Total cadastrado
            </span>
          </div>
        </div>

        {/* Não Iniciados */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-slate-200/70 text-slate-600 flex items-center justify-center shrink-0">
            <CircleDashed className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xl font-bold text-slate-900 tabular-nums">
              {naoIniciados}
            </span>
            <span className="text-xs font-medium text-slate-500">
              Não iniciados
            </span>
          </div>
        </div>

        {/* Em Andamento */}
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xl font-bold text-amber-900 tabular-nums">
              {emAndamento}
            </span>
            <span className="text-xs font-medium text-amber-700">
              Em andamento
            </span>
          </div>
        </div>

        {/* Concluídos */}
        <div className="bg-emerald-50/60 border border-emerald-200/60 rounded-xl p-3.5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xl font-bold text-emerald-900 tabular-nums">
              {concluidos}
            </span>
            <span className="text-xs font-medium text-emerald-700">
              Concluídos
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
