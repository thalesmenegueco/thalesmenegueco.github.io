// src/js/components/CustosForm.js
import { calcularCustoTotal } from '../utils/calculations.js';

export class CustosForm {
  /**
   * @param {HTMLElement} container - O elemento DOM da secção de custos (#secao-custos)
   * @param {Object} store - A instância do gestor de estado global
   */
  constructor(container, store) {
    this.container = container;
    this.store = store;

    // 1. Mapeamento de todos os inputs desta secção
    this.inputs = {
      custoBruto: this.container.querySelector('#custo-bruto'),
      margemPerda: this.container.querySelector('#margem-perda'),
      insumos: this.container.querySelector('#insumos'),
      embalagem: this.container.querySelector('#embalagem'),
      frete: this.container.querySelector('#frete')
    };

    // 2. Inicialização
    this.bindEvents();
    
    // Subscreve as mudanças de estado para o "Efeito em Cascata"
    this.store.subscribe((state) => this.syncWithState(state));
    
    // Hidratação inicial
    this.syncWithState(this.store.getState());
  }

  /**
   * Adiciona os ouvintes de eventos de forma dinâmica a todos os campos
   */
  bindEvents() {
    const handleInput = () => {
      // Sempre que qualquer input mudar, recalculamos com base no estado atual
      this.recalcular(this.store.getState());
    };

    // Anexa o evento 'input' a cada um dos campos mapeados
    Object.values(this.inputs).forEach(input => {
      if (input) input.addEventListener('input', handleInput);
    });
  }

  /**
   * Extrai os valores do ecrã, formata-os e calcula o Custo Total
   * @param {Object} state - O estado atual para capturar o custo do banho
   */
  recalcular(state) {
    const bruto = parseFloat(this.inputs.custoBruto.value) || 0;
    
    // A margem de perda no HTML é apresentada em %, ex: "2.0". 
    // O motor de cálculo espera um decimal (0.02).
    const perdaPercentual = parseFloat(this.inputs.margemPerda.value) || 0;
    const perdaDecimal = perdaPercentual / 100;

    const insumos = parseFloat(this.inputs.insumos.value) || 0;
    const embalagem = parseFloat(this.inputs.embalagem.value) || 0;
    const frete = parseFloat(this.inputs.frete.value) || 0;

    // Recupera o valor do banho que foi calculado no BanhoForm e guardado na store
    const custoBanhoAtual = state.custoBanho || 0;

    const novoCustoTotal = calcularCustoTotal(
      bruto,
      custoBanhoAtual,
      perdaDecimal,
      insumos,
      embalagem,
      frete
    );

    // Envia o novo pacote de dados para o estado global
    this.store.setState({
      custoBruto: this.inputs.custoBruto.value,
      margemPerda: this.inputs.margemPerda.value,
      insumos: this.inputs.insumos.value,
      embalagem: this.inputs.embalagem.value,
      frete: this.inputs.frete.value,
      custoTotal: novoCustoTotal
    });
  }

  /**
   * Mantém a interface sincronizada e gere recálculos automáticos (cascata)
   */
  syncWithState(state) {
    // 1. Sincroniza os inputs físicos se houver dados em cache
    Object.keys(this.inputs).forEach(key => {
      const input = this.inputs[key];
      if (input && state[key] !== undefined && input.value !== String(state[key])) {
        input.value = state[key];
      }
    });

    // 2. Lógica da Cascata: 
    // Se o custoBanho foi alterado noutro componente, o custoTotal que está 
    // guardado na store pode estar desatualizado em relação a esta secção.
    // Vamos verificar se precisamos de forçar uma atualização.
    
    const bruto = parseFloat(this.inputs.custoBruto.value) || 0;
    const perdaDecimal = (parseFloat(this.inputs.margemPerda.value) || 0) / 100;
    const insumos = parseFloat(this.inputs.insumos.value) || 0;
    const embalagem = parseFloat(this.inputs.embalagem.value) || 0;
    const frete = parseFloat(this.inputs.frete.value) || 0;
    const custoBanhoAtual = state.custoBanho || 0;

    const custoTotalEsperado = calcularCustoTotal(
      bruto, custoBanhoAtual, perdaDecimal, insumos, embalagem, frete
    );

    // Só disparamos um setState se a matemática provar que o valor guardado está obsoleto.
    // Isto é fundamental para evitar ciclos de renderização infinitos no JavaScript.
    if (custoTotalEsperado !== state.custoTotal) {
      this.store.setState({ custoTotal: custoTotalEsperado });
    }
  }
}
