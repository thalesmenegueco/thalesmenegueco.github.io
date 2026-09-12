/**
 * VendaForm - Selling Price Form Component
 * Handles markup multiplier input and calculates final selling price
 */

import type { Store, StoreState } from '../core/store';

export class VendaForm {
  private container: HTMLElement;
  private store: Store;
  private inputMarkup: HTMLInputElement | null;

  /**
   * Creates a new VendaForm component
   * @param container - The DOM element of the sales section (#secao-venda)
   * @param store - The central state manager instance
   */
  constructor(container: HTMLElement, store: Store);

  /**
   * Listens for input in the Markup field
   * @private
   */
  private bindEvents(): void;

  /**
   * Takes the entered Markup and current Total Cost from store to generate the Selling Price
   * @private
   * @param state - The current global application state
   */
  private recalcular(state: StoreState): void;

  /**
   * Synchronizes the screen and handles cascading recalculation
   * @private
   * @param state - The current application state
   */
  private syncWithState(state: StoreState): void;
}
