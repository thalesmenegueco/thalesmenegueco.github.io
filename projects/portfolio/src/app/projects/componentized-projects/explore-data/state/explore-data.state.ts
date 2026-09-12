import { Injectable, computed, signal } from '@angular/core';
import type { EChartsOption } from 'echarts';
import { IngestionService } from '../ingestion/ingestion.service';
import { ChartService } from '../viz/chart.service';
import { getSuggestionById, suggestAnalyses } from '../advisor/advisor';
import type {
  AnalysisSuggestion,
  ChartCustomization,
  ColumnProfile,
  Dataset,
  Field,
  FieldType,
} from '../models/types';

/**
 * Single source of truth for the Explore Dados workspace. Holds all app state
 * as signals so the workspace, the lessons player, and the insights panel can
 * observe and drive the same data.
 *
 * Provided at the ExploreData component level (not root) so state resets when
 * the user navigates away and back.
 */
@Injectable()
export class ExploreDataState {
  readonly fieldTypes: { value: FieldType; label: string }[] = [
    { value: 'categorical', label: 'Categórica' },
    { value: 'numerical', label: 'Numérica' },
    { value: 'datetime', label: 'Data/Hora' },
    { value: 'boolean', label: 'Booleana' },
  ];

  // --- ingestion state ---
  private readonly _rows = signal<Record<string, unknown>[]>([]);
  private readonly _headers = signal<string[]>([]);
  private readonly _profiles = signal<ColumnProfile[]>([]);
  private readonly _typeOverrides = signal<Record<string, FieldType>>({});

  // --- explore state ---
  private readonly _dataset = signal<Dataset | null>(null);
  private readonly _selectedNames = signal<string[]>([]);
  private readonly _activeSuggestionId = signal<string | null>(null);
  private readonly _customization = signal<ChartCustomization>({
    title: '',
    xAxisLabel: '',
    yAxisLabel: '',
  });

  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly profiles = this._profiles.asReadonly();
  readonly dataset = this._dataset.asReadonly();
  readonly activeSuggestionId = this._activeSuggestionId.asReadonly();
  readonly customization = this._customization.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly confirmedFields = computed<Field[]>(() => {
    const ds = this._dataset();
    if (ds) {
      return ds.fields;
    }
    return this._headers().map((h) => ({
      name: h,
      type: this._typeOverrides()[h] ?? this.suggestedType(h),
    }));
  });

  readonly selectedFields = computed<Field[]>(() => {
    const names = this._selectedNames();
    return this.confirmedFields().filter((f) => names.includes(f.name));
  });

  readonly suggestions = computed<AnalysisSuggestion[]>(() =>
    suggestAnalyses(this.selectedFields())
  );

  readonly activeSuggestion = computed<AnalysisSuggestion | null>(() => {
    const id = this._activeSuggestionId();
    return id ? (getSuggestionById(id) ?? null) : null;
  });

  readonly chartOption = computed<EChartsOption | null>(() => {
    const ds = this._dataset();
    const suggestion = this.activeSuggestion();
    const fields = this.selectedFields();
    if (!ds || !suggestion || fields.length === 0) {
      return null;
    }
    return this.chartService.buildOption(ds, suggestion, fields, this._customization());
  });

  constructor(
    private readonly ingestion: IngestionService,
    private readonly chartService: ChartService
  ) {}

  // --- actions ---

  async parseFile(file: File): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const { rows, headers, profiles } = await this.ingestion.parseFile(file);
      this._rows.set(rows);
      this._headers.set(headers);
      this._profiles.set(profiles);
      this._typeOverrides.set({});
      this._dataset.set(null);
      this._selectedNames.set([]);
      this._activeSuggestionId.set(null);
    } catch (err) {
      this._error.set(err instanceof Error ? err.message : 'Não foi possível ler o arquivo.');
    } finally {
      this._loading.set(false);
    }
  }

  /** Load a lesson's inline example dataset straight into a confirmed Dataset. */
  async loadExample(csv: string, fields: Field[]): Promise<void> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const rows = await this.ingestion.parseCsvText(csv);
      this._dataset.set(this.ingestion.buildDataset(rows, fields));
      this._selectedNames.set([]);
      this._activeSuggestionId.set(null);
      this._customization.set({ title: '', xAxisLabel: '', yAxisLabel: '' });
    } catch (err) {
      this._error.set(err instanceof Error ? err.message : 'Não foi possível carregar o exemplo.');
    } finally {
      this._loading.set(false);
    }
  }

  confirmDataset(): void {
    const fields = this.confirmedFields();
    if (fields.length === 0) {
      return;
    }
    this._dataset.set(this.ingestion.buildDataset(this._rows(), fields));
    this._selectedNames.set([]);
    this._activeSuggestionId.set(null);
  }

  reset(): void {
    this._rows.set([]);
    this._headers.set([]);
    this._profiles.set([]);
    this._typeOverrides.set({});
    this._dataset.set(null);
    this._selectedNames.set([]);
    this._activeSuggestionId.set(null);
    this._customization.set({ title: '', xAxisLabel: '', yAxisLabel: '' });
    this._error.set(null);
  }

  isSelected(name: string): boolean {
    return this._selectedNames().includes(name);
  }

  toggleField(name: string): void {
    const current = this._selectedNames();
    this._selectedNames.set(
      current.includes(name) ? current.filter((n) => n !== name) : [...current, name]
    );
    this._activeSuggestionId.set(null);
  }

  selectSuggestion(id: string): void {
    const suggestion = getSuggestionById(id);
    if (!suggestion) {
      return;
    }
    this._activeSuggestionId.set(id);
    this.applyDefaultLabels(suggestion, this.selectedFields());
  }

  setTypeOverride(name: string, type: FieldType): void {
    this._typeOverrides.update((o) => ({ ...o, [name]: type }));
  }

  setCustomization(key: keyof ChartCustomization, value: string): void {
    this._customization.update((c) => {
      const next: ChartCustomization = { ...c };
      next[key] = value;
      return next;
    });
  }

  // --- helpers for the template ---

  suggestedType(name: string): FieldType {
    return this._profiles().find((p) => p.name === name)?.suggestedType ?? 'categorical';
  }

  typeOf(name: string): FieldType {
    return this._typeOverrides()[name] ?? this.suggestedType(name);
  }

  typeLabel(type: FieldType): string {
    return this.fieldTypes.find((t) => t.value === type)?.label ?? type;
  }

  formatRate(rate: number): string {
    return `${Math.round(rate * 100)}%`;
  }

  private applyDefaultLabels(suggestion: AnalysisSuggestion, fields: Field[]): void {
    const first = fields[0];
    const second = fields[1];
    const cat = fields.find((f) => f.type === 'categorical');
    const num = fields.find((f) => f.type === 'numerical');
    const time = fields.find((f) => f.type === 'datetime');
    const cats = fields.filter((f) => f.type === 'categorical');

    let x = first?.name ?? '';
    let y = second?.name ?? '';

    switch (suggestion.kind) {
      case 'histogram':
      case 'bar-chart':
        x = first?.name ?? '';
        y = 'Contagem';
        break;
      case 'pie-chart':
        y = 'Contagem';
        break;
      case 'box-plot':
        x = '';
        y = first?.name ?? '';
        break;
      case 'grouped-box-plot':
        x = cat?.name ?? '';
        y = num?.name ?? '';
        break;
      case 'aggregate-bar-chart':
        x = cat?.name ?? '';
        y = `Média de ${num?.name ?? ''}`;
        break;
      case 'line-chart':
        x = time?.name ?? '';
        y = num?.name ?? '';
        break;
      case 'stacked-bar-chart':
        x = cats[0]?.name ?? '';
        y = 'Contagem';
        break;
      case 'heatmap':
        x = cats[1]?.name ?? '';
        y = cats[0]?.name ?? '';
        break;
      default:
        break;
    }

    this._customization.set({ title: suggestion.label, xAxisLabel: x, yAxisLabel: y });
  }
}
