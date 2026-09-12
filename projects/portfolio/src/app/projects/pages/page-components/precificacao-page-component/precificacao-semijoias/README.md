```
/src
  /css
    style.css             # Estilos globais e utilitários
  /js
    /core
      store.js            # O "coração" da aplicação: Estado, Cache e Pub/Sub
    /utils
      calculations.js     # As fórmulas matemáticas puras (isoladas)
      formatters.js       # Máscaras de moeda (R$) e peso (g)
    /components
      BanhoForm.js        # Lida com inputs de Peso e Valor do Banho
      CustosForm.js       # Lida com Custo Bruto, Insumos, Embalagem
      ResultadosCard.js   # Exibe os totais reativamente
    main.js               # Ponto de entrada: inicializa a store e os componentes
  index.html
```
