/**
 * CustosForm - Total Costs Form Component
 * Handles all cost inputs: raw material, loss margin, supplies, packaging, and shipping
 */

import type { Store, StoreState } from '../core/store';

export interface CustosInputs {
  custoBruto: HTMLInputElement | null;
  margemPerda: HTMLInputElement | null;
  insumos: HTMLInputElement | null;
  embalagem: HTMLInputElement | null;
  frete: HTMLInputElement | null;
}

export class CustosForm {
  private container: HTMLElement;
  private store: Store;
  private inputs: CustosInputs;

  /**
   * Creates a new CustosForm component
   * @param container - The DOM element of the costs section (#secao-custos)
   * @param store - The central state manager instance
   */
  constructor(container: HTMLElement, store: Store);

  /**
   * Adds event listeners dynamically to all form fields
   * @private
   */
  private bindEvents(): void;

  /**
   * Extracts values from the screen, formats them and calculates total cost
   * @private
   * @param state - Current state to capture banho cost
   */
  private recalcular(state: StoreState): void;

  /**
   * Synchronizes the form with the application state
   * Called whenever state changes or on initialization
   * @private
   * @param state - The current application state
   */
  private syncWithState(state: StoreState): void;
}
