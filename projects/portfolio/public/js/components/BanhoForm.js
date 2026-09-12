// src/js/components/BanhoForm.js
import { calcularCustoBanho } from '../utils/calculations.js';

export class BanhoForm {
  /**
   * @param {HTMLElement} container - O elemento do DOM que envolve este formulário (#secao-banho)
   * @param {Object} store - A instância central do nosso gerenciador de estado
   */
  constructor(container, store) {
    this.container = container;
    this.store = store;

    // 1. Mapeamento de Elementos do DOM
    this.inputPeso = this.container.querySelector('#peso-bruto');
    this.selectBanho = this.container.querySelector('#valor-banho');
    this.grupoCustom = this.container.querySelector('#grupo-banho-custom');
    this.inputCustom = this.container.querySelector('#valor-banho-custom');

    // 2. Inicialização
    this.bindEvents();
    
    // Inscreve o componente para reagir a mudanças (ex: um botão "Limpar Tudo")
    this.store.subscribe((state) => this.syncWithState(state));
    
    // Hidrata a tela com os valores iniciais (vindos do cache do LocalStorage)
    this.syncWithState(this.store.getState());
  }

  /**
   * Adiciona os "ouvintes" de eventos nos campos do formulário
   */
  bindEvents() {
    // Centralizamos a lógica em uma única arrow function para manter o escopo léxico (this)
    const handleInput = () => {
      let valorGrama = 0;

      // UX: Lida com a exibição do campo manual se "Outro" for selecionado
      if (this.selectBanho.value === 'custom') {
        this.grupoCustom.classList.remove('hidden');
        valorGrama = parseFloat(this.inputCustom.value) || 0;
      } else {
        this.grupoCustom.classList.add('hidden');
        valorGrama = parseFloat(this.selectBanho.value) || 0;
      }

      const peso = parseFloat(this.inputPeso.value) || 0;

      // Regra de Negócio Pura: Calcula o Custo 1
      const custoBanho = calcularCustoBanho(peso, valorGrama);

      // Despacha as novidades para o Gerenciador de Estado
      this.store.setState({
        pesoBruto: this.inputPeso.value, // Guardamos como string para não perder decimais incompletos digitados ("12.")
        tipoBanhoSelecionado: this.selectBanho.value,
        valorBanhoCustom: this.inputCustom.value,
        custoBanho: custoBanho
      });
    };

    // 'input' capta cada tecla digitada. 'change' capta a troca do Select.
    this.inputPeso.addEventListener('input', handleInput);
    this.selectBanho.addEventListener('change', handleInput);
    this.inputCustom.addEventListener('input', handleInput);
  }

  /**
   * Mantém a interface visual (HTML) sincronizada com a memória (Store/Cache)
   * Útil ao recarregar a página para preencher os dados deixados para trás
   * @param {Object} state - O estado atualizado da store
   */
  syncWithState(state) {
    // Verifica se os valores existem no estado e se são diferentes do DOM atual
    // Isso evita um loop infinito (digitar -> atualiza store -> atualiza tela -> dispara evento de digitar)
    if (state.pesoBruto !== undefined && this.inputPeso.value !== state.pesoBruto) {
      this.inputPeso.value = state.pesoBruto;
    }

    if (state.tipoBanhoSelecionado !== undefined && this.selectBanho.value !== state.tipoBanhoSelecionado) {
      this.selectBanho.value = state.tipoBanhoSelecionado;
    }

    if (state.valorBanhoCustom !== undefined && this.inputCustom.value !== state.valorBanhoCustom) {
      this.inputCustom.value = state.valorBanhoCustom;
    }

    // Garante que o campo customizado apareça caso estivesse aberto no cache
    if (this.selectBanho.value === 'custom') {
      this.grupoCustom.classList.remove('hidden');
    } else {
      this.grupoCustom.classList.add('hidden');
    }
  }
}
