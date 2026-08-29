import { MathematicalProcess } from './process.types';

/**
 * One mathematical process — the RC charging circuit — walked from physical
 * observation to the final derivative. Content is in Portuguese, matching
 * the rest of the site.
 */
export const RC_CHARGING_PROCESS: MathematicalProcess = {
  scenario: {
    label: 'A situação',
    title: 'Com que rapidez um circuito RC está carregando agora?',
    description:
      'Um sensor eletrônico está conectado a um capacitor em carregamento. O sensor só deve ser ativado quando a tensão do capacitor estiver variando devagar o suficiente. Precisamos determinar a taxa instantânea de carregamento em um instante específico.',
    tags: [
      'Engenharia elétrica',
      'Limites',
      'Continuidade',
      'Derivadas',
      'Taxa de variação',
    ],
  },

  stages: [
    {
      id: 'situation',
      flowLabel: 'Situação',
      title: 'Comece pela situação física',
      purpose:
        'Antes de escrever uma fórmula, identifique o que está mudando, o que está sendo medido e qual decisão o engenheiro precisa tomar.',
      visual: 'circuit',
      visualTitle: 'Um capacitor carregando',
      visualCaption:
        'A tensão sobe rapidamente no início e depois se aproxima de um valor máximo.',
      formulas: [
        {
          label: 'O que sabemos',
          latex: String.raw`V_{\max}=12\text{ V},\qquad \tau=3\text{ s}`,
        },
        {
          label: 'O que precisamos',
          latex: String.raw`\text{Com que rapidez }V\text{ muda em }t=3\text{ s}?`,
        },
      ],
      metrics: [
        { label: 'Tensão máxima', value: '12 V' },
        { label: 'Constante de tempo', value: '3 s' },
        { label: 'Instante alvo', value: '3 s' },
      ],
      reasoning: {
        lead: 'Tradução:',
        text: 'a pergunta física não pede a tensão em si. Ela pede uma taxa: quantos volts por segundo estão sendo acrescentados em um único instante.',
      },
      controls: 'none',
    },

    {
      id: 'model',
      flowLabel: 'Modelo',
      title: 'Construa o modelo',
      purpose:
        'Represente o processo de carregamento com uma função cujas variáveis ainda mantêm seu significado físico.',
      visual: 'model',
      visualTitle: 'Tensão em função do tempo',
      visualCaption:
        'O eixo horizontal é o tempo em segundos. O eixo vertical é a tensão do capacitor em volts.',
      formulas: [
        {
          label: 'Modelo físico',
          latex: String.raw`V(t)=V_{\max}\left(1-e^{-t/\tau}\right)`,
        },
        {
          label: 'Insira os valores do circuito',
          latex: String.raw`V(t)=12\left(1-e^{-t/3}\right)`,
        },
      ],
      metrics: [
        { label: 'Variável de entrada', value: 'tempo t' },
        { label: 'Variável de saída', value: 'tensão V(t)' },
        { label: 'Unidades', value: 'volts' },
      ],
      reasoning: {
        lead: 'Significado:',
        text: 'a função não é apenas uma expressão a ser manipulada. Ela associa cada tempo t à tensão atingida pelo capacitor naquele tempo.',
      },
      controls: 'time',
    },

    {
      id: 'limit-continuity',
      flowLabel: 'Continuidade',
      title: 'Pergunte se o processo é contínuo',
      purpose:
        'O processo físico de carregamento parece suave. Use um limite para verificar o que acontece quando o tempo se aproxima do instante alvo.',
      visual: 'limit',
      visualTitle: 'Aproximando-se de t = 3 segundos',
      visualCaption:
        'Os pontos se aproximam do instante alvo pelos dois lados.',
      formulas: [
        {
          label: 'A pergunta',
          latex: String.raw`\lim_{t\to 3}V(t)=?`,
        },
        {
          label: 'Substitua o instante alvo',
          latex: String.raw`\lim_{t\to 3}12\left(1-e^{-t/3}\right)`,
        },
      ],
      metrics: [
        { label: 'Aproximação pela esquerda', value: 'mesmo valor' },
        { label: 'Aproximação pela direita', value: 'mesmo valor' },
        { label: 'Continuidade', value: 'sim' },
      ],
      reasoning: {
        lead: 'Continuidade:',
        text: 'como o modelo se aproxima da mesma tensão pelos dois lados e a função está definida em t = 3, o processo de tensão é contínuo no instante que queremos estudar.',
      },
      controls: 'approach',
    },

    {
      id: 'find-limit',
      flowLabel: 'Limite',
      title: 'Encontre o limite',
      purpose:
        'Agora calcule a tensão da qual o modelo se aproxima quando o tempo se aproxima do alvo.',
      visual: 'limit',
      visualTitle: 'A tensão limite',
      visualCaption:
        'Os valores que se aproximam convergem para a tensão em t = 3 segundos.',
      formulas: [
        {
          label: 'Comece pelo limite',
          latex: String.raw`\lim_{t\to 3}12\left(1-e^{-t/3}\right)`,
        },
        {
          label: 'Como a função é contínua',
          latex: String.raw`=12\left(1-e^{-3/3}\right)`,
        },
        {
          label: 'Calcule',
          latex: String.raw`=12\left(1-e^{-1}\right)\approx 7.585\text{ V}`,
        },
      ],
      metrics: [
        { label: 'Tensão perto de 3 s', value: '≈ 7.585 V' },
        { label: 'Valor da função V(3)', value: '≈ 7.585 V' },
        { label: 'Limite existe', value: 'sim' },
      ],
      reasoning: {
        lead: 'Distinção importante:',
        text: 'o limite descreve o valor do qual os tempos vizinhos se aproximam. A continuidade nos permite identificar esse valor com a tensão real em t = 3.',
      },
      controls: 'approach',
    },

    {
      id: 'secant',
      flowLabel: 'Secante',
      title: 'Da variação média à secante',
      purpose:
        'Uma taxa ao longo de um intervalo dá uma taxa média de carregamento. Agora comparamos o instante alvo com um tempo vizinho.',
      visual: 'secant',
      visualTitle: 'Duas medidas vizinhas',
      visualCaption:
        'A reta liga duas medidas e representa a variação média da tensão.',
      formulas: [
        {
          label: 'Taxa média de variação',
          latex: String.raw`\frac{V(3+h)-V(3)}{h}`,
        },
        {
          label: 'Com o modelo do circuito',
          latex: String.raw`\frac{12(1-e^{-(3+h)/3})-12(1-e^{-1})}{h}`,
        },
      ],
      metrics: [
        { label: 'Tempo alvo', value: '3 s' },
        { label: 'Segundo tempo', value: '3 + h' },
        { label: 'Interpretação', value: 'taxa média' },
      ],
      reasoning: {
        lead: 'Significado da secante:',
        text: 'a inclinação da secante informa quantos volts por segundo o capacitor ganhou entre dois instantes distintos.',
      },
      controls: 'h',
    },

    {
      id: 'tangent',
      flowLabel: 'Tangente',
      title: 'Deixe a secante virar tangente',
      purpose:
        'Para obter a taxa em exatamente um instante, encolha o intervalo até a segunda medida se aproximar da medida alvo.',
      visual: 'tangent',
      visualTitle: 'A secante se aproximando da tangente',
      visualCaption:
        'Conforme h se aproxima de zero, a reta secante se aproxima da reta tangente em t = 3.',
      formulas: [
        {
          label: 'Encolha o intervalo',
          latex: String.raw`h\to 0`,
        },
        {
          label: 'Tome o limite da inclinação da secante',
          latex: String.raw`\lim_{h\to 0}\frac{V(3+h)-V(3)}{h}`,
        },
        {
          label: 'Isto é a derivada',
          latex: String.raw`V'(3)`,
        },
      ],
      metrics: [
        { label: 'Intervalo h', value: 'ajustável' },
        { label: 'Inclinação da secante', value: 'ajustável' },
        { label: 'Inclinação da tangente', value: 'instantânea' },
      ],
      reasoning: {
        lead: 'Transição-chave:',
        text: 'a derivada não é uma grandeza física nova inventada depois. Ela é o valor limite das taxas médias em intervalos cada vez menores.',
      },
      controls: 'h',
    },

    {
      id: 'differentiate',
      flowLabel: 'Derivada',
      title: 'Transforme a fórmula',
      purpose:
        'Aplique as regras de derivação acompanhando o que cada fator significa no circuito.',
      visual: 'derivative',
      visualTitle: 'Tensão e taxa de carregamento',
      visualCaption:
        'A curva da tensão e sua derivada são mostradas juntas.',
      formulas: [
        {
          label: 'Modelo original',
          latex: String.raw`V(t)=12\left(1-e^{-t/3}\right)`,
        },
        {
          label: 'Derive',
          latex: String.raw`V'(t)=\frac{12}{3}e^{-t/3}`,
        },
        {
          label: 'Simplifique',
          latex: String.raw`V'(t)=4e^{-t/3}`,
        },
      ],
      metrics: [
        { label: 'Derivada', value: '4e^(-t/3)' },
        { label: 'Unidade', value: 'volts por segundo' },
        { label: 'Em t = 3', value: '≈ 1.4715 V/s' },
      ],
      reasoning: {
        lead: 'Significado físico:',
        text: "V'(t) é a taxa instantânea de carregamento. Suas unidades são volts por segundo, exatamente o que a pergunta de engenharia pede.",
      },
      controls: 'time',
    },

    {
      id: 'result',
      flowLabel: 'Resultado',
      title: 'Chegue ao resultado de engenharia',
      purpose:
        'Substitua o instante alvo, interprete o número e conecte o processo matemático completo de volta à decisão do sensor.',
      visual: 'result',
      visualTitle: 'A taxa final de carregamento',
      visualCaption:
        'Em t = 3 segundos, a inclinação da tangente é a taxa instantânea de carregamento.',
      formulas: [
        {
          label: 'Derivada',
          latex: String.raw`V'(t)=4e^{-t/3}`,
        },
        {
          label: 'Calcule em t = 3',
          latex: String.raw`V'(3)=4e^{-3/3}`,
        },
        {
          label: 'Resultado final',
          latex: String.raw`V'(3)=4e^{-1}\approx 1.4715\text{ V/s}`,
        },
      ],
      metrics: [
        { label: 'Tensão em t = 3', value: '≈ 7.585 V' },
        { label: 'Taxa de carregamento', value: '≈ 1.4715 V/s' },
        { label: 'Significado de engenharia', value: 'taxa instantânea' },
      ],
      reasoning: {
        lead: 'Conclusão:',
        text: 'após 3 segundos, a tensão do capacitor é aproximadamente 7.585 V e ainda cresce a aproximadamente 1.4715 volts por segundo. A derivada responde à pergunta física original.',
      },
      controls: 'result',
    },
  ],

  finalResult: {
    title: 'A cadeia completa',
    description:
      'Você começou com uma pergunta física sobre um capacitor e terminou com uma derivada que mede sua taxa instantânea de carregamento. Cada transformação de fórmula preservou o significado da situação original.',
    label: 'Resultado final',
    latex: String.raw`V'(3)=4e^{-1}\approx 1.4715\text{ V/s}`,
  },
};
