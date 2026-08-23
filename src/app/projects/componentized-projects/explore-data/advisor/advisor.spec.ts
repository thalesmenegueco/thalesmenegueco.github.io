import { getSuggestionById, suggestAnalyses } from './advisor';
import type { Field, FieldType } from '../models/types';

function fields(...pairs: [string, FieldType][]): Field[] {
  return pairs.map(([name, type]) => ({ name, type }));
}

describe('advisor (rules engine)', () => {
  it('returns nothing for an empty selection', () => {
    expect(suggestAnalyses([])).toEqual([]);
  });

  it('suggests distribution charts for a single numerical field', () => {
    const kinds = suggestAnalyses(fields(['idade', 'numerical'])).map((s) => s.kind);
    expect(kinds).toContain('histogram');
    expect(kinds).toContain('box-plot');
    expect(kinds).not.toContain('bar-chart');
  });

  it('suggests frequency charts for a single categorical field', () => {
    const kinds = suggestAnalyses(fields(['cidade', 'categorical'])).map((s) => s.kind);
    expect(kinds).toContain('bar-chart');
    expect(kinds).toContain('pie-chart');
    expect(kinds).not.toContain('histogram');
  });

  it('suggests scatter and correlation for two numerical fields', () => {
    const kinds = suggestAnalyses(
      fields(['x', 'numerical'], ['y', 'numerical'])
    ).map((s) => s.kind);
    expect(kinds).toContain('scatter-plot');
    expect(kinds).toContain('correlation-coefficient');
  });

  it('matches categorical+numerical regardless of selection order', () => {
    const ab = suggestAnalyses(
      fields(['grupo', 'categorical'], ['valor', 'numerical'])
    ).map((s) => s.kind);
    const ba = suggestAnalyses(
      fields(['valor', 'numerical'], ['grupo', 'categorical'])
    ).map((s) => s.kind);
    expect(ab).toEqual(ba);
    expect(ab).toContain('grouped-box-plot');
    expect(ab).toContain('aggregate-bar-chart');
  });

  it('suggests a line chart for datetime + numerical', () => {
    const kinds = suggestAnalyses(
      fields(['data', 'datetime'], ['vendas', 'numerical'])
    ).map((s) => s.kind);
    expect(kinds).toContain('line-chart');
  });

  it('suggests stacked bar and heatmap for two categorical fields', () => {
    const kinds = suggestAnalyses(
      fields(['regiao', 'categorical'], ['produto', 'categorical'])
    ).map((s) => s.kind);
    expect(kinds).toContain('stacked-bar-chart');
    expect(kinds).toContain('heatmap');
  });

  it('suggests a correlation heatmap for more than two numerical fields', () => {
    const kinds = suggestAnalyses(
      fields(['a', 'numerical'], ['b', 'numerical'], ['c', 'numerical'])
    ).map((s) => s.kind);
    expect(kinds).toEqual(['correlation-heatmap']);
  });

  it('returns nothing for an unsupported mix of types', () => {
    expect(
      suggestAnalyses(fields(['a', 'numerical'], ['b', 'numerical'], ['c', 'categorical']))
    ).toEqual([]);
  });

  it('resolves a suggestion by id', () => {
    expect(getSuggestionById('scatter-plot')?.label).toBe('Gráfico de Dispersão');
    expect(getSuggestionById('nope')).toBeUndefined();
  });

  it('provides a teaching explanation for every suggestion', () => {
    const suggestions = suggestAnalyses(fields(['x', 'numerical']));
    expect(suggestions.length).toBeGreaterThan(0);
    for (const s of suggestions) {
      expect(s.explanation.length).toBeGreaterThan(20);
    }
  });
});
