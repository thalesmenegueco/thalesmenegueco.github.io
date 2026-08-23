# Expansion: Tutorial System & Insights Engine
## For Angular EDA App — DeepSeek Build Spec

---

## Part 1: Tutorial Progressivo / Mini-courses

### Problem to solve
Users need **guided, hands-on learning paths**, not just a toolkit. Each tutorial should:
- Teach a concept (e.g., "What is Correlation?")
- Provide a working example dataset pre-loaded
- Walk through steps where the user *does* the analysis, not watches
- Validate each step (did you pick the right chart? did you interpret correctly?)
- Explain why that step matters

### Architecture

#### 1.1 Lesson Definition Schema
Store lessons as JSON (easy to edit, version-control, and extend). Example:

```json
{
  "id": "correlation-basics",
  "title": "Entendendo Correlação",
  "description": "Aprenda quando e como usar scatter plots para encontrar relações entre variáveis.",
  "difficulty": "beginner",
  "estimatedTime": "5 min",
  "objectives": [
    "Entender o que correlação mede",
    "Interpretar um scatter plot",
    "Conhecer a diferença entre correlação e causação"
  ],
  "exampleDatasetUrl": "/assets/lessons/correlation-basics/height-weight.csv",
  "exampleFieldDescriptions": [
    { "name": "height", "type": "numerical", "description": "Altura em cm" },
    { "name": "weight", "type": "numerical", "description": "Peso em kg" }
  ],
  "steps": [
    {
      "id": "step-1",
      "title": "Visualizar os dados",
      "instruction": "Faça upload do dataset de exemplo (já fornecido) e confirme os tipos de coluna.",
      "action": "upload",
      "validation": {
        "type": "fieldTypes",
        "expectedFields": [
          { "name": "height", "type": "numerical" },
          { "name": "weight", "type": "numerical" }
        ],
        "errorMessage": "Certifique-se de que ambas as colunas são numéricas."
      },
      "hint": "Você pode carregar o arquivo ou usar o botão 'Usar Exemplo' acima.",
      "explanation": "Antes de fazer análise, você precisa conhecer seus dados e confirmar os tipos."
    },
    {
      "id": "step-2",
      "title": "Escolha um scatter plot",
      "instruction": "Selecione height e weight e escolha 'Scatter Plot' da lista de sugestões.",
      "action": "chartSelection",
      "validation": {
        "type": "chartType",
        "expectedChartType": "scatter",
        "expectedFields": ["height", "weight"],
        "errorMessage": "Tente novamente — você precisa de um scatter plot para ver a relação entre duas variáveis numéricas."
      },
      "hint": "O tutor deve sugerir scatter plot automaticamente. Se não vir, clique em 'height' e 'weight'.",
      "explanation": "Scatter plots mostram cada ponto como uma coordenada (x, y). Padrões visuais revelam relações."
    },
    {
      "id": "step-3",
      "title": "Interprete o padrão",
      "instruction": "Vendo o gráfico, o que você observa? Escolha uma resposta:",
      "action": "multipleChoice",
      "validation": {
        "type": "interpretation",
        "correctAnswer": "a",
        "options": [
          {
            "id": "a",
            "text": "Correlação positiva forte: quanto mais alta a pessoa, mais pesada.",
            "feedback": "Correto! Pontos formam uma linha ascendente — isso é correlação positiva."
          },
          {
            "id": "b",
            "text": "Não há relação entre height e weight.",
            "feedback": "Hmm, olhe novamente. Os pontos formam um padrão?"
          },
          {
            "id": "c",
            "text": "A altura causa o peso.",
            "feedback": "Cuidado! Correlação não implica causação. Há outras variáveis (idade, genética, etc)."
          }
        ]
      },
      "explanation": "Correlação descreve uma relação, não causa. Existem muitas razões pelas quais altura e peso variam juntos."
    },
    {
      "id": "step-4",
      "title": "Veja o coeficiente",
      "instruction": "O tutor mostrou um valor 'r = 0.85'. Isto significa o quê?",
      "action": "textAnswer",
      "validation": {
        "type": "textMatch",
        "keywords": ["0.85", "forte", "positiva", "85%"],
        "partialCredit": true,
        "feedback": "A correlação de Pearson (r) varia de -1 a 1. 0.85 é uma correlação positiva *forte*, significando que as variáveis se movem juntas de forma previsível."
      },
      "hint": "r = 0.85 está perto de 1. Valores perto de 1 ou -1 indicam correlações fortes."
    }
  ],
  "summary": {
    "title": "O que você aprendeu",
    "content": "Correlação mede quanto duas variáveis se movem juntas. Scatter plots mostram visualmente, e o coeficiente r quantifica. Use r entre -1 (negativa forte) e 1 (positiva forte). Mas sempre lembre: correlação ≠ causação.",
    "keyTakeaway": "Scatter plots + correlação coeficiente = ferramenta poderosa para explorar relações."
  }
}
```

#### 1.2 Lesson Engine (Service)
```ts
// core/lessons/lesson.types.ts
export interface Lesson { /* as above */ }

export interface LessonStep {
  id: string;
  title: string;
  instruction: string;
  action: 'upload' | 'chartSelection' | 'multipleChoice' | 'textAnswer' | 'freeform';
  validation: ValidationRule;
  hint?: string;
  explanation: string;
}

export interface ValidationRule {
  type: string; // 'fieldTypes' | 'chartType' | 'interpretation' | 'textMatch'
  // ... validation-specific fields
}

export interface LessonProgress {
  lessonId: string;
  completedSteps: string[]; // step IDs
  currentStep: string;
  isComplete: boolean;
}
```

#### 1.3 LessonService
```ts
// core/lessons/lesson.service.ts
export class LessonService {
  // Load lesson definitions from JSON
  loadLesson(lessonId: string): Observable<Lesson> { /* ... */ }

  // Validate a step based on current app state (dataset, selected chart, etc)
  validateStep(lesson: Lesson, stepId: string, appState: AppState): ValidationResult {
    const step = lesson.steps.find(s => s.id === stepId);
    return this.runValidation(step.validation, appState);
  }

  // Track progress
  private progressSignal = signal<LessonProgress | null>(null);
  getProgress() { return this.progressSignal.asReadonly(); }
  markStepComplete(stepId: string) { /* ... */ }

  // Render explanation after user completes step
  getExplanation(step: LessonStep): string { /* ... */ }
}
```

#### 1.4 Lesson UI Components (Standalone)
```
src/app/lessons/
  lesson-list/           # Browse available lessons by difficulty/topic
  lesson-player/         # Main UI for a lesson in progress
    lesson-instruction/  # Renders current step instruction + hint
    lesson-validation/   # Shows validation feedback
    lesson-sidebar/      # Progress bar, objectives, summary
  lessons.service.ts
  lesson.types.ts
  lesson-data/           # JSON definitions (or load from API later)
```

#### 1.5 Integration with Main App
- When user starts a lesson, the app loads the example dataset automatically
- Lesson service subscribes to app state (current chart, selected fields) to validate
- When step is valid, user clicks "Next", service records progress
- After all steps → summary screen with key takeaway + "Try it yourself" button (loads empty workspace)

---

## Part 2: "Dica do Dia" / Insights Automáticos

### Problem to solve
After a user generates a chart, the app should **automatically detect interesting patterns** in the data and explain them in plain language. This:
- Teaches pattern recognition ("That spike is an outlier — here's why it matters")
- Builds intuition ("See how skewed this is? That's what log transformation helps with")
- Provides "aha moments" without extra clicks

### Architecture

#### 2.1 Insight Type System
```ts
// core/insights/insight.types.ts

export type InsightType = 
  | 'outlier'
  | 'correlation'
  | 'skewness'
  | 'multimodal'
  | 'trend'
  | 'seasonality'
  | 'imbalance';

export interface Insight {
  type: InsightType;
  severity: 'info' | 'warning' | 'critical'; // e.g., extreme outliers = critical
  fields: string[]; // which fields this insight applies to
  value?: number; // e.g., correlation coefficient, outlier count
  title: string; // "Outliers Detected"
  description: string; // Plain language explanation
  recommendation?: string; // What to do about it
  icon: string; // visual hint (🔴 for critical, ℹ️ for info)
}

export interface InsightDetectionResult {
  insights: Insight[];
  timestamp: Date;
}
```

#### 2.2 Insight Engine (Pure Functions)
Each detection is a **pure function** — given data + fields, return insights. No side effects.

```ts
// core/insights/detectors/outlier.detector.ts
export function detectOutliers(
  data: ColumnTable,
  field: string,
  method: 'iqr' | 'zscore' = 'iqr'
): Insight[] {
  const values = data.objects().map(r => r[field]).filter(v => v != null);
  
  if (method === 'iqr') {
    const q1 = percentile(values, 0.25);
    const q3 = percentile(values, 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    
    const outliers = values.filter(v => v < lowerBound || v > upperBound);
    if (outliers.length > 0) {
      const pct = ((outliers.length / values.length) * 100).toFixed(1);
      return [{
        type: 'outlier',
        severity: outliers.length > values.length * 0.05 ? 'warning' : 'info',
        fields: [field],
        value: outliers.length,
        title: 'Outliers Detectados',
        description: `${outliers.length} valores (${pct}%) estão fora da faixa esperada de ${lowerBound.toFixed(2)} a ${upperBound.toFixed(2)}.`,
        recommendation: 'Considere investigar ou remover outliers se forem erros de entrada. Se forem reais, eles podem ser muito informativos!',
        icon: '🔴'
      }];
    }
  }
  return [];
}

// core/insights/detectors/correlation.detector.ts
export function detectStrongCorrelations(
  data: ColumnTable,
  fields: string[],
  threshold: number = 0.7
): Insight[] {
  const insights: Insight[] = [];
  
  // Pairwise correlations
  for (let i = 0; i < fields.length; i++) {
    for (let j = i + 1; j < fields.length; j++) {
      const f1 = fields[i], f2 = fields[j];
      const corr = correlation(
        data.objects().map(r => r[f1]).filter(v => v != null),
        data.objects().map(r => r[f2]).filter(v => v != null)
      );
      
      if (Math.abs(corr) > threshold) {
        const direction = corr > 0 ? 'positiva' : 'negativa';
        insights.push({
          type: 'correlation',
          severity: Math.abs(corr) > 0.85 ? 'critical' : 'warning',
          fields: [f1, f2],
          value: corr,
          title: `Correlação ${direction} forte detectada`,
          description: `${f1} e ${f2} têm uma correlação de ${corr.toFixed(2)}. Isso significa que tendem a variar juntas.`,
          recommendation: 'Explore com um scatter plot. Mas cuidado: correlação ≠ causação!',
          icon: '🔗'
        });
      }
    }
  }
  return insights;
}

// core/insights/detectors/distribution.detector.ts
export function detectDistributionShape(
  data: ColumnTable,
  field: string
): Insight[] {
  const values = data.objects().map(r => r[field]).filter(v => v != null);
  const skewness = computeSkewness(values);
  const kurtosis = computeKurtosis(values);
  
  const insights: Insight[] = [];
  
  if (Math.abs(skewness) > 1) {
    const direction = skewness > 0 ? 'direita (cauda longa)' : 'esquerda (cauda longa)';
    insights.push({
      type: 'skewness',
      severity: Math.abs(skewness) > 2 ? 'warning' : 'info',
      fields: [field],
      value: skewness,
      title: 'Distribuição Assimétrica',
      description: `${field} é assimétrica para a ${direction}. Skewness = ${skewness.toFixed(2)}. A maioria dos valores está de um lado.`,
      recommendation: 'Considere uma transformação logarítmica ou raiz quadrada para normalizar a distribuição.',
      icon: '↗️'
    });
  }
  
  return insights;
}

// core/insights/detectors/pattern.detector.ts
export function detectMultimodality(
  data: ColumnTable,
  field: string
): Insight[] {
  // Simple: if histogram has distinct peaks, signal bimodal/multimodal
  // Can use simple-statistics if it has this, or implement kernel density estimation
  // For now, a simpler heuristic: if std dev is high relative to mean, and distinct clusters
  const values = data.objects().map(r => r[field]).filter(v => v != null);
  const mean = statistics.mean(values);
  const std = statistics.standardDeviation(values);
  const cv = std / Math.abs(mean); // coefficient of variation
  
  if (cv > 0.5) {
    // Could be multimodal
    return [{
      type: 'multimodal',
      severity: 'info',
      fields: [field],
      title: 'Múltiplos Grupos?',
      description: `${field} pode conter múltiplos grupos ou populações. Variação alta sugere dados heterogêneos.`,
      recommendation: 'Tente colorir o scatter plot por uma variável categórica, ou segmentar por grupos.',
      icon: '👥'
    }];
  }
  return [];
}
```

#### 2.3 Insight Generator Orchestrator
```ts
// core/insights/insight-generator.service.ts
export class InsightGeneratorService {
  constructor(private datasetService: DatasetService) {}

  generateInsights(dataset: Dataset): InsightDetectionResult {
    const allInsights: Insight[] = [];
    
    // Detect outliers per numerical field
    dataset.fields
      .filter(f => f.type === 'numerical')
      .forEach(f => {
        allInsights.push(...detectOutliers(dataset.table, f.name));
      });
    
    // Detect strong correlations
    const numericalFields = dataset.fields
      .filter(f => f.type === 'numerical')
      .map(f => f.name);
    if (numericalFields.length >= 2) {
      allInsights.push(...detectStrongCorrelations(dataset.table, numericalFields));
    }
    
    // Detect distribution shapes
    numericalFields.forEach(f => {
      allInsights.push(...detectDistributionShape(dataset.table, f));
      allInsights.push(...detectMultimodality(dataset.table, f));
    });
    
    // Sort by severity (critical first, then warning, then info)
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    allInsights.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
    
    return {
      insights: allInsights.slice(0, 5), // Top 5 to avoid overwhelming
      timestamp: new Date()
    };
  }
}
```

#### 2.4 Helper Functions (simple-statistics + Arquero)
```ts
// core/insights/stats-helpers.ts
import * as stats from 'simple-statistics';

export function computeSkewness(values: number[]): number {
  // simple-statistics doesn't have skewness, so implement or use jStat
  // For now: a basic formula or use jStat
  return stats.sampleSkewness ? stats.sampleSkewness(values) : 0;
}

export function computeKurtosis(values: number[]): number {
  // Similar — implement or import from jStat
  return 0;
}

export function percentile(values: number[], p: number): number {
  const sorted = values.sort((a, b) => a - b);
  const index = p * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

export function correlation(x: number[], y: number[]): number {
  return stats.pearsonCorrelationCoefficient(x, y);
}
```

#### 2.5 Insights UI Panel
```
src/app/insights/
  insights-panel/        # Display list of generated insights
    insight-card/        # Individual insight card (severity color, icon, text, recommendation)
  insight-generator.service.ts
  insight.types.ts
  stats-helpers.ts
  detectors/
    outlier.detector.ts
    correlation.detector.ts
    distribution.detector.ts
    pattern.detector.ts
```

UI component (standalone):
```ts
@Component({
  selector: 'app-insights-panel',
  template: `
    <div class="insights-panel">
      <h3>💡 Dicas do seu dataset</h3>
      @if (insights().length === 0) {
        <p class="empty">Nenhuma dica relevante por enquanto. Continue explorando!</p>
      } @else {
        <div class="insights-list">
          @for (insight of insights(); track insight.type) {
            <app-insight-card [insight]="insight"></app-insight-card>
          }
        </div>
      }
    </div>
  `,
  standalone: true,
  imports: [CommonModule, InsightCardComponent]
})
export class InsightsPanelComponent {
  insightGenerator = inject(InsightGeneratorService);
  datasetService = inject(DatasetService);
  
  insights = computed(() => {
    const dataset = this.datasetService.dataset();
    if (!dataset) return [];
    return this.insightGenerator.generateInsights(dataset).insights;
  });
}
```

#### 2.6 Integration in Main App
- After user generates a chart, insights re-compute automatically (via `computed()`)
- Insights panel displays in a sidebar or bottom panel
- Each insight is educational, not prescriptive ("Here's what this means" vs "You should do X")
- Can optionally add an "Insights" tab in the UI

---

## Libraries Summary

| Library | Purpose | Size | Notes |
|---------|---------|------|-------|
| `simple-statistics` | Correlation, percentiles, mean, std dev | ~15kb | Already in your stack |
| `jStat` | Skewness, kurtosis, more distributions | ~50kb | Lightweight stats lib, alternative to Numjs |
| `Arquero` | Tabular data ops (group, derive, filter) | ~200kb | Already in your stack |
| `PapaParse` | CSV parsing | ~30kb | Already in your stack |
| `SheetJS (xlsx)` | Excel parsing | ~250kb | Already in your stack |

**For outlier/distribution detection:** Stick to pure JS + Arquero + simple-statistics + jStat. No need for scipy/numpy equivalents in browser.

---

## Deliverable Order

**Phase 1: Lessons Infrastructure**
1. Define lesson schema (JSON format)
2. LessonService + LessonEngine
3. Lesson list UI (browse lessons by difficulty)
4. Lesson player UI (step-by-step guide)
5. Validation logic for each step type
6. Load 1-2 example lessons (e.g., "Correlation Basics", "Outliers")

**Phase 2: Insights Engine**
1. Insight type system + data models
2. Pure detector functions (outliers, correlations, skewness)
3. InsightGeneratorService orchestrator
4. InsightsPanelComponent UI
5. Auto-trigger insights after chart generation (via `computed()`)

**Phase 3: Polish**
1. i18n for lesson + insight text (Portuguese/English)
2. Lesson progress persistence (localStorage)
3. Analytics (which lessons are popular? which insights help users learn?)

---

## i18n Consideration
Since you're building for Brazilian Portuguese + international audience:
- Store lesson text in JSON with `i18n` keys
- Use Angular's `@angular/localize` or a simpler library (ngx-translate)
- Insights explanations should be templated and translated

Example:
```json
{
  "insights": {
    "outlier.title": "Outliers Detectados",
    "outlier.description": "{count} valores ({pct}%) estão fora da faixa esperada.",
    "correlation.title": "Correlação {direction} forte",
    ...
  }
}
```

---

## Checklist for DeepSeek

When you prompt DeepSeek, cover:
1. **Lesson schema & JSON format** — ask it to create loader + parser
2. **Step validation logic** — each step type (upload, chart selection, multiple choice, text answer) needs its own validator
3. **Detector functions** — ask for pure functions, testable independently
4. **Service layer** — LessonService + InsightGeneratorService
5. **UI components** — lesson-player, insight-card, insights-panel
6. **State management** — use Angular signals (computed + effect) to wire everything
7. **Integration points** — where lessons load example data, where insights auto-trigger after chart render
8. **i18n structure** — even if you start English-only, design the structure for Portuguese translation later

Good luck! 🎓📊