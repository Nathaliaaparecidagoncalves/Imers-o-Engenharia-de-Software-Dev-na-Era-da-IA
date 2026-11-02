/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  titulo: string;
  descricao: string;
  prazo: string; // Formato YYYY-MM-DD
  status: GoalStatus;
  categoria: string; // Ex: Programação, Idiomas, Matemática
  createdAt: number;
  updatedAt: number;
}

export type GoalFilter = 'todos' | GoalStatus;

export type GoalSortOption = 'prazo_asc' | 'prazo_desc' | 'recentes' | 'alfabetica';

export interface GoalFormData {
  titulo: string;
  descricao: string;
  prazo: string;
  status: GoalStatus;
  categoria: string;
}

export const DEFAULT_CATEGORIES: string[] = [
  'Programação',
  'Idiomas',
  'Matemática',
  'Geral',
  'Ciências',
  'Concursos',
];

export const STATUS_CONFIG: Record<
  GoalStatus,
  {
    label: string;
    description: string;
    badgeBg: string;
    badgeText: string;
    borderColor: string;
    accentColor: string;
  }
> = {
  nao_iniciado: {
    label: 'Não iniciado',
    description: 'Planejado para começar em breve',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    borderColor: 'border-slate-300',
    accentColor: '#64748B',
  },
  em_andamento: {
    label: 'Em andamento',
    description: 'Estudo em progresso ativo',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    borderColor: 'border-amber-300',
    accentColor: '#D97706',
  },
  concluido: {
    label: 'Concluído',
    description: 'Objetivo alcançado com sucesso',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    borderColor: 'border-emerald-300',
    accentColor: '#059669',
  },
};
