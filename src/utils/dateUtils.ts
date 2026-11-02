/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Formata a data ISO (YYYY-MM-DD) para formato legível em português brasileiro
 */
export function formatDeadlineDate(dateStr: string): string {
  if (!dateStr) return 'Sem prazo definido';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}

/**
 * Calcula a diferença em dias entre hoje e a data de prazo
 */
export function getDeadlineRelativeStatus(
  dateStr: string,
  isConcluded: boolean = false
): {
  label: string;
  tone: 'overdue' | 'today' | 'upcoming' | 'concluded';
} {
  if (isConcluded) {
    return { label: 'Concluído no prazo', tone: 'concluded' };
  }

  if (!dateStr) {
    return { label: 'Sem prazo', tone: 'upcoming' };
  }

  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const daysPast = Math.abs(diffDays);
      return {
        label: daysPast === 1 ? 'Venceu ontem' : `Venceu há ${daysPast} dias`,
        tone: 'overdue',
      };
    } else if (diffDays === 0) {
      return { label: 'Vence hoje', tone: 'today' };
    } else if (diffDays === 1) {
      return { label: 'Vence amanhã', tone: 'upcoming' };
    } else {
      return { label: `Faltam ${diffDays} dias`, tone: 'upcoming' };
    }
  } catch {
    return { label: 'Data válida', tone: 'upcoming' };
  }
}
