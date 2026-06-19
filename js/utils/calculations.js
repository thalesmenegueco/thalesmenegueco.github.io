// src/js/utils/calculations.js

/**
 * Fórmula 1: Custo do Banho (Galvanoplastia)
 * Calcula o custo direto do banho de metal precioso sobre a peça bruta.
 *
 * @param {number} pesoBruto - Peso da peça antes do banho (em gramas).
 * @param {number} valorPorGrama - Preço do banho por grama (em R$).
 * @returns {number} O custo financeiro do banho em Reais.
 */
export const calcularCustoBanho = (pesoBruto, valorPorGrama) => {
  const peso = Number(pesoBruto) || 0;
  const valor = Number(valorPorGrama) || 0;

  // Prevenção extra para números negativos indesejados
  if (peso < 0 || valor < 0) return 0;

  return peso * valor;
};

/**
 * Fórmula 2: Custo Total da Peça
 * Consolida aquisição, banho, perdas, montagem e logística.
 *
 * @param {number} custoBruto - Valor pago pela peça em metal bruto (R$).
 * @param {number} custoBanho - Valor resultante da Fórmula 1 (R$).
 * @param {number} margemPerda - Percentual em formato decimal (ex: 0.02 para 2%).
 * @param {number} insumosMontagem - Custos com tarraxas, pedrarias, cola, etc (R$).
 * @param {number} embalagem - Custo individual de tags, saquinhos, caixas (R$).
 * @param {number} freteRateado - Custo de frete por peça (R$).
 * @returns {number} O custo real acumulado da peça em Reais.
 */
export const calcularCustoTotal = (
  custoBruto = 0,
  custoBanho = 0,
  margemPerda = 0,
  insumosMontagem = 0,
  embalagem = 0,
  freteRateado = 0
) => {
  // Garantindo que todos os valores sejam tratados como números (ou 0 em caso de falha)
  const baseBruta = Number(custoBruto) || 0;
  const banho = Number(custoBanho) || 0;
  const perdaDecimal = Number(margemPerda) || 0;
  const insumos = Number(insumosMontagem) || 0;
  const emb = Number(embalagem) || 0;
  const frete = Number(freteRateado) || 0;

  // Matemática estrita conforme a documentação
  const custoBaseComPerda = (baseBruta + banho) * (1 + perdaDecimal);
  
  return custoBaseComPerda + insumos + emb + frete;
};

/**
 * Fórmula 3: Preço de Venda
 * Aplica o multiplicador financeiro sobre o custo total.
 *
 * @param {number} custoTotal - Valor resultante da Fórmula 2 (R$).
 * @param {number} markupMultiplicador - Fator numérico para absorver despesas e lucro (ex: 3.5).
 * @returns {number} O valor final sugerido para venda em Reais.
 */
export const calcularPrecoVenda = (custoTotal, markupMultiplicador) => {
  const custo = Number(custoTotal) || 0;
  const markup = Number(markupMultiplicador) || 0;

  // Se não houver custo ou markup válido, o preço de venda é zero
  if (custo <= 0 || markup <= 0) return 0;

  return custo * markup;
};
