import { Injectable } from '@angular/core';
import type { Dataset } from '../models/types';
import type { Insight, InsightDetectionResult } from './insight.types';
import { detectOutliers } from './detectors/outlier.detector';
import {
  detectStrongCorrelations,
  type NumericColumn,
} from './detectors/correlation.detector';
import {
  detectDistributionShape,
  detectMultimodality,
} from './detectors/distribution.detector';

const SEVERITY_ORDER: Record<Insight['severity'], number> = {
  critical: 0,
  warning: 1,
  info: 2,
};

/**
 * Orchestrates the pure detectors over a Dataset and returns the top insights.
 */
@Injectable({ providedIn: 'root' })
export class InsightGeneratorService {
  generateInsights(dataset: Dataset): InsightDetectionResult {
    const insights: Insight[] = [];

    const columns: NumericColumn[] = dataset.fields
      .filter((f) => f.type === 'numerical')
      .map((f) => ({ name: f.name, data: dataset.table.array(f.name) as unknown[] }));

    for (const column of columns) {
      insights.push(...detectOutliers(column.data, column.name));
      insights.push(...detectDistributionShape(column.data, column.name));
      insights.push(...detectMultimodality(column.data, column.name));
    }

    if (columns.length >= 2) {
      insights.push(...detectStrongCorrelations(columns));
    }

    insights.sort(
      (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
    );

    return {
      insights: insights.slice(0, 5),
      timestamp: new Date(),
    };
  }
}
