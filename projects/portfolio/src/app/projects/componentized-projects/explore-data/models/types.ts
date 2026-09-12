import type { ColumnTable } from 'arquero';

/**
 * Framework-free domain types shared by the ingestion, advisor, and viz layers.
 * Nothing in this file imports Angular — it can be reused and unit-tested in
 * isolation, and swapping the chart library later does not touch these types.
 */

export type FieldType = 'categorical' | 'numerical' | 'datetime' | 'boolean';

export interface Field {
  name: string;
  type: FieldType;
}

/**
 * The logical chart "kinds" the advisor can recommend. The advisor only reasons
 * about these kinds (plus field types); the viz layer maps a kind to a concrete
 * ECharts option, so the chart library can be swapped without touching the
 * advisor.
 */
export type ChartKind =
  | 'histogram'
  | 'box-plot'
  | 'bar-chart'
  | 'pie-chart'
  | 'scatter-plot'
  | 'correlation-coefficient'
  | 'grouped-box-plot'
  | 'aggregate-bar-chart'
  | 'line-chart'
  | 'stacked-bar-chart'
  | 'heatmap'
  | 'correlation-heatmap';

export interface AnalysisSuggestion {
  id: string;
  kind: ChartKind;
  label: string;
  /** Tutor-style text: what the chart shows and when to use it. */
  explanation: string;
  /**
   * Valid type combinations. Each inner array is an unordered multiset of
   * FieldType; the advisor normalizes (sorts) both sides before matching, so
   * the order in which fields are selected does not matter.
   */
  applicableFieldTypes: FieldType[][];
}

/** A parsed dataset: user-confirmed fields plus the in-memory Arquero table. */
export interface Dataset {
  fields: Field[];
  table: ColumnTable;
}

/** Per-column profile computed during ingestion and shown in the confirm UI. */
export interface ColumnProfile {
  name: string;
  suggestedType: FieldType;
  distinctCount: number;
  totalCount: number;
  nonNullCount: number;
  numericRate: number;
  dateRate: number;
  booleanRate: number;
  sampleValues: string[];
}

/** User-editable chart chrome (title + axis labels). */
export interface ChartCustomization {
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
}
