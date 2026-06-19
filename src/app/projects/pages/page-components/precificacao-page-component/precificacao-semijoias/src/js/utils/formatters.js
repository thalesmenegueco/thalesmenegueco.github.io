// src/js/utils/formatters.js

/**
 * Formata um número bruto para o padrão monetário Brasileiro (R$)
 * @param {number} value - O valor a ser formatado (ex: 1250.5)
 * @returns {string} - Retorna a string formatada (ex: "R$ 1.250,50")
 */
export const formatCurrency = (value) => {
  // Prevenção de erros: se não for um número válido, retorna o padrão zerado
  if (isNaN(value) || value === null || value === undefined) {
    return 'R$ 0,00';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formata um número para exibição de peso com o sufixo "g" (gramas)
 * @param {number} value - O valor a ser formatado (ex: 12.5)
 * @returns {string} - Retorna a string formatada (ex: "12,5 g")
 */
export const formatWeight = (value) => {
  if (isNaN(value) || value === null || value === undefined) {
    return '0 g';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 1, // Exige pelo menos 1 casa decimal (ex: 10,0 g)
    maximumFractionDigits: 2
  }).format(value) + ' g';
};

/**
 * Opcional: Formata um número decimal para exibição de percentual
 * @param {number} value - O valor decimal (ex: 0.02 para 2%)
 * @returns {string} - Retorna a string formatada (ex: "2,0 %")
 */
export const formatPercentage = (value) => {
  if (isNaN(value) || value === null || value === undefined) {
    return '0%';
  }
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2
  }).format(value);
};
