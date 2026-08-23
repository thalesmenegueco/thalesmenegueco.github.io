import { detectOutliers } from './detectors/outlier.detector';
import { detectStrongCorrelations } from './detectors/correlation.detector';
import {
  detectDistributionShape,
  detectMultimodality,
} from './detectors/distribution.detector';

describe('insight detectors', () => {
  describe('detectOutliers (IQR)', () => {
    it('detects extreme values', () => {
      const data = [
        2500, 2700, 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3800, 4000, 4200,
        4500, 4800, 5000, 5200, 5500, 6000, 12000, 95000,
      ];
      const insights = detectOutliers(data, 'renda');
      expect(insights.length).toBe(1);
      expect(insights[0].type).toBe('outlier');
      expect(insights[0].value).toBe(2);
      expect(insights[0].fields).toEqual(['renda']);
    });

    it('returns nothing when there are no outliers', () => {
      expect(detectOutliers([1, 2, 3, 4, 5], 'x')).toEqual([]);
    });
  });

  describe('detectStrongCorrelations', () => {
    it('detects a strong positive correlation', () => {
      const columns = [
        { name: 'x', data: [1, 2, 3, 4, 5] },
        { name: 'y', data: [2, 4, 6, 8, 10] },
      ];
      const insights = detectStrongCorrelations(columns);
      expect(insights.length).toBe(1);
      expect(insights[0].type).toBe('correlation');
      expect(insights[0].severity).toBe('critical');
      expect(insights[0].fields).toEqual(['x', 'y']);
    });

    it('ignores weak correlations', () => {
      const columns = [
        { name: 'x', data: [1, 2, 3, 4, 5] },
        { name: 'y', data: [5, 1, 4, 2, 3] },
      ];
      expect(detectStrongCorrelations(columns)).toEqual([]);
    });
  });

  describe('detectDistributionShape (skewness)', () => {
    it('flags a right-skewed distribution', () => {
      const insights = detectDistributionShape([1, 2, 3, 4, 5, 6, 7, 8, 9, 100], 'v');
      expect(insights.length).toBe(1);
      expect(insights[0].type).toBe('skewness');
      expect(insights[0].value).toBeGreaterThan(1);
    });

    it('returns nothing for symmetric data', () => {
      expect(detectDistributionShape([1, 2, 3, 4, 5, 6, 7, 8, 9], 'v')).toEqual([]);
    });
  });

  describe('detectMultimodality', () => {
    it('flags high-variation data as possibly multimodal', () => {
      const insights = detectMultimodality([1, 100, 1, 100, 1, 100], 'v');
      expect(insights.length).toBe(1);
      expect(insights[0].type).toBe('multimodal');
    });

    it('returns nothing for low-variation data', () => {
      expect(detectMultimodality([10, 11, 10, 11, 10], 'v')).toEqual([]);
    });
  });
});
