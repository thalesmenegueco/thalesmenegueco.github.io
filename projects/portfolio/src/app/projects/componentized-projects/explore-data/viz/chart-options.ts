import type { EChartsOption } from 'echarts';
import type { ColumnTable } from 'arquero';
import { quantileSorted, sampleCorrelation } from 'simple-statistics';
import type { ChartCustomization, ChartKind, Field, FieldType } from '../models/types';

/**
 * Pure, framework-free ECharts option builders.
 *
 * These functions take a table (Arquero ColumnTable), the selected fields, and
 * user customization, and return an ECharts option object. They import no
 * Angular, hold no state, and are unit-testable in isolation. Aggregations are
 * done with plain, fully-typed helpers on the extracted columns plus
 * simple-statistics for quantiles/correlation — this keeps the builders robust
 * and independent of Arquero's loosely-typed `op` aggregators.
 */

const PALETTE = [
  '#ffa300', // site accent (orange)
  '#ec0dcf', // site accent (magenta)
  '#ffd166',
  '#06d6a0',
  '#118ab2',
  '#ef476f',
  '#f78c6b',
  '#c77dff',
];

const TEXT_COLOR = '#f5f5f5';
const AXIS_LABEL = 'rgba(245,245,245,0.7)';
const AXIS_LINE = 'rgba(255,255,255,0.25)';
const SPLIT_LINE = 'rgba(255,255,255,0.08)';

export type OptionBuilder = (
  table: ColumnTable,
  fields: Field[],
  customization: ChartCustomization
) => EChartsOption;

function round(value: number, digits = 0): number {
  const p = 10 ** digits;
  return Math.round(value * p) / p;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const n = typeof value === 'number' ? value : Number(String(value).trim());
  return Number.isFinite(n) ? n : null;
}

function toEpoch(value: unknown): number | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  const t = Date.parse(String(value).trim());
  return Number.isFinite(t) ? t : null;
}

function categoryLabel(value: unknown): string {
  if (value === null || value === undefined || value === '') {
    return '(vazio)';
  }
  return String(value);
}

function numericArray(table: ColumnTable, name: string): number[] {
  const raw = table.array(name) as unknown[];
  const out: number[] = [];
  for (const v of raw) {
    const n = toNumber(v);
    if (n !== null) {
      out.push(n);
    }
  }
  return out;
}

function pairedPoints(table: ColumnTable, a: string, b: string): [number, number][] {
  const aa = table.array(a) as unknown[];
  const bb = table.array(b) as unknown[];
  const points: [number, number][] = [];
  for (let i = 0; i < aa.length; i++) {
    const x = toNumber(aa[i]);
    const y = toNumber(bb[i]);
    if (x !== null && y !== null) {
      points.push([x, y]);
    }
  }
  return points;
}

function correlationBetween(table: ColumnTable, a: string, b: string): number | null {
  const points = pairedPoints(table, a, b);
  if (points.length < 2) {
    return null;
  }
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  return sampleCorrelation(xs, ys);
}

function categoryCounts(table: ColumnTable, cat: string): { name: string; value: number }[] {
  const raw = table.array(cat) as unknown[];
  const counts = new Map<string, number>();
  for (const v of raw) {
    const key = categoryLabel(v);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const out = [...counts.entries()].map(([name, value]) => ({ name, value }));
  out.sort((x, y) => y.value - x.value);
  return out;
}

function aggregateByCategory(
  table: ColumnTable,
  cat: string,
  num: string,
  kind: 'mean' | 'sum'
): { name: string; value: number }[] {
  const rawCat = table.array(cat) as unknown[];
  const rawNum = table.array(num) as unknown[];
  const sums = new Map<string, number>();
  const totals = new Map<string, number>();
  for (let i = 0; i < rawCat.length; i++) {
    const n = toNumber(rawNum[i]);
    if (n === null) {
      continue;
    }
    const key = categoryLabel(rawCat[i]);
    sums.set(key, (sums.get(key) ?? 0) + n);
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }
  const out = [...sums.entries()]
    .map(([name, sum]) => ({
      name,
      value: kind === 'mean' ? sum / (totals.get(name) ?? 1) : sum,
    }))
    .filter((r) => Number.isFinite(r.value));
  out.sort((x, y) => y.value - x.value);
  return out;
}

function groupedBoxStats(
  table: ColumnTable,
  cat: string,
  num: string
): { name: string; values: number[]; count: number }[] {
  const rawCat = table.array(cat) as unknown[];
  const rawNum = table.array(num) as unknown[];
  const buckets = new Map<string, number[]>();
  for (let i = 0; i < rawCat.length; i++) {
    const n = toNumber(rawNum[i]);
    if (n === null) {
      continue;
    }
    const key = categoryLabel(rawCat[i]);
    const arr = buckets.get(key) ?? [];
    arr.push(n);
    buckets.set(key, arr);
  }
  return [...buckets.entries()]
    .map(([name, values]) => ({ name, values, count: values.length }))
    .sort((x, y) => y.count - x.count);
}

function boxValues(sorted: number[]): [number, number, number, number, number] {
  return [
    sorted[0],
    quantileSorted(sorted, 0.25),
    quantileSorted(sorted, 0.5),
    quantileSorted(sorted, 0.75),
    sorted[sorted.length - 1],
  ];
}

function crossTab(
  table: ColumnTable,
  catA: string,
  catB: string
): { row: string; col: string; count: number }[] {
  const rawA = table.array(catA) as unknown[];
  const rawB = table.array(catB) as unknown[];
  const counts = new Map<string, number>();
  for (let i = 0; i < rawA.length; i++) {
    const key = `${categoryLabel(rawA[i])}\u0000${categoryLabel(rawB[i])}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].map(([key, count]) => {
    const [row, col] = key.split('\u0000');
    return { row, col, count };
  });
}

function base(custom: ChartCustomization): EChartsOption {
  return {
    backgroundColor: 'transparent',
    textStyle: { color: TEXT_COLOR },
    title: {
      text: custom.title || '',
      left: 'center',
      textStyle: { color: '#ffa300', fontSize: 16 },
    },
  };
}

function gridStyle(): EChartsOption['grid'] {
  return { left: 60, right: 30, top: 70, bottom: 60, containLabel: true };
}

function axisStyle() {
  return {
    nameTextStyle: { color: AXIS_LABEL },
    axisLine: { lineStyle: { color: AXIS_LINE } },
    axisLabel: { color: AXIS_LABEL },
    splitLine: { lineStyle: { color: SPLIT_LINE } },
  };
}

function boxSeriesStyle() {
  return {
    itemStyle: { color: PALETTE[3], borderColor: '#f5f5f5' },
  };
}

function emptyOption(custom: ChartCustomization, message: string): EChartsOption {
  return {
    ...base(custom),
    graphic: {
      type: 'text',
      left: 'center',
      top: 'middle',
      style: { text: message, fill: AXIS_LABEL, fontSize: 14 },
    },
  };
}

function fieldOf(fields: Field[], type: FieldType): Field | undefined {
  return fields.find((f) => f.type === type);
}

function histogram(table: ColumnTable, fields: Field[], custom: ChartCustomization): EChartsOption {
  const values = numericArray(table, fields[0].name);
  if (values.length === 0) {
    return emptyOption(custom, 'Sem dados numéricos válidos.');
  }

  const binCount = Math.min(30, Math.max(5, Math.ceil(Math.sqrt(values.length))));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const width = (max - min) / binCount || 1;
  const bins = new Array<number>(binCount).fill(0);
  for (const v of values) {
    const idx = v === max ? binCount - 1 : Math.floor((v - min) / width);
    bins[idx] += 1;
  }
  const labels = bins.map((_, i) => `${round(min + i * width)}–${round(min + (i + 1) * width)}`);

  return {
    ...base(custom),
    tooltip: { trigger: 'axis' },
    grid: gridStyle(),
    xAxis: {
      type: 'category',
      data: labels,
      name: custom.xAxisLabel || fields[0].name,
      ...axisStyle(),
    },
    yAxis: { type: 'value', name: custom.yAxisLabel || 'Contagem', ...axisStyle() },
    series: [{ type: 'bar', data: bins, itemStyle: { color: PALETTE[0] } }],
  };
}

function boxPlot(table: ColumnTable, fields: Field[], custom: ChartCustomization): EChartsOption {
  const values = numericArray(table, fields[0].name).sort((a, b) => a - b);
  if (values.length === 0) {
    return emptyOption(custom, 'Sem dados numéricos válidos.');
  }

  return {
    ...base(custom),
    tooltip: { trigger: 'item' },
    grid: gridStyle(),
    xAxis: { type: 'category', data: [fields[0].name], ...axisStyle() },
    yAxis: { type: 'value', name: custom.yAxisLabel || fields[0].name, ...axisStyle() },
    series: [{ type: 'boxplot', data: [boxValues(values)], ...boxSeriesStyle() }],
  };
}

function barChart(table: ColumnTable, fields: Field[], custom: ChartCustomization): EChartsOption {
  const counts = categoryCounts(table, fields[0].name).slice(0, 30);
  return {
    ...base(custom),
    tooltip: { trigger: 'axis' },
    grid: gridStyle(),
    xAxis: {
      type: 'category',
      data: counts.map((c) => c.name),
      name: custom.xAxisLabel || fields[0].name,
      ...axisStyle(),
    },
    yAxis: { type: 'value', name: custom.yAxisLabel || 'Contagem', ...axisStyle() },
    series: [{ type: 'bar', data: counts.map((c) => c.value), itemStyle: { color: PALETTE[1] } }],
  };
}

function pieChart(table: ColumnTable, fields: Field[], custom: ChartCustomization): EChartsOption {
  const counts = categoryCounts(table, fields[0].name);
  const top = counts.slice(0, 7);
  const rest = counts.slice(7);
  if (rest.length > 0) {
    top.push({ name: 'Outros', value: rest.reduce((s, c) => s + c.value, 0) });
  }

  return {
    ...base(custom),
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: TEXT_COLOR } },
    series: [
      {
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['50%', '45%'],
        data: top.map((c) => ({ name: c.name, value: c.value })),
        label: { color: TEXT_COLOR },
        itemStyle: { borderColor: '#050505', borderWidth: 1 },
      },
    ],
  };
}

function scatterPlot(table: ColumnTable, fields: Field[], custom: ChartCustomization): EChartsOption {
  const points = pairedPoints(table, fields[0].name, fields[1].name);
  return {
    ...base(custom),
    tooltip: { trigger: 'item' },
    grid: gridStyle(),
    xAxis: {
      type: 'value',
      name: custom.xAxisLabel || fields[0].name,
      ...axisStyle(),
    },
    yAxis: {
      type: 'value',
      name: custom.yAxisLabel || fields[1].name,
      ...axisStyle(),
    },
    series: [
      {
        type: 'scatter',
        data: points,
        symbolSize: 8,
        itemStyle: { color: PALETTE[2] },
      },
    ],
  };
}

function correlationCoefficient(
  table: ColumnTable,
  fields: Field[],
  custom: ChartCustomization
): EChartsOption {
  const r = correlationBetween(table, fields[0].name, fields[1].name);
  const rText = r === null ? 'n/d' : `r = ${round(r, 3)}`;
  return {
    ...scatterPlot(table, fields, custom),
    title: {
      text: `${custom.title} — ${rText}`,
      left: 'center',
      textStyle: { color: '#ffa300', fontSize: 16 },
      subtext: 'Coeficiente de correlação de Pearson (de -1 a 1)',
      subtextStyle: { color: AXIS_LABEL },
    },
  };
}

function groupedBoxPlot(
  table: ColumnTable,
  fields: Field[],
  custom: ChartCustomization
): EChartsOption {
  const cat = fieldOf(fields, 'categorical');
  const num = fieldOf(fields, 'numerical');
  if (!cat || !num) {
    return emptyOption(custom, 'Selecione uma categoria e um número.');
  }
  const groups = groupedBoxStats(table, cat.name, num.name)
    .slice(0, 20)
    .map((g) => ({
      name: g.name,
      box: boxValues(g.values.sort((a, b) => a - b)),
    }));

  return {
    ...base(custom),
    tooltip: { trigger: 'item' },
    grid: gridStyle(),
    xAxis: {
      type: 'category',
      data: groups.map((g) => g.name),
      name: custom.xAxisLabel || cat.name,
      ...axisStyle(),
    },
    yAxis: { type: 'value', name: custom.yAxisLabel || num.name, ...axisStyle() },
    series: [{ type: 'boxplot', data: groups.map((g) => g.box), ...boxSeriesStyle() }],
  };
}

function aggregateBarChart(
  table: ColumnTable,
  fields: Field[],
  custom: ChartCustomization
): EChartsOption {
  const cat = fieldOf(fields, 'categorical');
  const num = fieldOf(fields, 'numerical');
  if (!cat || !num) {
    return emptyOption(custom, 'Selecione uma categoria e um número.');
  }
  const data = aggregateByCategory(table, cat.name, num.name, 'mean').slice(0, 30);
  return {
    ...base(custom),
    tooltip: { trigger: 'axis' },
    grid: gridStyle(),
    xAxis: {
      type: 'category',
      data: data.map((d) => d.name),
      name: custom.xAxisLabel || cat.name,
      ...axisStyle(),
    },
    yAxis: {
      type: 'value',
      name: custom.yAxisLabel || `Média de ${num.name}`,
      ...axisStyle(),
    },
    series: [{ type: 'bar', data: data.map((d) => round(d.value, 2)), itemStyle: { color: PALETTE[4] } }],
  };
}

function lineChart(table: ColumnTable, fields: Field[], custom: ChartCustomization): EChartsOption {
  const time = fieldOf(fields, 'datetime');
  const num = fieldOf(fields, 'numerical');
  if (!time || !num) {
    return emptyOption(custom, 'Selecione uma data e um número.');
  }
  const tArr = table.array(time.name) as unknown[];
  const nArr = table.array(num.name) as unknown[];
  const points: [number, number][] = [];
  for (let i = 0; i < tArr.length; i++) {
    const t = toEpoch(tArr[i]);
    const n = toNumber(nArr[i]);
    if (t !== null && n !== null) {
      points.push([t, n]);
    }
  }
  points.sort((a, b) => a[0] - b[0]);

  return {
    ...base(custom),
    tooltip: { trigger: 'axis' },
    grid: gridStyle(),
    xAxis: { type: 'time', name: custom.xAxisLabel || time.name, ...axisStyle() },
    yAxis: { type: 'value', name: custom.yAxisLabel || num.name, ...axisStyle() },
    series: [
      {
        type: 'line',
        data: points,
        showSymbol: false,
        lineStyle: { color: PALETTE[5], width: 2 },
        itemStyle: { color: PALETTE[5] },
      },
    ],
  };
}

function stackedBarChart(
  table: ColumnTable,
  fields: Field[],
  custom: ChartCustomization
): EChartsOption {
  const cats = fields.filter((f) => f.type === 'categorical');
  if (cats.length < 2) {
    return emptyOption(custom, 'Selecione duas categorias.');
  }
  const cross = crossTab(table, cats[0].name, cats[1].name);
  const xCats = [...new Set(cross.map((c) => c.row))].slice(0, 20);
  const seriesCats = [...new Set(cross.map((c) => c.col))].slice(0, 6);

  const series = seriesCats.map((sc, si) => ({
    name: sc,
    type: 'bar' as const,
    stack: 'total',
    emphasis: { focus: 'series' as const },
    data: xCats.map((xc) => cross.find((c) => c.row === xc && c.col === sc)?.count ?? 0),
    itemStyle: { color: PALETTE[si % PALETTE.length] },
  }));

  return {
    ...base(custom),
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { bottom: 0, textStyle: { color: TEXT_COLOR } },
    grid: gridStyle(),
    xAxis: {
      type: 'category',
      data: xCats,
      name: custom.xAxisLabel || cats[0].name,
      ...axisStyle(),
    },
    yAxis: { type: 'value', name: custom.yAxisLabel || 'Contagem', ...axisStyle() },
    series,
  };
}

function heatmap(table: ColumnTable, fields: Field[], custom: ChartCustomization): EChartsOption {
  const cats = fields.filter((f) => f.type === 'categorical');
  if (cats.length < 2) {
    return emptyOption(custom, 'Selecione duas categorias.');
  }
  const cross = crossTab(table, cats[0].name, cats[1].name);
  const xCats = [...new Set(cross.map((c) => c.col))].slice(0, 20);
  const yCats = [...new Set(cross.map((c) => c.row))].slice(0, 20);

  const data: [number, number, number][] = [];
  for (const c of cross) {
    const xi = xCats.indexOf(c.col);
    const yi = yCats.indexOf(c.row);
    if (xi >= 0 && yi >= 0) {
      data.push([xi, yi, c.count]);
    }
  }
  const maxCount = data.reduce((m, d) => Math.max(m, d[2]), 0) || 1;

  return {
    ...base(custom),
    tooltip: { position: 'top' },
    grid: { left: 80, right: 30, top: 70, bottom: 80, containLabel: true },
    xAxis: {
      type: 'category',
      data: xCats,
      name: custom.xAxisLabel || cats[1].name,
      ...axisStyle(),
    },
    yAxis: {
      type: 'category',
      data: yCats,
      name: custom.yAxisLabel || cats[0].name,
      ...axisStyle(),
    },
    visualMap: {
      min: 0,
      max: maxCount,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      textStyle: { color: AXIS_LABEL },
      inRange: { color: ['#1a1a2e', '#ffa300'] },
    },
    series: [{ type: 'heatmap', data, label: { show: true, color: TEXT_COLOR } }],
  };
}

function correlationHeatmap(
  table: ColumnTable,
  fields: Field[],
  custom: ChartCustomization
): EChartsOption {
  const data: [number, number, number][] = [];
  for (let i = 0; i < fields.length; i++) {
    for (let j = 0; j < fields.length; j++) {
      const r = i === j ? 1 : correlationBetween(table, fields[i].name, fields[j].name);
      data.push([j, i, r === null ? 0 : round(r, 2)]);
    }
  }

  return {
    ...base(custom),
    tooltip: {
      position: 'top',
      formatter: (p: unknown) => {
        const params = p as { value: [number, number, number] };
        const [xi, yi, val] = params.value;
        return `${fields[yi]?.name ?? ''} × ${fields[xi]?.name ?? ''}: ${val}`;
      },
    },
    grid: { left: 80, right: 30, top: 70, bottom: 80, containLabel: true },
    xAxis: { type: 'category', data: fields.map((f) => f.name), ...axisStyle() },
    yAxis: { type: 'category', data: fields.map((f) => f.name), ...axisStyle() },
    visualMap: {
      min: -1,
      max: 1,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      textStyle: { color: AXIS_LABEL },
      inRange: { color: ['#118ab2', '#1a1a2e', '#ffa300'] },
    },
    series: [{ type: 'heatmap', data, label: { show: true, color: TEXT_COLOR } }],
  };
}

export const BUILDERS: Record<ChartKind, OptionBuilder> = {
  'histogram': histogram,
  'box-plot': boxPlot,
  'bar-chart': barChart,
  'pie-chart': pieChart,
  'scatter-plot': scatterPlot,
  'correlation-coefficient': correlationCoefficient,
  'grouped-box-plot': groupedBoxPlot,
  'aggregate-bar-chart': aggregateBarChart,
  'line-chart': lineChart,
  'stacked-bar-chart': stackedBarChart,
  'heatmap': heatmap,
  'correlation-heatmap': correlationHeatmap,
};

export function buildChartOption(
  kind: ChartKind,
  table: ColumnTable,
  fields: Field[],
  customization: ChartCustomization
): EChartsOption | null {
  const builder = BUILDERS[kind];
  return builder ? builder(table, fields, customization) : null;
}
