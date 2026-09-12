export type InsightType =
  | 'outlier'
  | 'correlation'
  | 'skewness'
  | 'multimodal'
  | 'trend'
  | 'seasonality'
  | 'imbalance';

export type InsightSeverity = 'info' | 'warning' | 'critical';

export interface Insight {
  type: InsightType;
  severity: InsightSeverity;
  fields: string[];
  value?: number;
  title: string;
  description: string;
  recommendation?: string;
  icon: string;
}

export interface InsightDetectionResult {
  insights: Insight[];
  timestamp: Date;
}
