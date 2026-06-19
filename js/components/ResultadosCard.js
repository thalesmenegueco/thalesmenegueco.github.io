// src/js/components/ResultadosCard.js
import { formatCurrency } from '../utils/formatters.js';

export class ResultadosCard {
  /**
   * @param {HTMLElement} container - O elemento DOM do painel lateral (#secao-resultados)
   * @param {Object} store - O gestor de estado central
   */
  constructor(container, store) {
    this.container = container;
    this.store = store;

    // 1. Mapeamento dos elementos onde os resultados serão injetados
    this.elCustoBanho = this.container.querySelector('#res-custo-banho');
    this.elCustoTotal = this.container.querySelector('#res-custo-total');
    this.elPrecoVenda = this.container.querySelector('#res-preco-venda');

    // 2. Subscrição (Observer)
    // Inscreve este componente para reagir sempre que o estado da aplicação mudar
    this.store.subscribe((state) => this.atualizarInterface(state));

    // 3. Renderização Inicial (Hidratação)
    this.atualizarInterface(this.store.getState());
  }

  /**
   * Pega nos valores brutos da store, formata-os e atualiza o HTML
   * @param {Object} state - O estado global atualizado
   */
  atualizarInterface(state) {
    // Extraímos os valores garantindo que, se não existirem, assumem 0
    const custoBanho = state.custoBanho || 0;
    const custoTotal = state.custoTotal || 0;
    
    // Nota: O precoVenda ainda será implementado no próximo componente, 
    // mas o cartão já fica preparado para o ler.
    const precoVenda = state.precoVenda || 0;

    // Utilizamos o nosso módulo utilitário para converter os números puros 
    // na string formatada "R$ 0,00"
    this.elCustoBanho.textContent = formatCurrency(custoBanho);
    this.elCustoTotal.textContent = formatCurrency(custoTotal);
    this.elPrecoVenda.textContent = formatCurrency(precoVenda);

    // UX: Dispara uma pequena animação de feedback visual
    this.animarAtualizacao();
  }

  /**
   * Adiciona e remove rapidamente uma classe CSS para dar a sensação de 
   * "piscar" ou "atualizar", indicando ao utilizador que os cálculos foram refeitos.
   */
  animarAtualizacao() {
    // Remove a classe caso já lá esteja
    this.container.classList.remove('update-pulse');
    
    // Truque de Vanilla JS (forçar o reflow do DOM) para reiniciar a animação
    void this.container.offsetWidth; 
    
    // Adiciona a classe que fará a transição (requer CSS no style.css)
    this.container.classList.add('update-pulse');
  }
}
