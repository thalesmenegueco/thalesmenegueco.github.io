/**
 * Calculation Utilities
 * Business logic functions for cost and price calculations
 */

/**
 * Formula 1: Banho (Galvanoplating) Cost
 * Calculates the direct cost of precious metal plating on the raw piece.
 *
 * @param pesoBruto - Weight of the piece before plating (in grams)
 * @param valorPorGrama - Price of plating per gram (in R$)
 * @returns The financial cost of plating in Reais
 */
export function calcularCustoBanho(pesoBruto: number | string, valorPorGrama: number | string): number;

/**
 * Formula 2: Total Cost of the Piece
 * Consolidates acquisition, plating, losses, assembly and logistics.
 *
 * @param custoBruto - Amount paid for the raw metal piece (R$)
 * @param custoBanho - Result from Formula 1 (R$)
 * @param margemPerda - Percentage in decimal format (e.g. 0.02 for 2%)
 * @param insumosMontagem - Costs with tools, stones, glue, etc (R$)
 * @param embalagem - Individual packaging cost of tags, bags, boxes (R$)
 * @param freteRateado - Shipping cost per piece (R$)
 * @returns The real accumulated cost of the piece in Reais
 */
export function calcularCustoTotal(
  custoBruto?: number | string,
  custoBanho?: number | string,
  margemPerda?: number | string,
  insumosMontagem?: number | string,
  embalagem?: number | string,
  freteRateado?: number | string
): number;

/**
 * Formula 3: Selling Price
 * Calculates the suggested selling price based on total cost and markup multiplier.
 *
 * @param custoTotal - The total cost of the piece (R$)
 * @param markup - Markup multiplier (e.g. 3.5 means sell at 3.5x the cost)
 * @returns The suggested selling price in Reais
 */
export function calcularPrecoVenda(custoTotal: number | string, markup: number | string): number;
