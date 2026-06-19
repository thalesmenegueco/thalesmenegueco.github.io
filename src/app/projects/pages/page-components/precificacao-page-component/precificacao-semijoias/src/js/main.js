// src/js/main.js
import { Store } from './core/store.js';
import { BanhoForm } from './components/BanhoForm.js';
import { CustosForm } from './components/CustosForm.js';
import { VendaForm } from './components/VendaForm.js';
import { ResultadosCard } from './components/ResultadosCard.js';

// Aguardamos o DOM estar completamente carregado para evitar erros de elementos nulos
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Definimos a estrutura base do nosso estado
  const estadoInicial = {
    pesoBruto: '',
    tipoBanhoSelecionado: '',
    valorBanhoCustom: '',
    custoBanho: 0,
    custoBruto: '',
    margemPerda: '2.0',
    insumos: '0.00',
    embalagem: '0.00',
    frete: '0.00',
    custoTotal: 0,
    markup: '',
    precoVenda: 0
  };

  // 2. Inicializamos o Cérebro da Aplicação
  const store = new Store(estadoInicial);

  // 3. Acoplamos os Componentes Visuais às suas sessões HTML
  new BanhoForm(document.querySelector('#secao-banho'), store);
  new CustosForm(document.querySelector('#secao-custos'), store);
  new VendaForm(document.querySelector('#secao-venda'), store);
  
  // O Cartão de Resultados, que apenas escuta e formata
  new ResultadosCard(document.querySelector('#secao-resultados'), store);

  console.log('💎 Calculadora de Semijoias iniciada com sucesso!');
});
