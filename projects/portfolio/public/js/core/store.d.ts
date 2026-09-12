/**
 * Store - State Management System
 * Central state management for the calculator application
 */

export interface StoreState {
  pesoBruto: string;
  tipoBanhoSelecionado: string;
  valorBanhoCustom: string;
  custoBanho: number;
  custoBruto: string;
  margemPerda: string;
  insumos: string;
  embalagem: string;
  frete: string;
  custoTotal: number;
  markup: string;
  precoVenda: number;
}

export interface StateListener {
  (state: StoreState): void;
}

export class Store {
  private state: StoreState;
  private listeners: StateListener[];
  private cacheKey: string;

  /**
   * Creates a new Store instance
   * @param initialState - The initial state object
   */
  constructor(initialState?: Partial<StoreState>);

  /**
   * Returns a copy of the current state
   * @returns The current application state
   */
  getState(): StoreState;

  /**
   * Subscribes a listener function to be called whenever state changes
   * @param listener - Callback function to be invoked on state updates
   */
  subscribe(listener: StateListener): void;

  /**
   * Updates parts of the state, persists to cache, and notifies listeners
   * @param newState - Object containing the keys that were changed
   */
  setState(newState: Partial<StoreState>): void;

  /**
   * Clears the state and removes the cache
   * @param defaultState - The default/reset state
   */
  clearState(defaultState: Partial<StoreState>): void;
}
