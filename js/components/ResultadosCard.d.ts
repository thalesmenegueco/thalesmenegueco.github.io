/**
 * ResultadosCard - Results Display Component
 * Displays formatted results: banho cost, total cost, and suggested selling price
 */

import type { Store, StoreState } from '../core/store';

export class ResultadosCard {
  private container: HTMLElement;
  private store: Store;
  private elCustoBanho: HTMLElement | null;
  private elCustoTotal: HTMLElement | null;
  private elPrecoVenda: HTMLElement | null;

  /**
   * Creates a new ResultadosCard component
   * @param container - The DOM element of the results panel (#secao-resultados)
   * @param store - The central state manager instance
   */
  constructor(container: HTMLElement, store: Store);

  /**
   * Takes raw values from store, formats them and updates the HTML
   * @private
   * @param state - The updated global state
   */
  private atualizarInterface(state: StoreState): void;

  /**
   * Adds and removes a CSS class briefly to provide visual feedback
   * indicating to the user that calculations have been recalculated
   * @private
   */
  private animarAtualizacao(): void;
}
