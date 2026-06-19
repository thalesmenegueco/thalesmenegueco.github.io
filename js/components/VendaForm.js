// src/js/components/VendaForm.js
import { calcularPrecoVenda } from '../utils/calculations.js';

export class VendaForm {
  /**
   * @param {HTMLElement} container - O elemento DOM da seção de venda (#secao-venda)
   * @param {Object} store - A instância do gerenciador de estado global
   */
  constructor(container, store) {
    this.container = container;
    this.store = store;

    // 1. Mapeamento do input
    this.inputMarkup = this.container.querySelector('#markup');

    // 2. Inicialização
    this.bindEvents();
    
    // Inscreve para reagir às mudanças em cascata (quando o Custo Total muda upstream)
    this.store.subscribe((state) => this.syncWithState(state));
    
    // Hidratação inicial com os dados do LocalStorage
    this.syncWithState(this.store.getState());
  }

  /**
   * Escuta a digitação no campo de Markup
   */
  bindEvents() {
    this.inputMarkup.addEventListener('input', () => {
      this.recalcular(this.store.getState());
    });
  }

  /**
   * Pega o Markup digitado e o Custo Total da store para gerar o Preço de Venda
   * @param {Object} state - O estado global atual
   */
  recalcular(state) {
    const markup = parseFloat(this.inputMarkup.value) || 0;
    
    // Recuperamos o custo total consolidado pelo CustosForm
    const custoTotalAtual = state.custoTotal || 0;

    const novoPrecoVenda = calcularPrecoVenda(custoTotalAtual, markup);

    // Salvamos na store
    this.store.setState({
      markup: this.inputMarkup.value,
      precoVenda: novoPrecoVenda
    });
  }

  /**
   * Sincroniza a tela e lida com o recálculo em cascata
   */
  syncWithState(state) {
    // 1. Restaura o input físico se houver cache
    if (state.markup !== undefined && this.inputMarkup.value !== String(state.markup)) {
      this.inputMarkup.value = state.markup;
    }

    // 2. Lógica da Cascata:
    // Verifica se o Custo Total foi atualizado por outro componente. 
    // Se sim, precisamos recalcular o Preço de Venda com o novo custo base.
    const markup = parseFloat(this.inputMarkup.value) || 0;
    const custoTotalAtual = state.custoTotal || 0;
    
    const precoEsperado = calcularPrecoVenda(custoTotalAtual, markup);

    if (precoEsperado !== state.precoVenda) {
      this.store.setState({ precoVenda: precoEsperado });
    }
  }
}
