import { AppliedProblem } from './calculus-practice.types';

/**
 * The applied-problem catalogue. Each problem starts from a concrete,
 * real-world decision or measurement; the student uses the derivative to
 * answer it, and the takeaway generalizes the result back to the concept.
 */
export const APPLIED_PROBLEMS: AppliedProblem[] = [
  {
    id: 'rc-circuit',
    area: 'elétrica',
    title: 'Velocidade de carregamento de um capacitor',
    scenarioTitle: 'Um sensor precisa carregar rapidamente',
    scenario:
      'Um circuito RC alimenta um sensor. A tensão no capacitor cresce com o tempo, mas a velocidade desse crescimento diminui. O engenheiro precisa saber a taxa instantânea de aumento da tensão exatamente em t = 2 segundos para decidir se o sensor já pode ser ativado.',
    prompt:
      'Calcule a taxa instantânea de variação da tensão no capacitor no instante t = 2 s.',
    formula: String.raw`V(t)=5\left(1-e^{-0.5t}\right)\ \text{volts}`,
    answerLabel: 'Taxa de variação em volts por segundo',
    answer: 1.8394,
    tolerance: 0.03,
    hint:
      'Derive V(t). A derivada de e^{-0.5t} envolve o fator -0.5. Depois substitua t = 2.',
    concepts: [
      {
        title: 'Derivada como taxa',
        text: "V'(t) informa quão rapidamente a tensão está mudando.",
      },
      {
        title: 'Regra da cadeia',
        text: 'A exponencial possui uma função interna -0.5t.',
      },
      {
        title: 'Interpretação física',
        text: 'O resultado é uma velocidade de carregamento, não apenas um número.',
      },
    ],
    solution: [
      { latex: String.raw`V'(t)=5\cdot 0.5e^{-0.5t}=2.5e^{-0.5t}` },
      { latex: String.raw`V'(2)=2.5e^{-1}\approx 1.8394\ \text{V/s}` },
    ],
    visualization: 'rc',
    takeaway:
      "A derivada responde a pergunta 'quão rápido agora?'. V'(t) é a taxa de carregamento no instante exato, não a média de um intervalo.",
  },

  {
    id: 'braking-distance',
    area: 'mecânica',
    title: 'Distância de frenagem',
    scenarioTitle: 'Um veículo inicia uma frenagem',
    scenario:
      'Durante um teste, a distância percorrida por um veículo depois do acionamento do freio é aproximada por s(t) = 24t - 3t², em metros, para os primeiros segundos. A equipe quer descobrir quando o veículo deixa de avançar e começa a estar completamente parado.',
    prompt:
      'Em quantos segundos o veículo atinge velocidade instantânea igual a zero?',
    formula: String.raw`s(t)=24t-3t^2\ \text{metros}`,
    answerLabel: 'Tempo até a velocidade ser zero, em segundos',
    answer: 4,
    tolerance: 0.02,
    hint:
      'A velocidade é a derivada da distância. Derive s(t), iguale a zero e resolva a equação.',
    concepts: [
      {
        title: 'Posição e velocidade',
        text: 'A derivada da posição representa a velocidade.',
      },
      {
        title: 'Ponto crítico',
        text: 'A velocidade zero indica um ponto crítico da posição.',
      },
      {
        title: 'Modelo mecânico',
        text: 'O polinômio aproxima o movimento sob desaceleração constante.',
      },
    ],
    solution: [
      { latex: String.raw`v(t)=s'(t)=24-6t` },
      { latex: String.raw`24-6t=0\quad\Rightarrow\quad t=4\ \text{s}` },
    ],
    visualization: 'braking',
    takeaway:
      'Igualar a derivada a zero localiza o instante em que a mudança para. Um ponto crítico deixa de ser abstrato: aqui ele responde a uma decisão de engenharia.',
  },

  {
    id: 'architectural-window',
    area: 'arquitetura',
    title: 'Janela com área máxima',
    scenarioTitle: 'Projetar uma janela usando uma moldura limitada',
    scenario:
      'Uma parede tem espaço para uma janela retangular. O arquiteto possui 20 metros de moldura para contornar a janela e quer obter a maior área envidraçada possível. A largura será x e a altura será 10 - x.',
    prompt:
      'Qual deve ser a largura x, em metros, para maximizar a área da janela?',
    formula: String.raw`A(x)=x(10-x)=10x-x^2`,
    answerLabel: 'Largura ótima x, em metros',
    answer: 5,
    tolerance: 0.02,
    hint:
      'Encontre onde A\'(x) = 0. Depois verifique se esse ponto é um máximo observando o formato da parábola.',
    concepts: [
      {
        title: 'Otimização',
        text: 'Maximizar a área significa localizar um ponto crítico.',
      },
      {
        title: 'Derivada nula',
        text: 'No topo da parábola, a inclinação é zero.',
      },
      {
        title: 'Restrição geométrica',
        text: 'A altura 10 - x vem do limite de moldura disponível.',
      },
    ],
    solution: [
      { latex: String.raw`A'(x)=10-2x` },
      { latex: String.raw`10-2x=0\quad\Rightarrow\quad x=5\ \text{m}` },
      { latex: String.raw`A''(x)=-2<0,\text{ portanto o ponto é um máximo}` },
    ],
    visualization: 'window',
    takeaway:
      'Otimizar é procurar onde a derivada se anula e confirmar o máximo pela concavidade. A derivada vira uma ferramenta de projeto, não um cálculo sem destino.',
  },

  {
    id: 'algorithm-cost',
    area: 'programação',
    title: 'Custo marginal de um algoritmo',
    scenarioTitle: 'Estimar o custo de processar mais dados',
    scenario:
      'Um serviço de processamento mede seu custo aproximado por C(n) = 0,02n² + 4n + 100, em unidades de custo, para um lote de n itens. A equipe quer estimar quanto o custo aumenta quando o lote possui 50 itens.',
    prompt:
      'Qual é o custo marginal C\'(50), isto é, o custo aproximado de adicionar mais um item ao lote?',
    formula: String.raw`C(n)=0.02n^2+4n+100`,
    answerLabel: 'Custo marginal em unidades de custo por item',
    answer: 6,
    tolerance: 0.02,
    hint:
      'O custo marginal é a derivada de C(n). Derive o polinômio e substitua n = 50.',
    concepts: [
      {
        title: 'Derivada em programação',
        text: 'A derivada aproxima o impacto de uma pequena mudança na entrada.',
      },
      {
        title: 'Custo marginal',
        text: "C'(n) estima o custo de adicionar uma unidade ao tamanho do lote.",
      },
      {
        title: 'Escalabilidade',
        text: 'O termo quadrático faz o custo marginal crescer com n.',
      },
    ],
    solution: [
      { latex: String.raw`C'(n)=0.04n+4` },
      { latex: String.raw`C'(50)=0.04(50)+4=6` },
    ],
    visualization: 'algorithm',
    takeaway:
      'A derivada mede o efeito local de uma pequena mudança. C\'(n) é o custo marginal: a leitura instantânea de como o sistema escala.',
  },

  {
    id: 'revenue-max',
    area: 'economia',
    title: 'Preço que maximiza a receita',
    scenarioTitle: 'Uma loja precisa escolher seu preço',
    scenario:
      'Uma loja estima que venderá q(p) = 120 - 4p unidades quando o preço for p reais. A receita é o preço multiplicado pela quantidade vendida. O gestor quer descobrir qual preço maximiza a receita.',
    prompt: 'Qual preço p maximiza a receita estimada?',
    formula: String.raw`R(p)=p(120-4p)=120p-4p^2`,
    answerLabel: 'Preço ótimo em reais',
    answer: 15,
    tolerance: 0.02,
    hint:
      "Escreva a receita como função do preço. Encontre o ponto em que R'(p) = 0.",
    concepts: [
      {
        title: 'Produto de variáveis',
        text: 'A receita depende simultaneamente do preço e da quantidade.',
      },
      {
        title: 'Otimização econômica',
        text: 'O ponto de maior receita ocorre quando a derivada muda de positiva para negativa.',
      },
      {
        title: 'Interpretação',
        text: 'Um preço maior por unidade pode reduzir demais o número de compradores.',
      },
    ],
    solution: [
      { latex: String.raw`R(p)=120p-4p^2` },
      { latex: String.raw`R'(p)=120-8p` },
      { latex: String.raw`120-8p=0\quad\Rightarrow\quad p=15` },
    ],
    visualization: 'revenue',
    takeaway:
      'A receita máxima não está no preço mais alto, mas onde a derivada muda de sinal: o equilíbrio entre preço e quantidade comprada.',
  },

  {
    id: 'tank-flow',
    area: 'mecânica',
    title: 'Volume de água em um tanque',
    scenarioTitle: 'Controlar o nível de um tanque cilíndrico',
    scenario:
      'Um tanque cilíndrico vertical tem raio constante de 2 metros. Uma bomba aumenta a altura da água segundo h(t) = 0,4t + 1. O sistema precisa saber a taxa instantânea de crescimento do volume quando t = 5 minutos.',
    prompt:
      'Qual é a taxa de crescimento do volume do tanque em m³/min?',
    formula: String.raw`V(t)=\pi r^2h(t),\quad r=2,\quad h(t)=0.4t+1`,
    answerLabel: 'Taxa de variação do volume em m³/min',
    answer: 5.0265,
    tolerance: 0.03,
    hint:
      'Substitua r = 2 e h(t) na fórmula do volume. Depois derive em relação ao tempo.',
    concepts: [
      {
        title: 'Variáveis relacionadas',
        text: 'O volume depende da altura, que depende do tempo.',
      },
      {
        title: 'Regra da cadeia',
        text: 'A mudança do volume acompanha a mudança da altura.',
      },
      {
        title: 'Modelo geométrico',
        text: 'O raio constante transforma o problema em uma relação linear com h.',
      },
    ],
    solution: [
      { latex: String.raw`V(t)=\pi(2)^2(0.4t+1)=4\pi(0.4t+1)` },
      { latex: String.raw`V'(t)=1.6\pi\approx 5.0265\ \text{m}^3/\text{min}` },
    ],
    visualization: 'tank',
    takeaway:
      'Com o raio fixo, a regra da cadeia conecta a altura à mudança de volume. Variáveis relacionadas se traduzem em uma única taxa instantânea.',
  },
];
