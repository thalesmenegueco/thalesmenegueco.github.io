import { Component, OnInit, AfterViewInit } from '@angular/core';

// Type declarations for JavaScript modules
interface StoreModule {
  Store: any;
}

interface BanhoFormModule {
  BanhoForm: any;
}

interface CustosFormModule {
  CustosForm: any;
}

interface VendaFormModule {
  VendaForm: any;
}

interface ResultadosCardModule {
  ResultadosCard: any;
}

@Component({
  selector: 'app-precificacao-page-component',
  imports: [],
  templateUrl: './precificacao-semijoias/index.html',
  styleUrl: './precificacao-semijoias/src/css/style.css',
})
export class PrecificacaoPageComponent implements AfterViewInit {
  ngAfterViewInit() {
    // Initialize calculator after the view is fully rendered
    console.log('AfterViewInit called, loading calculator...');
    this.loadCalculator();
  }

  private async loadCalculator() {
    try {
      console.log('Starting to load calculator modules...');
      
      // @ts-expect-error - No declaration file available for dynamic import
      const storeModule = await import('./precificacao-semijoias/src/js/core/store.js') as unknown as StoreModule;
      console.log('Store module loaded:', storeModule);
      
      // @ts-expect-error - No declaration file available for dynamic import
      const banhoModule = await import('./precificacao-semijoias/src/js/components/BanhoForm.js') as unknown as BanhoFormModule;
      console.log('BanhoForm module loaded:', banhoModule);
      
      // @ts-expect-error - No declaration file available for dynamic import
      const custosModule = await import('./precificacao-semijoias/src/js/components/CustosForm.js') as unknown as CustosFormModule;
      console.log('CustosForm module loaded:', custosModule);
      
      // @ts-expect-error - No declaration file available for dynamic import
      const vendaModule = await import('./precificacao-semijoias/src/js/components/VendaForm.js') as unknown as VendaFormModule;
      console.log('VendaForm module loaded:', vendaModule);
      
      // @ts-expect-error - No declaration file available for dynamic import
      const resultadosModule = await import('./precificacao-semijoias/src/js/components/ResultadosCard.js') as unknown as ResultadosCardModule;
      console.log('ResultadosCard module loaded:', resultadosModule);

      const { Store } = storeModule;
      const { BanhoForm } = banhoModule;
      const { CustosForm } = custosModule;
      const { VendaForm } = vendaModule;
      const { ResultadosCard } = resultadosModule;

      // Initialize the state
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

      console.log('Initializing Store...');
      const store = new Store(estadoInicial);

      console.log('Attaching form components...');
      // Attach components to their DOM sections
      new BanhoForm(document.querySelector('#secao-banho'), store);
      new CustosForm(document.querySelector('#secao-custos'), store);
      new VendaForm(document.querySelector('#secao-venda'), store);
      new ResultadosCard(document.querySelector('#secao-resultados'), store);

      console.log('💎 Calculadora de Semijoias iniciada com sucesso!');
    } catch (error) {
      console.error('Erro ao carregar calculadora:', error);
      console.error('Stack:', error instanceof Error ? error.stack : 'N/A');
    }
  }
}
