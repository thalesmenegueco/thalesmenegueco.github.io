import { Lesson } from './calculus.types';

/**
 * The lesson catalogue. Each lesson opens with a concrete scenario and keeps
 * its steps grounded in that scenario's variables until the final step, which
 * names the general formula. Content is in Portuguese, matching the rest of
 * the site.
 */
export const LESSONS: Lesson[] = [
  {
    id: 'what-is-a-limit',
    unit: 'Unidade 1 — Limites e continuidade',
    title: 'O que é um limite?',
    description:
      'Estime a velocidade de um carro quando o velocímetro falha exatamente no ponto de interesse.',
    estimatedTime: '8 min',
    scenario:
      'Você está analisando os dados de um carro entre os marcos 2 e 3 de uma estrada. O velocímetro falhou exatamente no marco 2, mas os dados de distância ao redor desse ponto ainda estão disponíveis. Como estimar o comportamento do carro quando ele se aproxima do marco 2?',
    objectives: [
      'Interpretar aproximação como um padrão de valores.',
      'Comparar aproximações pela esquerda e pela direita.',
      'Relacionar esse padrão à notação de limite.',
    ],
    steps: [
      {
        title: 'Observe a aproximação',
        instruction:
          'Veja os valores da posição do carro conforme o tempo se aproxima de 2 segundos. Você não precisa saber o valor exatamente em t = 2 para observar para onde os valores estão indo.',
        widget: 'limitExplorer',
        validation: { type: 'limitTableCompletion', target: 4 },
        explanation:
          'O limite descreve o valor que uma função se aproxima quando a variável se aproxima de determinado ponto. O foco não é necessariamente o valor da função no ponto, mas o comportamento ao redor dele.',
      },
      {
        title: 'Compare os dois lados',
        instruction:
          'Ajuste a distância da observação. Quando usamos valores menores que 2 e valores maiores que 2, os dois lados parecem se aproximar do mesmo número?',
        widget: 'limitExplorer',
        validation: { type: 'limitTableCompletion', target: 0.2 },
        explanation:
          'Quando as aproximações pela esquerda e pela direita chegam ao mesmo valor, temos evidência de que o limite existe. Esse raciocínio será útil mesmo quando a função não estiver definida exatamente no ponto.',
      },
      {
        title: 'Dê nome ao padrão',
        instruction:
          'Agora conecte o que você observou ao símbolo matemático que representa a aproximação da posição do carro.',
        widget: 'formulaMatch',
        options: [
          {
            id: 'a',
            latex: String.raw`\lim_{t \to 2} s(t) = 4`,
            feedback:
              'Correto. A posição s(t) se aproxima de 4 quando t se aproxima de 2.',
          },
          {
            id: 'b',
            latex: String.raw`s(2) = \lim_{t \to 4} s(t)`,
            feedback:
              'Observe o ponto do tempo que está se aproximando: estamos indo em direção a t = 2.',
          },
        ],
        validation: { type: 'formulaMatch', correctAnswer: 'a' },
        explanation: String.raw`A notação geral é $$\lim_{x \to a} f(x) = L$$. Ela significa que f(x) se aproxima de L quando x se aproxima de a.`,
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'Um limite é uma forma de descrever o comportamento de uma função perto de um ponto. Ele transforma uma pergunta sobre aproximação em uma ideia matemática precisa.',
      keyTakeaway:
        'Antes de calcular um limite, pergunte: para qual valor a situação está caminhando?',
    },
  },

  {
    id: 'limits-do-not-exist',
    unit: 'Unidade 1 — Limites e continuidade',
    title: 'Quando os limites não existem',
    description:
      'Analise um sinal que apresenta uma falha, um salto ou um crescimento sem limite.',
    estimatedTime: '8 min',
    scenario:
      'Uma estação de monitoramento recebe um sinal cuja leitura apresenta uma falha perto de t = 2. Dependendo do tipo de falha, os valores podem chegar a números diferentes pelos dois lados, ou crescer indefinidamente. Como distinguir esses casos?',
    objectives: [
      'Identificar limites laterais diferentes.',
      'Reconhecer uma assíntota vertical.',
      'Entender por que alguns limites não existem.',
    ],
    steps: [
      {
        title: 'Um salto no sinal',
        instruction:
          'Escolha o modo de salto e observe o que acontece quando t se aproxima de 2 pela esquerda e pela direita.',
        widget: 'discontinuityExplorer',
        validation: { type: 'modeSelection', target: 'jump' },
        explanation:
          'Se o valor aproximado pela esquerda é diferente do valor aproximado pela direita, o limite bilateral não existe.',
      },
      {
        title: 'Uma explosão de valores',
        instruction:
          'Mude para o modo de assíntota. Observe como os valores crescem sem se aproximar de um número finito.',
        widget: 'discontinuityExplorer',
        validation: { type: 'modeSelection', target: 'asymptote' },
        explanation:
          'Em uma assíntota vertical, a função pode crescer indefinidamente quando x se aproxima de um determinado valor. Dizemos que o limite diverge ou que não existe como número finito.',
      },
      {
        title: 'Classifique o comportamento',
        instruction:
          'Escolha a afirmação que melhor descreve o sinal no modo atualmente selecionado.',
        widget: 'formulaMatch',
        options: [
          {
            id: 'a',
            latex: String.raw`\lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x)`,
            feedback:
              'Essa igualdade descreve um limite bilateral existente, não um salto.',
          },
          {
            id: 'b',
            latex: String.raw`\lim_{x \to a^-} f(x) \ne \lim_{x \to a^+} f(x)`,
            feedback:
              'Correto para o salto: os dois lados se aproximam de valores diferentes.',
          },
        ],
        validation: { type: 'formulaMatch', correctAnswer: 'b' },
        explanation:
          'Os limites laterais são ferramentas para investigar o que ocorre de cada lado. O limite bilateral só existe quando os dois lados concordam.',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'Um limite pode falhar porque os lados não concordam ou porque os valores crescem sem se aproximar de um número finito.',
      keyTakeaway:
        'Sempre investigue separadamente o que acontece pela esquerda e pela direita.',
    },
  },

  {
    id: 'continuity',
    unit: 'Unidade 1 — Limites e continuidade',
    title: 'Continuidade',
    description:
      'Descubra quando o caminho de uma função é suave e quando existe uma quebra.',
    estimatedTime: '7 min',
    scenario:
      'O sistema de controle de uma rampa ajusta sua altura continuamente. Se a posição calculada dá um salto repentino ou se há um buraco no caminho, o equipamento pode falhar. Como verificar matematicamente se a função representa uma transição contínua?',
    objectives: [
      'Conectar limite e valor da função.',
      'Diferenciar um buraco de uma quebra.',
      'Usar as três condições de continuidade.',
    ],
    steps: [
      {
        title: 'A função chega ao mesmo lugar?',
        instruction:
          'Use o controle para escolher entre uma transição contínua e uma função com buraco. Observe o limite e o valor da função no ponto.',
        widget: 'continuityExplorer',
        validation: { type: 'continuityToggle', target: 'continuous' },
        explanation:
          'Uma função é contínua em x = a quando está definida em a, o limite existe e o limite é igual ao valor da função.',
      },
      {
        title: 'Crie uma quebra',
        instruction:
          'Alterne para o modo com buraco. O gráfico se aproxima de um valor, mas a função não entrega esse valor no ponto.',
        widget: 'continuityExplorer',
        validation: { type: 'continuityToggle', target: 'hole' },
        explanation:
          'Um buraco ocorre quando o limite existe, mas a função não está definida no ponto ou possui outro valor nesse ponto.',
      },
      {
        title: 'Nomeie as condições',
        instruction:
          'Selecione a combinação que caracteriza continuidade em x = a.',
        widget: 'formulaMatch',
        options: [
          {
            id: 'a',
            latex: String.raw`f(a)\text{ existe},\quad \lim_{x \to a}f(x)\text{ existe},\quad \lim_{x \to a}f(x)=f(a)`,
            feedback:
              'Correto. As três condições precisam ser satisfeitas.',
          },
          {
            id: 'b',
            latex: String.raw`\lim_{x \to a}f(x)=0\text{ sempre}`,
            feedback:
              'Continuidade não exige que o limite seja zero; exige que ele coincida com f(a).',
          },
        ],
        validation: { type: 'formulaMatch', correctAnswer: 'a' },
        explanation:
          'A continuidade formaliza a ideia de poder percorrer o gráfico sem saltos, buracos ou interrupções naquele ponto.',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'Continuidade significa que o valor da função, o limite e o ponto observado estão alinhados.',
      keyTakeaway:
        'Para testar continuidade, verifique: a função existe? o limite existe? os dois valores são iguais?',
    },
  },

  {
    id: 'slope-of-curve',
    unit: 'Unidade 2 — Derivadas',
    title: 'A inclinação de uma curva',
    description:
      'Compare a velocidade média de um carro com sua velocidade instantânea.',
    estimatedTime: '9 min',
    scenario:
      'Um carro percorre uma estrada. O computador informa a distância em diferentes instantes, mas você precisa saber a velocidade exatamente no instante t = 3 segundos. A velocidade média entre dois momentos é suficiente para responder?',
    objectives: [
      'Calcular uma taxa média de variação.',
      'Perceber por que um único intervalo é insuficiente.',
      'Motivar a ideia de taxa instantânea.',
    ],
    steps: [
      {
        title: 'Calcule a velocidade média',
        instruction:
          'Ajuste o segundo instante e observe a velocidade média entre t = 3 e o instante escolhido.',
        widget: 'averageSlopeExplorer',
        validation: { type: 'range', targetParam: 'b', targetRange: [4, 5] },
        explanation: String.raw`A velocidade média é a variação da distância dividida pela variação do tempo: $$\frac{s(b)-s(a)}{b-a}$$.`,
      },
      {
        title: 'Diminua o intervalo',
        instruction:
          'Aproxime o segundo instante de t = 3. O que acontece com a estimativa da velocidade?',
        widget: 'averageSlopeExplorer',
        validation: {
          type: 'range',
          targetParam: 'b',
          targetRange: [3.05, 3.3],
        },
        explanation:
          'Ao diminuir o intervalo, a taxa média passa a representar melhor o comportamento do carro perto do instante de interesse.',
      },
      {
        title: 'A pergunta instantânea',
        instruction:
          'Selecione a fórmula que transforma a velocidade média em uma velocidade no instante exato.',
        widget: 'formulaMatch',
        options: [
          {
            id: 'a',
            latex: String.raw`v(3)=\lim_{b\to 3}\frac{s(b)-s(3)}{b-3}`,
            feedback:
              'Correto. A velocidade instantânea surge como um limite de velocidades médias.',
          },
          {
            id: 'b',
            latex: String.raw`v(3)=s(3)\cdot 3`,
            feedback:
              'Isso não compara variação de distância com variação de tempo.',
          },
        ],
        validation: { type: 'formulaMatch', correctAnswer: 'a' },
        explanation:
          'A derivada nasce de uma pergunta prática: qual é a taxa de mudança agora, e não apenas ao longo de um intervalo?',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'A velocidade instantânea pode ser construída observando velocidades médias em intervalos cada vez menores.',
      keyTakeaway:
        'A derivada mede uma taxa de mudança local: o que está acontecendo exatamente aqui?',
    },
  },

  {
    id: 'secant-to-tangent',
    unit: 'Unidade 2 — Derivadas',
    title: 'Da secante à tangente',
    description:
      'Veja a linha de velocidade média se transformar na velocidade instantânea.',
    estimatedTime: '10 min',
    scenario:
      'Você está investigando o movimento de um carro cuja distância segue uma curva. Uma linha entre dois pontos mostra a velocidade média. Para descobrir a velocidade exatamente no instante t = 2, você fará o segundo ponto se aproximar do primeiro.',
    objectives: [
      'Interpretar a reta secante.',
      'Observar a secante se aproximar da tangente.',
      'Conectar a visualização à definição da derivada.',
    ],
    steps: [
      {
        title: 'Dois pontos, uma média',
        instruction:
          'Mova o ponto B para perto do ponto A. A reta que liga os dois pontos é a secante.',
        widget: 'tangentLineExplorer',
        validation: { type: 'range', targetParam: 'h', targetRange: [0.6, 1.4] },
        explanation:
          'A inclinação da secante representa a taxa média de mudança entre dois instantes.',
      },
      {
        title: 'Faça h diminuir',
        instruction:
          'Continue aproximando B de A até que h fique pequeno. Observe a inclinação da reta.',
        widget: 'tangentLineExplorer',
        validation: {
          type: 'range',
          targetParam: 'h',
          targetRange: [0.03, 0.25],
        },
        explanation:
          'Quando h se aproxima de zero, a secante se aproxima da tangente. A inclinação da tangente é a derivada naquele ponto.',
      },
      {
        title: 'Nomeie o que você viu',
        instruction:
          'Escolha a fórmula que descreve exatamente esse processo.',
        widget: 'formulaMatch',
        options: [
          {
            id: 'a',
            latex: String.raw`f'(a)=\lim_{h\to 0}\frac{f(a+h)-f(a)}{h}`,
            feedback:
              'Exatamente. A derivada é a inclinação limite das retas secantes.',
          },
          {
            id: 'b',
            latex: String.raw`f'(a)=f(a)\cdot h`,
            feedback:
              'O processo observado usa uma razão entre variações, não uma multiplicação.',
          },
        ],
        validation: { type: 'formulaMatch', correctAnswer: 'a' },
        explanation:
          'A fórmula da derivada não é uma regra arbitrária: ela registra simbolicamente a transformação visual da secante em tangente.',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'A derivada pode ser entendida como a taxa média de mudança quando o intervalo entre os pontos tende a zero.',
      keyTakeaway:
        'As regras de derivação são atalhos para calcular esse mesmo processo em famílias inteiras de funções.',
    },
  },

  {
    id: 'derivative-as-function',
    unit: 'Unidade 2 — Derivadas',
    title: 'A derivada como função',
    description:
      'Mapeie a velocidade do carro em todos os pontos da viagem.',
    estimatedTime: '9 min',
    scenario:
      'Em vez de perguntar apenas a velocidade do carro em t = 2, você quer construir um painel que informe a velocidade instantânea ao longo de toda a viagem. Isso significa transformar uma única inclinação em uma nova função.',
    objectives: [
      'Distinguir função original e função derivada.',
      'Relacionar crescimento à derivada positiva.',
      'Visualizar duas funções simultaneamente.',
    ],
    steps: [
      {
        title: 'Observe distância e velocidade',
        instruction:
          'Compare o gráfico da distância s(t) com o gráfico da velocidade v(t). Arraste o instante da viagem.',
        widget: 'derivativeFunctionExplorer',
        validation: { type: 'range', targetParam: 'x', targetRange: [1.5, 2.5] },
        explanation:
          'A derivada associa a cada instante uma inclinação. Por isso ela própria forma uma nova função.',
      },
      {
        title: 'Onde o carro acelera?',
        instruction:
          'Mova o ponto para uma região em que a velocidade instantânea seja positiva e observe a inclinação da curva original.',
        widget: 'derivativeFunctionExplorer',
        validation: { type: 'positiveDerivative' },
        explanation:
          'Quando a derivada é positiva, a função original está crescendo naquele ponto. Quando é negativa, a função está diminuindo.',
      },
      {
        title: 'Generalize',
        instruction:
          'Selecione a frase que melhor explica a derivada como função.',
        widget: 'formulaMatch',
        options: [
          {
            id: 'a',
            latex: String.raw`f':x\mapsto\text{inclinação de }f\text{ em }x`,
            feedback:
              'Correto. A derivada transforma cada ponto da função original em uma taxa de mudança.',
          },
          {
            id: 'b',
            latex: String.raw`f'(x)=f(x)\text{ para toda função}`,
            feedback:
              'Isso só ocorre em casos específicos, não para toda função.',
          },
        ],
        validation: { type: 'formulaMatch', correctAnswer: 'a' },
        explanation:
          'A derivada é uma função que responde, ponto a ponto, como a função original está mudando.',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'A derivada não é apenas um número. Ela é uma nova função que descreve a taxa de mudança da função original em cada ponto.',
      keyTakeaway:
        'Função original: posição. Derivada: velocidade. A mesma estrutura aparece em muitos contextos.',
    },
  },

  {
    id: 'derivative-rules',
    unit: 'Unidade 2 — Derivadas',
    title: 'Power rule, product rule e chain rule',
    description:
      'Descubra por que diferentes situações de mudança exigem diferentes formas de acompanhar as variáveis.',
    estimatedTime: '12 min',
    scenario:
      'Uma empresa acompanha sua receita como preço vezes quantidade. Os dois valores mudam ao longo do tempo. Em outro problema, o volume de um balão depende do raio, e o raio depende do tempo. Como calcular a mudança final sem perder o caminho entre as variáveis?',
    objectives: [
      'Reconhecer quando uma função é uma potência simples.',
      'Entender duas quantidades variando em um produto.',
      'Acompanhar mudanças encadeadas.',
    ],
    steps: [
      {
        title: 'Uma variável elevada a uma potência',
        instruction:
          'Ajuste o expoente e observe como a inclinação da função muda. Este é o cenário mais simples.',
        widget: 'rulePlayground',
        validation: { type: 'ruleSelection', target: 'power' },
        explanation:
          'Para uma potência, a regra do produto entre o expoente e a potência reduzida organiza o limite em uma forma rápida.',
      },
      {
        title: 'Receita: preço vezes quantidade',
        instruction:
          'Selecione produto. Observe que tanto o preço quanto a quantidade podem contribuir para a mudança total da receita.',
        widget: 'rulePlayground',
        validation: { type: 'ruleSelection', target: 'product' },
        explanation: String.raw`Se R(t) = p(t)q(t), a taxa de mudança da receita depende da mudança do preço e da mudança da quantidade: $$R'(t)=p'(t)q(t)+p(t)q'(t)$$.`,
      },
      {
        title: 'Raio, volume e tempo',
        instruction:
          'Selecione cadeia. O raio muda com o tempo, e o volume muda com o raio. A taxa final precisa atravessar essas duas relações.',
        widget: 'rulePlayground',
        validation: { type: 'ruleSelection', target: 'chain' },
        explanation: String.raw`A regra da cadeia acompanha uma mudança que acontece através de outra variável: $$\frac{dV}{dt}=\frac{dV}{dr}\cdot\frac{dr}{dt}$$.`,
      },
      {
        title: 'As regras são atalhos',
        instruction: 'Escolha a ideia comum às três regras.',
        widget: 'formulaMatch',
        options: [
          {
            id: 'a',
            latex: String.raw`\text{Cada regra é uma forma organizada de calcular uma taxa de mudança}`,
            feedback:
              'Correto. As regras não substituem a ideia de derivada; elas tornam o cálculo mais eficiente.',
          },
          {
            id: 'b',
            latex: String.raw`\text{Cada regra é uma fórmula sem relação com limites}`,
            feedback:
              'As regras são consequências da definição da derivada e das propriedades dos limites.',
          },
        ],
        validation: { type: 'formulaMatch', correctAnswer: 'a' },
        explanation:
          'A fórmula geral continua sendo a base. Power rule, product rule e chain rule são atalhos derivados dessa mesma ideia.',
      },
    ],
    summary: {
      title: 'O que você aprendeu',
      content:
        'As regras de derivação refletem diferentes estruturas de problemas: uma potência, um produto de quantidades ou uma cadeia de dependências.',
      keyTakeaway:
        'Antes de escolher uma regra, identifique como as variáveis estão relacionadas no problema.',
    },
  },
];
