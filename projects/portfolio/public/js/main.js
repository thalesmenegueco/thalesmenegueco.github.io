// src/js/main.js
console.log('Loading calculator modules...');

(async () => {
  try {
    const storeModule = await import('./core/store.js');
    const banhoModule = await import('./components/BanhoForm.js');
    const custosModule = await import('./components/CustosForm.js');
    const vendaModule = await import('./components/VendaForm.js');
    const resultadosModule = await import('./components/ResultadosCard.js');
    
    const Store = storeModule.Store;
    const BanhoForm = banhoModule.BanhoForm;
    const CustosForm = custosModule.CustosForm;
    const VendaForm = vendaModule.VendaForm;
    const ResultadosCard = resultadosModule.ResultadosCard;

    console.log('Modules loaded successfully');

    // Function to initialize the calculator
    function initializeCalculator() {
      console.log('Initializing calculator...');
      try {
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
      } catch(err) {
        console.error('Error initializing calculator:', err);
      }
    }

    // Check if DOM is already loaded (for Angular integration)
    if (document.readyState === 'loading') {
      // Document is still loading, wait for DOMContentLoaded
      document.addEventListener('DOMContentLoaded', initializeCalculator);
    } else {
      // Document is already loaded, run immediately
      // Use setTimeout to ensure Angular has finished rendering the template
      setTimeout(initializeCalculator, 0);
    }
  } catch(err) {
    console.error('Failed to load calculator modules:', err);
  }
})();
