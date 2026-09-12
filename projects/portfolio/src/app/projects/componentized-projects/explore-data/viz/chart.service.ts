import { Injectable } from '@angular/core';
import type { EChartsOption } from 'echarts';
import type {
  AnalysisSuggestion,
  ChartCustomization,
  Dataset,
  Field,
} from '../models/types';
import { buildChartOption } from './chart-options';

/**
 * Thin Angular boundary over the pure option builders. Takes a suggestion + the
 * selected fields + customization and returns a ready-to-render ECharts option.
 */
@Injectable({ providedIn: 'root' })
export class ChartService {
  buildOption(
    dataset: Dataset,
    suggestion: AnalysisSuggestion,
    selectedFields: Field[],
    customization: ChartCustomization
  ): EChartsOption | null {
    return buildChartOption(suggestion.kind, dataset.table, selectedFields, customization);
  }
}
