# Build Spec: Angular Exploratory Data Analysis App

## Goal
An Angular app that lets a user upload tabular data, describe each column's
data type, get tutored on which comparisons/charts are valid for the fields
they pick, and generate a customizable chart from the result.

## Stack
- Angular 18+, standalone components (no NgModules), Angular signals for state
  (no NgRx — this app's state graph is small enough that signals + computed()
  are sufficient).
- **Arquero** for in-memory dataframe operations (groupby, derive, rollup,
  filter) — think of it as the TS analogue to Pandas verbs.
- **simple-statistics** for correlation, std dev, quantiles not covered by
  Arquero's aggregations.
- **PapaParse** for CSV parsing, **SheetJS (xlsx)** for Excel parsing.
- **ECharts** via `ngx-echarts` for all charting — chosen over Plotly.js/
  ngx-charts for its broad built-in chart-type coverage (box plot, heatmap,
  scatter, histogram-via-binning) and because its option-object API is easy
  to generate programmatically from a rules engine.
- Angular Material or Tailwind for UI chrome (either is fine — pick based on
  how much custom styling vs. speed you want).

## Feature modules (folder structure)
```
src/app/
  core/
    models/          # Dataset, Field, FieldType, AnalysisSuggestion types
  ingestion/          # file upload, parsing, column-type description UI
  advisor/            # the "tutor" rules engine — pure functions
  viz/                 # ECharts wrapper service + chart customization panel
  shared/
```

## Data model (core/models)
```ts
type FieldType = 'categorical' | 'numerical' | 'datetime' | 'boolean';

interface Field {
  name: string;
  type: FieldType;      // user-declared, not auto-sniffed — sniffing can be
                         // offered as a suggested default, but the user's
                         // declared type is what the app trusts
}

interface Dataset {
  fields: Field[];
  table: ColumnTable;   // Arquero ColumnTable
}

interface AnalysisSuggestion {
  id: string;
  label: string;                  // e.g. "Scatter plot"
  explanation: string;            // tutor text: what it shows, when to use it
  applicableFieldTypes: FieldType[][]; // valid type combinations
  buildChartOption: (dataset: Dataset, fields: Field[]) => EChartsOption;
}
```

## Ingestion flow
1. User uploads file(s) → parse with PapaParse (csv) or SheetJS (xlsx) into
   raw rows.
2. Auto-detect a *suggested* type per column (numeric parse rate, date parse
   rate, distinct-value ratio for categorical vs boolean) but always let the
   user confirm/override each column's type before proceeding — this
   confirmed set of `Field`s is the source of truth for the advisor.
3. Wrap the parsed rows into an Arquero `ColumnTable`.

## Advisor ("tutor") rules engine
Pure, testable functions with no framework dependency:
- Given N selected fields and their types, return a filtered list of
  `AnalysisSuggestion`s whose `applicableFieldTypes` matches.
- Each suggestion's `explanation` should teach, not just label — e.g. for a
  numerical-vs-numerical pair suggest scatter plot AND correlation, with a
  sentence on what a scatter reveals vs. what a correlation coefficient
  summarizes.
- Suggested baseline rule table:
  - 1 numerical → histogram, box plot (distribution)
  - 1 categorical → bar chart (counts), pie chart (proportions, only if few categories)
  - 2 numerical → scatter plot, correlation coefficient
  - 1 categorical + 1 numerical → grouped box plot, bar chart of aggregates (mean/sum per category)
  - 1 datetime + 1 numerical → line chart (time series)
  - 2 categorical → stacked bar chart, heatmap of counts
  - N numerical (N>2) → correlation heatmap matrix

## Visualization layer
- A `ChartService` that takes an `AnalysisSuggestion` + `Dataset` + selected
  `Field[]` and returns an ECharts `EChartsOption` object via
  `suggestion.buildChartOption(...)`.
- A small customization panel bound to signals: chart title, x-axis label,
  y-axis label — edits mutate the option object reactively (use `computed()`
  or manual `option.set()` updates on the `ngx-echarts` instance) so the
  chart re-renders live without a full rebuild.

## Non-goals / keep it simple for v1
- No server backend needed — everything (parsing, stats, charting) runs
  client-side in the browser.
- No auto ML / auto-insights generation — the tutor explains analysis types,
  it doesn't auto-pick "the best" chart for you.
- No persistence layer required for v1 — dataset lives in memory for the
  session (can add IndexedDB later if needed).

## Deliverable order (build incrementally, in this sequence)
1. Data models + ingestion (upload, parse, column-type confirmation UI).
2. Advisor rules engine as pure functions, unit-testable independent of UI.
3. Field-selection UI that calls the advisor and lists suggestions with
   explanations.
4. ChartService + ECharts rendering for one suggestion type end-to-end
   (e.g. scatter plot) to prove the pipeline.
5. Extend buildChartOption implementations to cover the rest of the rule
   table.
6. Chart customization panel (title/axis editing).