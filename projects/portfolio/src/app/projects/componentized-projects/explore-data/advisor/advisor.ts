import type { AnalysisSuggestion, Field, FieldType } from '../models/types';

/**
 * The "tutor" rules engine.
 *
 * Deliberately pure and framework-free: no Angular DI, no signals, no chart
 * library imports. It only reasons about field *types* and returns suggestion
 * metadata (with teaching explanations). The viz layer turns a suggestion's
 * `kind` into an actual chart option, so this engine stays unit-testable and
 * reusable even if the chart library changes later.
 */

const SUGGESTIONS: readonly AnalysisSuggestion[] = [
  {
    id: 'histogram',
    kind: 'histogram',
    label: 'Histograma',
    applicableFieldTypes: [['numerical']],
    explanation:
      'Mostra a distribuição de uma variável numérica: em quais faixas de valor os dados se concentram e se há assimetria ou caudas. É o primeiro passo para entender a forma dos dados.',
  },
  {
    id: 'box-plot',
    kind: 'box-plot',
    label: 'Box Plot',
    applicableFieldTypes: [['numerical']],
    explanation:
      'Resume a distribuição com quartis: mediana, intervalo entre quartis e outliers. Mostra de relance onde está o centro e o quanto os valores se espalham.',
  },
  {
    id: 'bar-chart',
    kind: 'bar-chart',
    label: 'Gráfico de Barras',
    applicableFieldTypes: [['categorical']],
    explanation:
      'Conta quantas vezes cada categoria aparece. Ideal para comparar frequências entre grupos.',
  },
  {
    id: 'pie-chart',
    kind: 'pie-chart',
    label: 'Gráfico de Pizza',
    applicableFieldTypes: [['categorical']],
    explanation:
      'Mostra a proporção de cada categoria em relação ao todo. Use apenas quando há poucas categorias (até ~5); muitas fatias ficam difíceis de ler.',
  },
  {
    id: 'scatter-plot',
    kind: 'scatter-plot',
    label: 'Gráfico de Dispersão',
    applicableFieldTypes: [['numerical', 'numerical']],
    explanation:
      'Revela a relação entre duas variáveis numéricas ponto a ponto: tendências, aglomerados e outliers que um único número pode esconder.',
  },
  {
    id: 'correlation-coefficient',
    kind: 'correlation-coefficient',
    label: 'Coeficiente de Correlação',
    applicableFieldTypes: [['numerical', 'numerical']],
    explanation:
      'Resume em um único valor (de -1 a 1) a força e a direção da relação linear entre duas variáveis numéricas. Diferente do gráfico de dispersão — que mostra a forma da relação —, o coeficiente a condensa em um número.',
  },
  {
    id: 'grouped-box-plot',
    kind: 'grouped-box-plot',
    label: 'Box Plot Agrupado',
    applicableFieldTypes: [['categorical', 'numerical']],
    explanation:
      'Compara a distribuição de uma variável numérica entre diferentes categorias, lado a lado. Bom para ver se os grupos se comportam de forma parecida ou diferente.',
  },
  {
    id: 'aggregate-bar-chart',
    kind: 'aggregate-bar-chart',
    label: 'Barras de Agregado',
    applicableFieldTypes: [['categorical', 'numerical']],
    explanation:
      'Agrega uma variável numérica (média) por categoria. Bom para responder "qual categoria tem o maior valor médio?".',
  },
  {
    id: 'line-chart',
    kind: 'line-chart',
    label: 'Gráfico de Linha',
    applicableFieldTypes: [['datetime', 'numerical']],
    explanation:
      'Mostra a evolução de uma variável numérica ao longo do tempo, revelando tendências e sazonalidade.',
  },
  {
    id: 'stacked-bar-chart',
    kind: 'stacked-bar-chart',
    label: 'Barras Empilhadas',
    applicableFieldTypes: [['categorical', 'categorical']],
    explanation:
      'Cruza duas variáveis categóricas mostrando a composição de uma dentro da outra. Útil para comparar proporções entre grupos.',
  },
  {
    id: 'heatmap',
    kind: 'heatmap',
    label: 'Mapa de Calor',
    applicableFieldTypes: [['categorical', 'categorical']],
    explanation:
      'Visualiza a frequência das combinações entre duas variáveis categóricas pela intensidade de cor. Quanto mais forte a cor, mais frequente a combinação.',
  },
  {
    id: 'correlation-heatmap',
    kind: 'correlation-heatmap',
    label: 'Matriz de Correlação',
    applicableFieldTypes: [],
    explanation:
      'Mostra a correlação entre todas as variáveis numéricas selecionadas em uma matriz colorida. Útil para encontrar rapidamente pares fortemente relacionados.',
  },
];

function normalizeCombo(types: FieldType[]): string {
  return [...types].sort().join('|');
}

function signatureOf(fields: Field[]): string {
  return normalizeCombo(fields.map((f) => f.type));
}

/**
 * Given the selected fields, return the suggestions whose type combinations
 * match. The result follows the registry order for a deterministic UI.
 */
export function suggestAnalyses(selected: Field[]): AnalysisSuggestion[] {
  if (selected.length === 0) {
    return [];
  }

  const signature = signatureOf(selected);
  const matches = SUGGESTIONS.filter((s) =>
    s.applicableFieldTypes.some((combo) => normalizeCombo(combo) === signature)
  );

  // Special case: N numerical fields (N > 2) -> correlation heatmap matrix.
  if (selected.length > 2 && selected.every((f) => f.type === 'numerical')) {
    const heatmap = SUGGESTIONS.find((s) => s.kind === 'correlation-heatmap');
    if (heatmap) {
      matches.push(heatmap);
    }
  }

  return matches;
}

export function getSuggestionById(id: string): AnalysisSuggestion | undefined {
  return SUGGESTIONS.find((s) => s.id === id);
}
