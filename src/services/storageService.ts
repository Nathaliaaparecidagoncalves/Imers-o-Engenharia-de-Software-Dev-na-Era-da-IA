/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DEFAULT_CATEGORIES, GoalFormData, StudyGoal } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';
const INITIALIZED_KEY = 'studyflow_initialized_v1';
const CATEGORIES_KEY = 'studyflow_custom_categories_v1';

function getFutureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

// Dados iniciais acolhedores categorizados para estudantes iniciantes
export const INITIAL_SAMPLE_GOALS: StudyGoal[] = [
  {
    id: 'sample-goal-1',
    titulo: 'Compreender variáveis e estruturas condicionais',
    descricao: 'Resolver 5 exercícios práticos de if/else e criar um pequeno script interativo.',
    prazo: getFutureDate(3),
    status: 'em_andamento',
    categoria: 'Programação',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'sample-goal-2',
    titulo: 'Praticar 20 minutos de vocabulário e conversação básica',
    descricao: 'Revisar verbos no passado simples e praticar pronúncia com áudios curtos.',
    prazo: getFutureDate(5),
    status: 'em_andamento',
    categoria: 'Idiomas',
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'sample-goal-3',
    titulo: 'Revisar operações com frações e regra de três simples',
    descricao: 'Fazer 10 exercícios práticos com passo a passo para fixar a base matemática.',
    prazo: getFutureDate(8),
    status: 'nao_iniciado',
    categoria: 'Matemática',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
  {
    id: 'sample-goal-4',
    titulo: 'Configurar o ambiente de desenvolvimento (VS Code e Git)',
    descricao: 'Instalar extensões essenciais e fazer o primeiro commit no repositório pessoal.',
    prazo: getFutureDate(-1),
    status: 'concluido',
    categoria: 'Programação',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 1,
  },
];

class StorageService {
  /**
   * Obtém todos os objetivos de estudo do localStorage, garantindo retrocompatibilidade
   */
  public getGoals(): StudyGoal[] {
    try {
      const isInitialized = localStorage.getItem(INITIALIZED_KEY);
      const data = localStorage.getItem(STORAGE_KEY);

      if (!isInitialized && !data) {
        // Primeira visita: semeia exemplos amigáveis
        this.saveGoals(INITIAL_SAMPLE_GOALS);
        localStorage.setItem(INITIALIZED_KEY, 'true');
        return INITIAL_SAMPLE_GOALS;
      }

      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          // Garante que cada objetivo tenha o campo categoria
          return parsed.map((item) => ({
            ...item,
            categoria: item.categoria?.trim() ? item.categoria.trim() : 'Geral',
          }));
        }
      }
      return [];
    } catch (error) {
      console.error('[StudyFlow] Erro ao carregar dados do localStorage:', error);
      return [];
    }
  }

  /**
   * Salva a lista completa de objetivos no localStorage
   */
  public saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      localStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('[StudyFlow] Erro ao salvar dados no localStorage:', error);
    }
  }

  /**
   * Cadastra um novo objetivo
   */
  public createGoal(data: GoalFormData): StudyGoal {
    const goals = this.getGoals();
    const finalCategory = data.categoria?.trim() || 'Geral';

    // Se for uma categoria nova, garante que ela entre na lista de categorias salvas
    this.addCategory(finalCategory);

    const newGoal: StudyGoal = {
      id: 'goal_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      titulo: data.titulo.trim(),
      descricao: data.descricao.trim(),
      prazo: data.prazo,
      status: data.status,
      categoria: finalCategory,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const updatedList = [newGoal, ...goals];
    this.saveGoals(updatedList);
    return newGoal;
  }

  /**
   * Edita um objetivo existente
   */
  public updateGoal(id: string, data: Partial<GoalFormData>): StudyGoal | null {
    const goals = this.getGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    if (data.categoria?.trim()) {
      this.addCategory(data.categoria.trim());
    }

    const current = goals[index];
    const updated: StudyGoal = {
      ...current,
      ...(data.titulo !== undefined ? { titulo: data.titulo.trim() } : {}),
      ...(data.descricao !== undefined ? { descricao: data.descricao.trim() } : {}),
      ...(data.prazo !== undefined ? { prazo: data.prazo } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.categoria !== undefined ? { categoria: data.categoria.trim() || 'Geral' } : {}),
      updatedAt: Date.now(),
    };

    goals[index] = updated;
    this.saveGoals(goals);
    return updated;
  }

  /**
   * Exclui um objetivo pelo ID
   */
  public deleteGoal(id: string): boolean {
    const goals = this.getGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length !== goals.length) {
      this.saveGoals(filtered);
      return true;
    }
    return false;
  }

  /**
   * Obtém a lista de categorias editáveis do usuário
   */
  public getCategories(): string[] {
    try {
      const data = localStorage.getItem(CATEGORIES_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }

      // Se não houver categorias salvas, extrai das metas existentes + padrões
      const goals = this.getGoals();
      const fromGoals = goals.map((g) => g.categoria?.trim()).filter(Boolean);
      const combined = Array.from(new Set([...DEFAULT_CATEGORIES, ...fromGoals]));
      this.saveCategories(combined);
      return combined;
    } catch {
      return [...DEFAULT_CATEGORIES];
    }
  }

  /**
   * Salva a lista de categorias no localStorage
   */
  public saveCategories(categories: string[]): void {
    try {
      const cleaned = Array.from(new Set(categories.map((c) => c.trim()).filter(Boolean)));
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(cleaned));
    } catch (error) {
      console.error('[StudyFlow] Erro ao salvar categorias:', error);
    }
  }

  /**
   * Adiciona uma nova categoria se ainda não existir
   */
  public addCategory(name: string): boolean {
    const trimmed = name.trim();
    if (!trimmed) return false;

    const categories = this.getCategories();
    const exists = categories.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (exists) return false;

    const updated = [...categories, trimmed];
    this.saveCategories(updated);
    return true;
  }

  /**
   * Renomeia uma categoria existente e atualiza todos os objetivos vinculados
   */
  public renameCategory(oldName: string, newName: string): { success: boolean; affectedGoals: number } {
    const trimmedOld = oldName.trim();
    const trimmedNew = newName.trim();

    if (!trimmedOld || !trimmedNew || trimmedOld.toLowerCase() === trimmedNew.toLowerCase()) {
      return { success: false, affectedGoals: 0 };
    }

    const categories = this.getCategories();
    const catIndex = categories.findIndex((c) => c.toLowerCase() === trimmedOld.toLowerCase());
    if (catIndex === -1) {
      return { success: false, affectedGoals: 0 };
    }

    // Atualiza na lista de categorias
    categories[catIndex] = trimmedNew;
    // Remove duplicatas caso o novo nome já existisse
    const uniqueCategories = Array.from(
      new Map(categories.map((c) => [c.toLowerCase(), c])).values()
    );
    this.saveCategories(uniqueCategories);

    // Atualiza em todos os objetivos vinculados
    const goals = this.getGoals();
    let affectedCount = 0;
    const updatedGoals = goals.map((goal) => {
      if ((goal.categoria || 'Geral').toLowerCase() === trimmedOld.toLowerCase()) {
        affectedCount++;
        return {
          ...goal,
          categoria: trimmedNew,
          updatedAt: Date.now(),
        };
      }
      return goal;
    });

    if (affectedCount > 0) {
      this.saveGoals(updatedGoals);
    }

    return { success: true, affectedGoals: affectedCount };
  }

  /**
   * Exclui uma categoria e migra os objetivos que pertenciam a ela para uma categoria de fallback (ex: 'Geral')
   */
  public deleteCategory(name: string, fallback: string = 'Geral'): { success: boolean; affectedGoals: number } {
    const trimmed = name.trim();
    if (!trimmed) return { success: false, affectedGoals: 0 };

    const categories = this.getCategories();
    const updatedCategories = categories.filter((c) => c.toLowerCase() !== trimmed.toLowerCase());

    // Garante que a categoria de fallback exista caso ainda não esteja na lista
    if (!updatedCategories.some((c) => c.toLowerCase() === fallback.toLowerCase())) {
      updatedCategories.push(fallback);
    }

    this.saveCategories(updatedCategories);

    // Migra objetivos associados
    const goals = this.getGoals();
    let affectedCount = 0;
    const updatedGoals = goals.map((goal) => {
      if ((goal.categoria || 'Geral').toLowerCase() === trimmed.toLowerCase()) {
        affectedCount++;
        return {
          ...goal,
          categoria: fallback,
          updatedAt: Date.now(),
        };
      }
      return goal;
    });

    if (affectedCount > 0) {
      this.saveGoals(updatedGoals);
    }

    return { success: true, affectedGoals: affectedCount };
  }

  /**
   * Restaura as categorias padrão iniciais
   */
  public resetCategories(): string[] {
    this.saveCategories([...DEFAULT_CATEGORIES]);
    return [...DEFAULT_CATEGORIES];
  }

  /**
   * Restaura os exemplos iniciais para fins didáticos
   */
  public restoreSampleGoals(): StudyGoal[] {
    this.saveGoals(INITIAL_SAMPLE_GOALS);
    this.saveCategories([...DEFAULT_CATEGORIES]);
    return INITIAL_SAMPLE_GOALS;
  }

  /**
   * Limpa todos os objetivos
   */
  public clearAll(): void {
    this.saveGoals([]);
  }
}

export const storageService = new StorageService();
