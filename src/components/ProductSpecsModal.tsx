/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Target, Users, CheckSquare, ClipboardCheck, BookOpen, Layers } from 'lucide-react';

interface ProductSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductSpecsModal: React.FC<ProductSpecsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'problema' | 'publico' | 'requisitos' | 'criterios'>('problema');

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="specs-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 id="specs-modal-title" className="text-base font-bold text-slate-900">
                Documentação de Produto · StudyFlow
              </h2>
              <p className="text-xs text-slate-500">
                Visão educacional e técnica da primeira versão (MVP)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Fechar documentação"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas */}
        <div className="px-6 pt-3 bg-slate-50/50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('problema')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'problema'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Problema
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('publico')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'publico'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Público Principal
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('requisitos')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'requisitos'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Requisitos Funcionais
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('criterios')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'criterios'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Critérios de Teste
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-700 leading-relaxed">
          {activeTab === 'problema' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <Target className="w-4 h-4" />
                <span>Problema que o aplicativo resolve</span>
              </div>
              <p>
                Estudantes iniciantes frequentemente enfrentam <strong>sobrecarga cognitiva</strong> e <strong>paralisia por excesso de conteúdos</strong> ao iniciar sua jornada de aprendizado. Sem uma estrutura simples, perdem a noção de prioridade, não conseguem estimar prazos realistas e desistem rapidamente por frustração ao usar ferramentas corporativas complexas (como Jira, Trello avançado ou Notion) cheias de menus desnecessários.
              </p>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">O StudyFlow resolve isso através de:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong>Foco absoluto:</strong> registro enxuto com título, categoria, descrição, prazo e status.</li>
                  <li><strong>Organização por tópicos:</strong> separação por matérias (ex: Programação, Idiomas, Matemática) para um estudo equilibrado.</li>
                  <li><strong>Redução de ansiedade:</strong> visual acolhedor, contagem clara de objetivos e prazos relativos transparentes.</li>
                  <li><strong>Sensação imediata de progresso:</strong> passagem de status simples e métricas visuais de objetivos concluídos.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'publico' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <Users className="w-4 h-4" />
                <span>Público Principal</span>
              </div>
              <p>
                <strong>Estudantes iniciantes</strong> em qualquer disciplina (programação, vestibulares, concursos, idiomas ou cursos profissionalizantes) que precisam organizar de maneira direta e visual aquilo que desejam aprender.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">Dores do estudante:</span>
                  <p className="text-slate-600">
                    Não saber por onde começar, misturar matérias sem organização, esquecer prazos de aulas/trabalhos e confundir metas abstratas com ações práticas.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">Necessidades atendidas:</span>
                  <p className="text-slate-600">
                    Interface intuitiva em português brasileiro, organização categorizada por assunto e retenção garantida de dados no navegador.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requisitos' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <CheckSquare className="w-4 h-4" />
                <span>Requisitos Funcionais Implementados</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 border border-slate-200 rounded-lg flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">RF01:</span>
                  <span><strong>Cadastrar objetivo com categoria:</strong> Permite cadastrar título, categoria (ex: Programação, Idiomas, Matemática), descrição, prazo (data) e status.</span>
                </div>
                <div className="p-2.5 border border-slate-200 rounded-lg flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">RF02:</span>
                  <span><strong>Visualizar e filtrar por categoria:</strong> Exibe a categoria nos cartões e permite filtrar a lista por qualquer categoria cadastrada ou ver todas.</span>
                </div>
                <div className="p-2.5 border border-slate-200 rounded-lg flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">RF03:</span>
                  <span><strong>Filtrar e ordenar:</strong> Filtros por status (Não iniciado, Em andamento, Concluído), busca em tempo real e múltiplos critérios de ordenação.</span>
                </div>
                <div className="p-2.5 border border-slate-200 rounded-lg flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">RF04:</span>
                  <span><strong>Editar objetivo:</strong> Permite alterar título, categoria, descrição, prazo e status a qualquer momento via modal dedicado.</span>
                </div>
                <div className="p-2.5 border border-slate-200 rounded-lg flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">RF05:</span>
                  <span><strong>Excluir com confirmação prévia:</strong> A exclusão só é efetivada após confirmação explícita do usuário em modal de segurança.</span>
                </div>
                <div className="p-2.5 border border-slate-200 rounded-lg flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">RF06:</span>
                  <span><strong>Exibir quantidade cadastrada:</strong> Apresenta contador global de objetivos e contadores específicos por status e categoria.</span>
                </div>
                <div className="p-2.5 border border-slate-200 rounded-lg flex items-start gap-2">
                  <span className="font-bold text-blue-600 shrink-0">RF07:</span>
                  <span><strong>Persistência local:</strong> Todos os dados e categorias são sincronizados no <code>localStorage</code> do navegador.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'criterios' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
                <ClipboardCheck className="w-4 h-4" />
                <span>Critérios para Testar a Versão Atualizada</span>
              </div>
              <p className="text-xs text-slate-600">
                Checklist de aceitação incluindo a nova funcionalidade de Categoria:
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">1. Teste de Cadastro com Categoria</span>
                  <span className="text-slate-600">
                    Clicar em "Novo Objetivo". Digitar um título, selecionar ou digitar a categoria "Idiomas", definir prazo e salvar. Verificar se o cartão exibe a etiqueta "Idiomas".
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">2. Teste de Filtro por Categoria</span>
                  <span className="text-slate-600">
                    No topo da lista, selecionar "Programação" no filtro de categorias ou clicar no chip rápido "Programação". Verificar se apenas os objetivos dessa categoria permanecem visíveis.
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">3. Teste de Limpeza de Filtro</span>
                  <span className="text-slate-600">
                    Clicar em "Todas" ou no botão de limpar categoria. Verificar se todos os objetivos voltam a ser exibidos normalmente.
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">4. Teste de Atalho no Próprio Cartão</span>
                  <span className="text-slate-600">
                    Clicar no nome da categoria dentro de um cartão. O filtro de categoria deve ser automaticamente ativado para aquela matéria específica.
                  </span>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="font-bold text-slate-900 block mb-0.5">5. Teste de Persistência das Categorias</span>
                  <span className="text-slate-600">
                    Cadastrar um objetivo com uma nova categoria personalizada (ex: "Música" ou "Design"), recarregar a página (F5) e confirmar que o objetivo e a categoria persistem no filtro.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Fechar Guia
          </button>
        </div>
      </div>
    </div>
  );
};
