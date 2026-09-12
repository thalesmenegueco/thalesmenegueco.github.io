import type { Lesson } from '../lesson.types';

/**
 * Lesson definitions. Stored as typed TS object literals (equivalent to JSON,
 * and type-checked). Example datasets are embedded as inline CSV so the lessons
 * work on a static host (GitHub Pages) with no file server.
 */

const HEIGHT_WEIGHT_CSV =
  'height,weight\n' +
  '150,55\n152,58\n155,60\n158,61\n160,64\n160,62\n162,66\n163,65\n165,68\n165,67\n' +
  '167,70\n168,72\n170,73\n170,71\n172,75\n173,74\n175,77\n175,78\n177,80\n178,79\n' +
  '180,82\n180,81\n182,84\n183,85\n185,86\n186,88\n188,90\n190,91\n192,93\n195,95';

const RENDA_CSV =
  'renda\n' +
  '2500\n2700\n2900\n3000\n3100\n3200\n3300\n3400\n3500\n3600\n3800\n4000\n4200\n4500\n' +
  '4800\n5000\n5200\n5500\n6000\n12000\n95000';

const DISTRIBUTIONS_CSV =
  'height_cm,salary,age\n' +
  '178,7982,30\n169,4745,43\n163,6912,49\n170,4728,53\n165,4207,18\n166,3014,61\n164,3085,52\n175,6147,44\n188,4695,36\n174,3777,25\n' +
  '177,2500,52\n157,3403,38\n176,3446,41\n164,4659,30\n165,4203,35\n169,6622,48\n173,3841,33\n164,6850,42\n175,3847,40\n166,2776,52\n' +
  '183,4553,23\n170,7501,24\n158,2500,55\n181,2500,58\n164,6458,42\n165,7471,33\n181,2620,29\n166,5000,36\n164,2863,56\n165,3646,21\n' +
  '167,7380,37\n161,3366,39\n187,3291,39\n157,5452,23\n170,4100,28\n160,4014,28\n183,3811,19\n167,2500,34\n166,2851,29\n182,3334,31\n' +
  '170,7098,44\n180,4190,45\n169,2500,46\n173,3174,42\n164,2500,25\n169,3819,48\n154,4460,51\n154,26000,62\n181,45000,30\n150,78000,39';

const GROUPS_CSV =
  'region,sales,salesperson\n' +
  'Norte,28,Ana\nNorte,29,Bruno\nNorte,30,Carla\nNorte,30,Diego\nNorte,31,Elisa\nNorte,31,Fábio\nNorte,30,Gabi\nNorte,32,Heitor\nNorte,29,Iara\nNorte,30,João\nNorte,31,Kátia\nNorte,33,Leo\n' +
  'Nordeste,33,Diego\nNordeste,34,Elisa\nNordeste,35,Fábio\nNordeste,35,Gabi\nNordeste,36,Heitor\nNordeste,36,Iara\nNordeste,35,João\nNordeste,37,Kátia\nNordeste,34,Leo\nNordeste,35,Ana\nNordeste,36,Bruno\nNordeste,38,Carla\n' +
  'Sul,38,Gabi\nSul,39,Heitor\nSul,40,Iara\nSul,40,João\nSul,41,Kátia\nSul,42,Leo\nSul,41,Ana\nSul,40,Bruno\nSul,43,Carla\nSul,39,Diego\nSul,40,Elisa\nSul,44,Fábio\n' +
  'Sudeste,45,João\nSudeste,48,Kátia\nSudeste,50,Leo\nSudeste,52,Ana\nSudeste,54,Bruno\nSudeste,55,Carla\nSudeste,58,Diego\nSudeste,60,Elisa\nSudeste,63,Fábio\nSudeste,66,Gabi\nSudeste,70,Heitor\nSudeste,120,Iara';

const MISSING_CSV =
  'respondent_id,age,satisfaction,product_category\n' +
  '1,39,10,Eletrônicos\n2,19,,Moda\n3,43,,Casa\n4,42,9,Livros\n5,19,5,Esportes\n6,53,,Eletrônicos\n7,,6,Moda\n8,52,3,Casa\n9,44,,Livros\n10,47,2,Esportes\n' +
  '11,24,10,Eletrônicos\n12,52,,Moda\n13,32,10,Casa\n14,46,10,Livros\n15,41,,Esportes\n16,44,8,Eletrônicos\n17,18,8,Moda\n18,33,,Casa\n19,60,7,Livros\n20,62,7,Esportes\n' +
  '21,18,,Eletrônicos\n22,49,10,Moda\n23,,3,Casa\n24,43,,Livros\n25,22,5,Esportes\n26,58,9,Eletrônicos\n27,46,,Moda\n28,42,9,Casa\n29,40,7,Livros\n30,31,,Esportes\n' +
  '31,35,7,Eletrônicos\n32,45,5,Moda\n33,39,,Casa\n34,41,5,Livros\n35,44,9,Esportes\n36,32,,Eletrônicos\n37,49,6,Moda\n38,25,9,Casa\n39,26,,Livros\n40,45,6,Esportes\n' +
  '41,,9,Eletrônicos\n42,46,,Moda\n43,31,5,Casa\n44,42,10,Livros\n45,25,,Esportes\n46,42,6,Eletrônicos\n47,53,9,Moda\n48,41,,Casa\n49,36,7,Livros\n50,54,,Esportes';

export const LESSONS: Lesson[] = [
  {
    id: 'correlation-basics',
    title: 'Entendendo Correlação',
    description:
      'Aprenda quando e como usar scatter plots para encontrar relações entre variáveis.',
    difficulty: 'beginner',
    estimatedTime: '5 min',
    objectives: [
      'Entender o que correlação mede',
      'Interpretar um scatter plot',
      'Conhecer a diferença entre correlação e causação',
    ],
    exampleDatasetCsv: HEIGHT_WEIGHT_CSV,
    exampleFieldDescriptions: [
      { name: 'height', type: 'numerical', description: 'Altura em cm' },
      { name: 'weight', type: 'numerical', description: 'Peso em kg' },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Visualizar os dados',
        instruction:
          'Carregue o dataset de exemplo (use o botão "Usar Exemplo" abaixo) e confirme que as colunas são numéricas.',
        action: 'upload',
        validation: {
          type: 'fieldTypes',
          expectedFields: [
            { name: 'height', type: 'numerical', description: 'Altura em cm' },
            { name: 'weight', type: 'numerical', description: 'Peso em kg' },
          ],
          errorMessage: 'Certifique-se de que as colunas height e weight são numéricas.',
        },
        hint: 'O botão "Usar Exemplo" carrega o dataset e já deixa os tipos prontos.',
        explanation: 'Antes de analisar, você precisa conhecer seus dados e confirmar os tipos.',
      },
      {
        id: 'step-2',
        title: 'Escolha um scatter plot',
        instruction: 'Selecione os campos height e weight e escolha "Gráfico de Dispersão".',
        action: 'chartSelection',
        validation: {
          type: 'chartType',
          expectedChartType: 'scatter-plot',
          expectedFieldNames: ['height', 'weight'],
          errorMessage:
            'Tente novamente — você precisa de um scatter plot com height e weight para ver a relação.',
        },
        hint: 'O tutor sugere scatter plot automaticamente quando você seleciona duas variáveis numéricas.',
        explanation:
          'Scatter plots mostram cada ponto como uma coordenada (x, y). Padrões visuais revelam relações.',
      },
      {
        id: 'step-3',
        title: 'Interprete o padrão',
        instruction: 'Vendo o gráfico, o que você observa? Escolha uma resposta:',
        action: 'multipleChoice',
        validation: {
          type: 'interpretation',
          correctAnswer: 'a',
          options: [
            {
              id: 'a',
              text: 'Correlação positiva forte: quanto mais alta a pessoa, mais pesada.',
              feedback: 'Correto! Os pontos formam uma linha ascendente — isso é correlação positiva.',
            },
            {
              id: 'b',
              text: 'Não há relação entre height e weight.',
              feedback: 'Hmm, olhe novamente. Os pontos formam algum padrão?',
            },
            {
              id: 'c',
              text: 'A altura causa o peso.',
              feedback:
                'Cuidado! Correlação não implica causação. Há outras variáveis (idade, genética, etc.).',
            },
          ],
        },
        explanation:
          'Correlação descreve uma relação, não uma causa. Existem muitas razões pelas quais altura e peso variam juntos.',
      },
      {
        id: 'step-4',
        title: 'Veja o coeficiente',
        instruction:
          'O gráfico de correlação mostrou um valor "r". O que significa um r por volta de 0.85? Escreva em uma frase:',
        action: 'textAnswer',
        validation: {
          type: 'textMatch',
          keywords: ['0.85', 'forte', 'positiva', '85%'],
          partialCredit: true,
          feedback:
            'A correlação de Pearson (r) varia de -1 a 1. 0.85 é uma correlação positiva *forte*: as variáveis se movem juntas de forma previsível.',
        },
        explanation:
          'Quanto mais perto de 1 (ou -1), mais forte é a correlação. 0.85 indica que altura e peso variam juntos de forma bem previsível.',
        hint: 'r = 0.85 está perto de 1. Valores perto de 1 ou -1 indicam correlações fortes.',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'Correlação mede quanto duas variáveis se movem juntas. Scatter plots mostram isso visualmente, e o coeficiente r quantifica — de -1 (negativa forte) a 1 (positiva forte). Mas lembre-se sempre: correlação ≠ causação.',
      keyTakeaway:
        'Scatter plot + coeficiente de correlação = ferramenta poderosa para explorar relações.',
    },
  },
  {
    id: 'outliers-basics',
    title: 'Encontrando Outliers',
    description:
      'Aprenda a identificar valores atípicos usando um box plot e a interpretar o que eles significam.',
    difficulty: 'beginner',
    estimatedTime: '4 min',
    objectives: [
      'Entender o que é um outlier',
      'Usar o box plot para enxergar outliers',
      'Decidir como lidar com valores atípicos',
    ],
    exampleDatasetCsv: RENDA_CSV,
    exampleFieldDescriptions: [
      { name: 'renda', type: 'numerical', description: 'Renda mensal em R$' },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Carregar os dados',
        instruction:
          'Carregue o dataset de exemplo (use o botão "Usar Exemplo") e confirme que "renda" é numérica.',
        action: 'upload',
        validation: {
          type: 'fieldTypes',
          expectedFields: [{ name: 'renda', type: 'numerical', description: 'Renda mensal' }],
          errorMessage: 'Confirme que a coluna renda é numérica.',
        },
        hint: 'O botão "Usar Exemplo" carrega o dataset e já deixa os tipos prontos.',
        explanation: 'Outliers só fazem sentido de avaliar em variáveis numéricas.',
      },
      {
        id: 'step-2',
        title: 'Escolha um box plot',
        instruction: 'Selecione o campo renda e escolha "Box Plot".',
        action: 'chartSelection',
        validation: {
          type: 'chartType',
          expectedChartType: 'box-plot',
          expectedFieldNames: ['renda'],
          errorMessage: 'Selecione o campo renda e o gráfico Box Plot.',
        },
        hint: 'Para uma única variável numérica, o tutor sugere Histograma e Box Plot.',
        explanation:
          'O box plot resume a distribuição: mediana, quartis e — o mais importante aqui — os pontos fora dos "bigodes" são candidatos a outliers.',
      },
      {
        id: 'step-3',
        title: 'Interprete o box plot',
        instruction: 'Os pontos isolados acima do box plot representam o quê?',
        action: 'multipleChoice',
        validation: {
          type: 'interpretation',
          correctAnswer: 'a',
          options: [
            {
              id: 'a',
              text: 'Valores atípicos (outliers), muito acima da maioria das rendas.',
              feedback: 'Isso! Esses pontos estão fora da faixa típica dos dados.',
            },
            {
              id: 'b',
              text: 'Erros no gráfico que devem ser ignorados sempre.',
              feedback: 'Nem sempre. Podem ser erros, mas também podem ser valores reais e informativos.',
            },
            {
              id: 'c',
              text: 'A mediana da distribuição.',
              feedback: 'Não — a mediana fica dentro da caixa do box plot.',
            },
          ],
        },
        explanation:
          'Outliers são valores que destoam do restante. Eles podem ser erros de digitação ou casos reais e importantes.',
      },
      {
        id: 'step-4',
        title: 'O que fazer com eles',
        instruction:
          'Escreva uma frase sobre o que você faria com o valor atípico de 95000 encontrado:',
        action: 'textAnswer',
        validation: {
          type: 'textMatch',
          keywords: ['investigar', 'verificar', 'erro', 'atípico', 'outlier', 'real'],
          partialCredit: true,
          feedback:
            'Boa! O ideal é investigar: se for erro de digitação, corrija ou remova; se for real, mantenha — ele pode ser o ponto mais interessante.',
        },
        explanation:
          'Investigar outliers é parte da análise: corrija se for erro, mantenha (e explore!) se for um valor real.',
        hint: 'Pergunte-se: isso é um erro ou um dado real?',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'Outliers são valores que fogem do padrão. O box plot os torna visíveis como pontos isolados. Antes de removê-los, investigue: um outlier pode ser um erro — ou a descoberta mais valiosa do seu conjunto de dados.',
      keyTakeaway: 'Box plot é a ferramenta certa para enxergar outliers rapidamente.',
    },
  },
  {
    id: 'distributions-basics',
    title: 'Conhecendo Distribuições',
    description:
      "Entenda como os dados se distribuem. Aprenda sobre distribuição normal e dados 'enviesados'.",
    difficulty: 'beginner',
    estimatedTime: '6 min',
    objectives: [
      'Entender por quê histogramas são importantes',
      'Reconhecer distribuição normal (simétrica, em forma de sino)',
      'Identificar dados enviesados (skewed) e entender o que significa',
      'Saber quando transformações ajudam',
    ],
    exampleDatasetCsv: DISTRIBUTIONS_CSV,
    exampleFieldDescriptions: [
      { name: 'height_cm', type: 'numerical', description: 'Altura em centímetros' },
      { name: 'salary', type: 'numerical', description: 'Salário mensal em reais' },
      { name: 'age', type: 'numerical', description: 'Idade em anos' },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Carregar o Dataset',
        instruction:
          "Carregue o dataset de exemplo (ou clique em 'Usar Exemplo'). Confirme que as três colunas estão como numéricas.",
        action: 'upload',
        validation: {
          type: 'fieldTypes',
          expectedFields: [
            { name: 'height_cm', type: 'numerical' },
            { name: 'salary', type: 'numerical' },
            { name: 'age', type: 'numerical' },
          ],
          errorMessage:
            'Certifique-se de que todas as colunas (height_cm, salary, age) estão como numéricas.',
        },
        hint: 'Você já fez isto na lição anterior. Confirme os tipos e avance.',
        explanation:
          'Distribuições são sobre variáveis numéricas. A forma como os dados se distribuem diz muito sobre a natureza deles.',
      },
      {
        id: 'step-2',
        title: 'Visualizar Distribuição Normal',
        instruction: "Selecione apenas 'height_cm' e crie um histograma. Olhe a forma.",
        action: 'chartSelection',
        validation: {
          type: 'chartType',
          expectedChartType: 'histogram',
          expectedFieldNames: ['height_cm'],
          errorMessage:
            'Tente de novo — você precisa de um histograma para uma variável numérica única.',
        },
        hint: "Selecione height_cm; o tutor deve sugerir 'Histograma' automaticamente.",
        explanation:
          'Histogramas dividem os dados em faixas (bins) e contam quantos pontos caem em cada uma. A forma revela muito.\n\nDistribuição Normal (Gaussiana): simétrica, em forma de sino. A maioria dos valores fica perto da média, com caudas iguais nos dois lados. Alturas de pessoas costumam ser assim.',
      },
      {
        id: 'step-3',
        title: 'Reconheça a Simetria',
        instruction: 'Vendo o histograma de alturas, qual é a melhor descrição?',
        action: 'multipleChoice',
        validation: {
          type: 'interpretation',
          correctAnswer: 'a',
          options: [
            {
              id: 'a',
              text: 'Simétrica em forma de sino. A maioria das pessoas está perto de uma altura média.',
              feedback: 'Perfeito! Isto é uma distribuição normal, muito comum na natureza.',
            },
            {
              id: 'b',
              text: 'Muito mais pessoas altas do que baixas.',
              feedback: 'Não, olhe novamente. O gráfico é equilibrado nos dois lados?',
            },
            {
              id: 'c',
              text: 'Padrão aleatório, sem forma clara.',
              feedback: 'Na verdade, há uma forma bem clara! Repare no pico no meio.',
            },
          ],
        },
        explanation:
          'A distribuição normal aparece em muitos contextos: alturas, pesos, notas de provas, erros de medição. Por quê? Muitos pequenos fatores aleatórios se somam (altura = genética + nutrição + ...), e isto naturalmente cria uma curva em sino.\n\nEsta forma importa porque muitos testes estatísticos assumem dados normais.',
      },
      {
        id: 'step-4',
        title: 'Comparar com Dados Enviesados',
        instruction:
          "Agora selecione 'salary' e crie um histograma. Compare com altura. O que é diferente?",
        action: 'chartSelection',
        validation: {
          type: 'chartType',
          expectedChartType: 'histogram',
          expectedFieldNames: ['salary'],
          errorMessage: "Você precisa de um histograma de 'salary' para continuar.",
        },
        hint: "Clique em 'salary' (desselecione height_cm) e peça o histograma.",
        explanation:
          'Distribuição enviesada (skewed): não é simétrica. A maioria dos dados fica de um lado, com uma cauda longa do outro.\n\nSkewed right (positiva): pico à esquerda, cauda longa à direita. Ex.: salários (muita gente ganha pouco, poucos ganham muito).\n\nSkewed left (negativa): pico à direita, cauda longa à esquerda. Ex.: notas de provas fáceis (muita gente tira nota alta, poucos tiram baixa).',
      },
      {
        id: 'step-5',
        title: 'Identifique o Enviesamento',
        instruction: 'Vendo o histograma de salários, qual descrição é correta?',
        action: 'multipleChoice',
        validation: {
          type: 'interpretation',
          correctAnswer: 'b',
          options: [
            {
              id: 'a',
              text: 'Normal, como as alturas.',
              feedback: 'Não, compare os dois histogramas. O de salário parece diferente?',
            },
            {
              id: 'b',
              text: 'Enviesado à direita. Maioria ganha pouco, minoria ganha muito.',
              feedback:
                'Exatamente! Isto é skewed right (positivamente enviesado), muito comum em dados econômicos.',
            },
            {
              id: 'c',
              text: 'Enviesado à esquerda, com CEOs no fim.',
              feedback: 'A cauda está à direita (valores altos), não à esquerda. Tente novamente.',
            },
          ],
        },
        explanation:
          'Salários costumam ser enviesados porque temos: muitos trabalhadores ganhando um valor base, alguns gerentes ganhando mais, e raros executivos ganhando muito.\n\nEsta distribuição tem skewness > 0 (direita). Por que isto importa? Muitos testes esperam dados normais; dados enviesados podem violar essas suposições e levar a resultados errados.',
      },
      {
        id: 'step-6',
        title: 'Entender Por Quê Transformar',
        instruction:
          "Para 'normalizar' dados enviesados, podemos aplicar uma transformação (como LOG). Você já sabia disto?",
        action: 'multipleChoice',
        validation: {
          type: 'knowledge',
          correctAnswer: 'a',
          options: [
            {
              id: 'a',
              text: 'Não, mas agora entendo por quê transformações são úteis.',
              feedback:
                'Ótimo! Você aprenderá a aplicar transformações na próxima lição dedicada a isto.',
            },
            {
              id: 'b',
              text: 'Já sabia, e agora entendo quando usar.',
              feedback: 'Perfeito! Você já está um passo à frente.',
            },
            {
              id: 'c',
              text: 'Não entendo por quê transformações ajudam.',
              feedback:
                'Ideia: imagine comprimir a cauda longa. Log faz isto! LOG(1M) = 6, LOG(10k) = 4, LOG(3k) = 3.5. A escala fica mais equilibrada.',
            },
          ],
        },
        explanation:
          'Transformação log: se você aplicar log a cada salário, a distribuição fica muito mais simétrica, porque log comprime os números grandes (a cauda longa).\n\nExemplo:\n- Salário 3.000 → log ≈ 3.48\n- Salário 30.000 → log ≈ 4.48\n- Salário 300.000 → log ≈ 5.48\n\nDiferenças menores = distribuição mais equilibrada. Você aprenderá a aplicar isto na próxima lição!',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'Distribuições descrevem como os dados estão espalhados.\n\nDistribuição normal (Gaussiana): simétrica, em forma de sino. Muito comum. Muitos testes a assumem.\n\nDistribuição enviesada: não simétrica. Skewed right = cauda longa à direita (salários, receita). Skewed left = cauda longa à esquerda (notas altas).\n\nPor que importa? Formas diferentes podem quebrar suposições de testes — e você pode precisar transformar os dados.',
      keyTakeaway:
        'Histogramas revelam padrões que números sozinhos não mostram. Sempre olhe a distribuição antes de análises mais complexas.',
    },
  },
  {
    id: 'comparing-groups',
    title: 'Comparando Grupos',
    description:
      'Use box plots para comparar uma variável numérica entre diferentes categorias.',
    difficulty: 'beginner',
    estimatedTime: '6 min',
    objectives: [
      'Entender quando comparar grupos é importante',
      'Ler e interpretar box plots lado a lado',
      'Identificar qual grupo tem média/mediana mais alta',
      'Reconhecer qual grupo tem mais variabilidade',
    ],
    exampleDatasetCsv: GROUPS_CSV,
    exampleFieldDescriptions: [
      {
        name: 'region',
        type: 'categorical',
        description: 'Região de vendas (Norte, Nordeste, Sudeste, Sul)',
      },
      { name: 'sales', type: 'numerical', description: 'Vendas mensais em mil reais' },
      { name: 'salesperson', type: 'categorical', description: 'Nome do vendedor' },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Entender a Questão',
        instruction:
          'Vamos explorar: as vendas são iguais em todas as regiões? Carregue o dataset.',
        action: 'upload',
        validation: {
          type: 'fieldTypes',
          expectedFields: [
            { name: 'region', type: 'categorical' },
            { name: 'sales', type: 'numerical' },
          ],
          errorMessage: "Certifique-se de que 'region' é categórica e 'sales' é numérica.",
        },
        hint: 'Use o arquivo de exemplo fornecido (botão Usar Exemplo).',
        explanation:
          'Quando você tem uma variável numérica (vendas) e uma categórica (região), você quer comparar a numérica entre os grupos. Box plots lado a lado são perfeitos para isto.',
      },
      {
        id: 'step-2',
        title: 'Criar Box Plots Comparativos',
        instruction:
          "Selecione 'region' e 'sales'. O tutor deve sugerir 'Box Plot Agrupado'. Gere o gráfico.",
        action: 'chartSelection',
        validation: {
          type: 'chartType',
          expectedChartType: 'grouped-box-plot',
          expectedFieldNames: ['region', 'sales'],
          errorMessage:
            'Você precisa de um box plot agrupado com a região no eixo X e vendas no eixo Y.',
        },
        hint: 'Após selecionar as duas variáveis, o tutor sugere este gráfico automaticamente.',
        explanation:
          'Box plot comparativo: um box plot para cada grupo, lado a lado.\n\nCada box mostra: linha dentro do box = mediana; fundo do box = Q1 (25º percentil); topo = Q3 (75º percentil); linhas fora = bigodes; pontos isolados = outliers.\n\nComparando visualmente, você vê logo qual grupo é maior ou menor.',
      },
      {
        id: 'step-3',
        title: 'Leia as Diferenças',
        instruction:
          'Olhe os 4 box plots. Qual região tem a mediana (linha no meio do box) mais alta?',
        action: 'multipleChoice',
        validation: {
          type: 'interpretation',
          correctAnswer: 'c',
          options: [
            {
              id: 'a',
              text: 'Norte',
              feedback: 'Olhe de novo. Qual box tem a linha do meio mais acima no gráfico?',
            },
            {
              id: 'b',
              text: 'Nordeste',
              feedback: 'Perto, mas não. Compare as linhas no meio de cada box.',
            },
            {
              id: 'c',
              text: 'Sudeste',
              feedback:
                'Correto! Sudeste tem a mediana mais alta, e também o box maior (mais variabilidade).',
            },
            { id: 'd', text: 'Sul', feedback: 'Sul está mais abaixo. Não é o mais alto.' },
          ],
        },
        explanation:
          'A linha dentro de cada box é a mediana, não a média. Mediana = valor do meio. Isso mostra que, em geral, o Sudeste vende mais que as outras regiões.',
      },
      {
        id: 'step-4',
        title: 'Identifique a Variabilidade',
        instruction:
          'Qual região tem a maior variabilidade nas vendas? (Box maior = mais espalhado)',
        action: 'multipleChoice',
        validation: {
          type: 'interpretation',
          correctAnswer: 'c',
          options: [
            {
              id: 'a',
              text: 'Norte tem a variabilidade maior.',
              feedback: 'Compare o tamanho dos boxes, não a posição. Qual é mais alto?',
            },
            {
              id: 'b',
              text: 'Nordeste tem a variabilidade maior.',
              feedback: 'Não, Nordeste é bem compacto (box pequeno).',
            },
            {
              id: 'c',
              text: 'Sudeste tem a variabilidade maior.',
              feedback:
                'Sim! Sudeste tem o box maior, ou seja, dados mais espalhados (IQR maior). Vendas variam bastante de mês para mês.',
            },
            {
              id: 'd',
              text: 'Não há diferença de variabilidade.',
              feedback: 'Olhe novamente. Os boxes têm tamanhos diferentes?',
            },
          ],
        },
        explanation:
          'Tamanho do box = variabilidade (IQR = Q3 - Q1). Box grande = dados espalhados = vendas variam muito. Box pequeno = dados concentrados = vendas consistentes.\n\nSudeste: box grande = vendas variam mês a mês. Pode ser risco (meses ruins) ou oportunidade (potencial alto). Nordeste: box pequeno = vendas consistentes e previsíveis.',
      },
      {
        id: 'step-5',
        title: 'Identifique Outliers',
        instruction:
          'Você vê pontos isolados fora dos boxes/bigodes? Qual região tem outliers?',
        action: 'multipleChoice',
        validation: {
          type: 'interpretation',
          correctAnswer: 'a',
          options: [
            {
              id: 'a',
              text: 'Sudeste tem um ponto isolado bem acima. É um outlier (mês excepcional).',
              feedback:
                'Correto! Esse ponto isolado é uma venda muito acima do normal para o Sudeste.',
            },
            {
              id: 'b',
              text: 'Nenhuma região tem outliers.',
              feedback: 'Olhe bem para cima. Há pontos desconectados dos bigodes?',
            },
            {
              id: 'c',
              text: 'Norte tem um outlier baixo.',
              feedback: 'Repare bem. Qual região tem pontos isolados?',
            },
          ],
        },
        explanation:
          'Outliers em box plots são pontos fora do padrão.\n\nNo Sudeste, esse ponto alto pode ser: um cliente grande fechou pedido (bom sinal), uma promoção especial, ou um erro de dados (sempre verifique). Não é automaticamente ruim — mas merece investigação.',
      },
      {
        id: 'step-6',
        title: 'Conclusão: O Que Isto Significa',
        instruction: 'Com base no gráfico, qual afirmação resume melhor?',
        action: 'multipleChoice',
        validation: {
          type: 'knowledge',
          correctAnswer: 'a',
          options: [
            {
              id: 'a',
              text: 'Sudeste é a região mais forte em vendas, mas com mais variabilidade. Nordeste é consistente, mas menor. Cada região tem dinâmica própria.',
              feedback:
                'Excelente! Você entendeu a análise. Isso levaria a estratégias diferentes (Sudeste = maximize o upside, Nordeste = estabilize).',
            },
            {
              id: 'b',
              text: 'Todas as regiões são iguais, o gráfico não mostra diferença.',
              feedback:
                'Olhe novamente. Os boxes estão em posições diferentes? Têm tamanhos diferentes?',
            },
            {
              id: 'c',
              text: 'Norte é a melhor região.',
              feedback:
                'Pelo gráfico, Sudeste tem mediana e volume maiores. Por que você acha que Norte é melhor?',
            },
          ],
        },
        explanation:
          'Box plots comparativos mostram rapidamente padrões entre grupos, sem tabelas ou números.\n\nUsos reais: vendas por região, salários por departamento, satisfação por produto, tempos de entrega por transportadora.\n\nPróximo passo: você já sabe comparar numérica × categórica. Falta o oposto: duas categóricas (heatmaps).',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'Box plots comparativos mostram distribuições de uma variável numérica por grupos categóricos.\n\nLer o gráfico: linha no meio = mediana; tamanho do box = variabilidade (IQR); pontos isolados = outliers.\n\nInsights rápidos: qual grupo é maior? Qual é mais consistente? Quais têm exceções?',
      keyTakeaway:
        'Comparar grupos visualmente é mais rápido que tabelas. Box plots são a ferramenta perfeita para isto.',
    },
  },
  {
    id: 'missing-data-basics',
    title: 'Dados Faltantes',
    description:
      'Identifique, entenda e decida o que fazer com dados faltantes (NAs, valores em branco).',
    difficulty: 'beginner',
    estimatedTime: '7 min',
    objectives: [
      'Reconhecer dados faltantes em datasets',
      'Entender por quê dados faltam (aleatório vs não-aleatório)',
      'Saber estratégias básicas (remover vs preencher vs manter)',
      'Entender o impacto na análise',
    ],
    exampleDatasetCsv: MISSING_CSV,
    exampleFieldDescriptions: [
      { name: 'respondent_id', type: 'numerical', description: 'ID do respondente' },
      { name: 'age', type: 'numerical', description: 'Idade (alguns faltam)' },
      {
        name: 'satisfaction',
        type: 'numerical',
        description: 'Nota de satisfação 1-10 (muitos faltam)',
      },
      {
        name: 'product_category',
        type: 'categorical',
        description: 'Categoria do produto',
      },
    ],
    steps: [
      {
        id: 'step-1',
        title: 'Reconhecer Dados Faltantes',
        instruction:
          'Carregue o dataset de pesquisa. Note que algumas células estão vazias — estes são dados faltantes.',
        action: 'upload',
        validation: {
          type: 'fieldTypes',
          expectedFields: [
            { name: 'respondent_id', type: 'numerical' },
            { name: 'age', type: 'numerical' },
            { name: 'satisfaction', type: 'numerical' },
            { name: 'product_category', type: 'categorical' },
          ],
          errorMessage: 'Certifique-se de carregar o arquivo correto, com dados faltantes.',
        },
        hint: 'O arquivo tem, propositalmente, algumas células vazias para você explorar.',
        explanation:
          'Dados faltantes (missing data): quando um valor esperado não está presente.\n\nSímbolos comuns: célula vazia, NA, N/A, -, —, ?.\n\nNão é automaticamente um erro. Pode ser: o respondente não quis responder, a pergunta não se aplica, erro de digitação/sistema, ou dado não coletado. Cada cenário pede uma estratégia diferente.',
      },
      {
        id: 'step-2',
        title: 'Quantifique a Ausência',
        instruction:
          "Olhe as colunas 'age' e 'satisfaction'. Qual parece ter mais dados faltantes? Estime percentualmente.",
        action: 'multipleChoice',
        validation: {
          type: 'interpretation',
          correctAnswer: 'a',
          options: [
            {
              id: 'a',
              text: "'Satisfaction' tem muito mais faltando (~30-40% dos dados) do que 'age' (~5%).",
              feedback:
                "Correto! 'Satisfaction' é a coluna problemática — muitos respondentes não responderam essa pergunta.",
            },
            {
              id: 'b',
              text: "'Age' tem mais dados faltantes.",
              feedback: "Olhe novamente. 'Age' tem bem poucos vazios comparado com 'satisfaction'.",
            },
            {
              id: 'c',
              text: 'Nenhuma coluna tem dados faltantes significativos.',
              feedback:
                "Procure mais atentamente. Há claramente espaços vazios, especialmente em 'satisfaction'.",
            },
          ],
        },
        explanation:
          'Documentar dados faltantes é o primeiro passo.\n\nVocê precisaria contar: total de linhas = 50; linhas com age faltante ≈ 3 (6%); linhas com satisfaction faltante ≈ 18 (36%). Essa informação muda o seu próximo passo!',
      },
      {
        id: 'step-3',
        title: 'Estratégia 1: Remover',
        instruction:
          'Uma estratégia é remover todas as linhas com qualquer valor faltante. Por que isto pode ser ruim?',
        action: 'multipleChoice',
        validation: {
          type: 'knowledge',
          correctAnswer: 'b',
          options: [
            {
              id: 'a',
              text: 'É sempre a melhor estratégia. Simples e direto.',
              feedback: 'Às vezes é ok, mas tem riscos. Continue.',
            },
            {
              id: 'b',
              text: 'Se 35% dos dados faltam, você perde 35% das linhas (dados valiosos) — e elas podem ser diferentes das que ficam (viés).',
              feedback:
                'Exatamente! Se pessoas insatisfeitas tendem a não responder, removê-las cria viés: seus dados ficam artificialmente positivos.',
            },
            {
              id: 'c',
              text: 'Remover nunca funciona.',
              feedback: 'Funciona em alguns casos, mas tem trade-offs.',
            },
          ],
        },
        explanation:
          'Remover (listwise/pairwise deletion):\n\nVantagens: simples, mantém dados "limpos", análises clássicas funcionam.\n\nRiscos: perder muitos dados e viés (missing not at random) — se dados faltam porque as pessoas estão insatisfeitas, remover torna a amostra enviesada.\n\nQuando usar: quando menos de 5% dos dados faltam e parecem aleatórios.',
      },
      {
        id: 'step-4',
        title: 'Estratégia 2: Preencher',
        instruction:
          'Outra estratégia é preencher os valores faltantes com a média, mediana ou moda. Qual é o risco?',
        action: 'multipleChoice',
        validation: {
          type: 'knowledge',
          correctAnswer: 'c',
          options: [
            {
              id: 'a',
              text: 'Imputação nunca funciona. Seus dados ficarão errados.',
              feedback:
                'Isso é um extremo. Imputação é usada em muitas análises reais, mas tem trade-offs.',
            },
            {
              id: 'b',
              text: 'Imputação é sempre perfeita. Trata o problema completamente.',
              feedback:
                "Não, há riscos. Se você preenche 'satisfaction' com a média (6.0), está inventando dados que não existem.",
            },
            {
              id: 'c',
              text: "Risco: você está 'inventando' dados. Isso reduz a variância artificialmente e pode criar padrões falsos.",
              feedback:
                'Correto. Se preenche muitos valores com a média, a distribuição fica mais concentrada e as relações podem se distorcer.',
            },
          ],
        },
        explanation:
          'Preencher (imputação):\n\nMétodos: média/mediana, forward fill (série temporal), regressão, KNN.\n\nVantagens: mantém o número de linhas; análises funcionam.\n\nRiscos: dados inventados não são reais; reduz variância artificial (testes ficam "significativos" demais); viés se o método for inadequado.\n\nQuando usar: quando menos de 10-15% faltam, de forma aleatória, e você documenta que imputou.',
      },
      {
        id: 'step-5',
        title: 'Estratégia 3: Manter e Investigar',
        instruction:
          'Às vezes a resposta é não fazer nada — apenas documentar e investigar o porquê. Quando isto faz sentido? Escreva:',
        action: 'textAnswer',
        validation: {
          type: 'textMatch',
          keywords: ['investigar', 'porque', 'padrão', 'significado', 'estudo', 'documentar', 'por que'],
          partialCredit: true,
          feedback:
            'Boa resposta! Dados faltantes podem ser informativos. Se 35% não respondeu satisfaction, por quê? Talvez insatisfeitos silenciaram, talvez a pergunta foi mal feita. Investigar pode ser mais importante que "consertar".',
        },
        explanation:
          'Às vezes o fato de alguém não responder é tão informativo quanto uma resposta explícita. Investigue antes de agir.',
        hint: 'Pense em casos onde o fato de alguém NÃO responder é tão importante quanto uma resposta explícita.',
      },
      {
        id: 'step-6',
        title: 'Aplicar ao Seu Dataset',
        instruction:
          "Para o dataset de pesquisa, qual estratégia você escolheria para 'satisfaction' com 35% faltando?",
        action: 'multipleChoice',
        validation: {
          type: 'knowledge',
          correctAnswer: 'a',
          options: [
            {
              id: 'a',
              text: 'Investigar por quê faltam, e então remover OU imputar, dependendo do padrão. Nunca às cegas.',
              feedback:
                'Perfeito! Dados faltantes acima de 30% pedem investigação. Entenda o problema antes de escolher a solução.',
            },
            {
              id: 'b',
              text: 'Remover todas as linhas com satisfaction faltante (perde 35% dos dados).',
              feedback: 'Possível, mas você perde muito. Investigação primeiro.',
            },
            {
              id: 'c',
              text: 'Preencher com a média automaticamente.',
              feedback:
                'Arriscado sem investigação. Qual é a média? Qual é o padrão do NA? Sem isso, você está adivinhando.',
            },
          ],
        },
        explanation:
          'Fluxo recomendado:\n1. Quantificar: % de NAs por coluna.\n2. Investigar: por que faltam? (aleatório? padrão?)\n3. Decidir: remover, imputar, manter, ou análise de sensibilidade.\n4. Documentar: o que você fez e por quê.\n5. Analisar: com os dados conforme decidido.\n\nSem esses passos, suas conclusões podem ser enganosas!',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'Dados faltantes são comuns e precisam de atenção.\n\nReconhecimento: células vazias, NA, —, ?.\n\nTrês estratégias: remover (simples, mas pode perder dados e criar viés), preencher (mantém n, mas inventa dados), investigar e documentar (entender por que faltam).\n\nBoas práticas: sempre quantifique % de NAs, investigue padrões, documente a decisão.\n\nNunca ignore dados faltantes — como você lida com eles pode mudar completamente suas conclusões.',
      keyTakeaway:
        "Dados faltantes não são um problema a 'consertar' cegamente. São uma oportunidade para entender melhor seus dados.",
    },
  },
];
