// src/js/core/store.js

export class Store {
  /**
   * @param {Object} initialState - O estado inicial padrão da aplicação
   */
  constructor(initialState = {}) {
    this.cacheKey = 'calculadora_semijoias_draft';
    this.listeners = [];
    
    // Tenta recuperar os dados cacheados do localStorage
    const cachedState = localStorage.getItem(this.cacheKey);
    
    if (cachedState) {
      try {
        // Mescla o estado inicial com os dados recuperados do cache
        // Isso previne que novas variáveis criadas no futuro quebrem o cache antigo
        this.state = { ...initialState, ...JSON.parse(cachedState) };
      } catch (error) {
        console.error('Erro ao ler o cache, iniciando estado zerado.', error);
        this.state = initialState;
      }
    } else {
      this.state = initialState;
    }
  }

  /**
   * Retorna uma cópia do estado atual
   */
  getState() {
    return this.state;
  }

  /**
   * Inscreve uma função (listener) para ser chamada sempre que o estado mudar
   * @param {Function} listener 
   */
  subscribe(listener) {
    if (typeof listener === 'function') {
      this.listeners.push(listener);
    }
  }

  /**
   * Atualiza partes do estado, salva no cache e notifica os componentes
   * @param {Object} newState - Objeto contendo apenas as chaves que foram alteradas
   */
  setState(newState) {
    // Atualiza o estado mesclando o que já existia com os novos valores
    this.state = { ...this.state, ...newState };
    
    // Persiste no cache instantaneamente
    localStorage.setItem(this.cacheKey, JSON.stringify(this.state));
    
    // Avisa a todos os componentes inscritos que o estado mudou
    this.notify();
  }

  /**
   * Método interno para disparar a atualização em todos os listeners
   */
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  /**
   * Limpa o estado e remove o cache (útil para um botão "Limpar")
   * @param {Object} defaultState - O estado zerado original
   */
  clearState(defaultState) {
    this.state = defaultState;
    localStorage.removeItem(this.cacheKey);
    this.notify();
  }
}
