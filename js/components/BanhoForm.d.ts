/**
 * BanhoForm - Galvanoplating Cost Form Component
 * Handles weight input and banho (plating) type selection
 */

import type { Store, StoreState } from '../core/store';

export class BanhoForm {
  private container: HTMLElement;
  private store: Store;
  private inputPeso: HTMLInputElement | null;
  private selectBanho: HTMLSelectElement | null;
  private grupoCustom: HTMLElement | null;
  private inputCustom: HTMLInputElement | null;

  /**
   * Creates a new BanhoForm component
   * @param container - The DOM element that wraps this form (#secao-banho)
   * @param store - The central state manager instance
   */
  constructor(container: HTMLElement, store: Store);

  /**
   * Adds event listeners to form fields
   * @private
   */
  private bindEvents(): void;

  /**
   * Synchronizes the form with the application state
   * Called whenever state changes or on initialization
   * @private
   * @param state - The current application state
   */
  private syncWithState(state: StoreState): void;
}
