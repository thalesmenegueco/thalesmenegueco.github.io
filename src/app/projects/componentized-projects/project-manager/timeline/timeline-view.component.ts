import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formatDay, todayDayIndex } from './timeline.date';
import {
  buildDependencyGraph,
  collectPredecessors,
  DependencyGraph,
} from './timeline.dependencies';
import { buildLayout, TimelineBar, TimelineLayout } from './timeline.layout';
import { BarGeometry, buildConnectorPaths, ConnectorPath } from './timeline.path';
import {
  DEFAULT_TIMELINE_CONFIG,
  TimelineItem,
  TimelineViewConfig,
} from './timeline.types';

const HEADER_HEIGHT = 48;
const LABEL_WIDTH = 200;

/**
 * Read-only Gantt/timeline view. Receives normalized items (see
 * `timeline.types.ts`), computes a deterministic layout, and renders bars,
 * gridlines, headers, and dependency connectors. Selection emits the original
 * item id; navigation is the host's responsibility.
 */
@Component({
  selector: 'app-timeline-view',
  standalone: true,
  imports: [],
  templateUrl: './timeline-view.component.html',
  styleUrl: './timeline-view.component.scss',
})
export class TimelineViewComponent {
  private _items: TimelineItem[] = [];
  private _config: TimelineViewConfig = DEFAULT_TIMELINE_CONFIG;

  @Input() loading = false;
  @Output() selectItem = new EventEmitter<string>();

  @Input()
  get items(): TimelineItem[] {
    return this._items;
  }
  set items(value: TimelineItem[]) {
    this._items = value ?? [];
    this.recompute();
    this.clearSelection();
  }

  @Input()
  get config(): TimelineViewConfig {
    return this._config;
  }
  set config(value: TimelineViewConfig) {
    this._config = value ?? DEFAULT_TIMELINE_CONFIG;
    this.recompute();
    this.clearSelection();
  }

  layout: TimelineLayout = buildLayout([], DEFAULT_TIMELINE_CONFIG);
  graph: DependencyGraph = buildDependencyGraph([]);
  paths: ConnectorPath[] = [];
  barByItemId = new Map<string, TimelineBar>();

  selectedId: string | null = null;
  directPredecessors = new Set<string>();
  ancestors = new Set<string>();

  readonly headerHeight = HEADER_HEIGHT;
  readonly labelWidth = LABEL_WIDTH;

  get monthHeaders() {
    return this.layout.headers.filter((h) => h.kind === 'month');
  }

  get dayHeaders() {
    return this.layout.headers.filter((h) => h.kind === 'day');
  }

  get issues() {
    return [...this.layout.issues, ...this.graph.issues];
  }

  barFor(itemId: string): TimelineBar | undefined {
    return this.barByItemId.get(itemId);
  }

  select(itemId: string): void {
    this.selectedId = itemId;
    const info = collectPredecessors(this.graph, itemId);
    this.directPredecessors = new Set(info.direct);
    this.ancestors = new Set(info.ancestors);
    this.selectItem.emit(itemId);
  }

  clearSelection(): void {
    this.selectedId = null;
    this.directPredecessors = new Set();
    this.ancestors = new Set();
  }

  onBarKeydown(itemId: string, event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.select(itemId);
    } else if (event.key === 'Escape') {
      this.clearSelection();
    }
  }

  isSelected(itemId: string): boolean {
    return this.selectedId === itemId;
  }

  isDirectPredecessor(itemId: string): boolean {
    return this.directPredecessors.has(itemId);
  }

  isAncestor(itemId: string): boolean {
    return this.ancestors.has(itemId);
  }

  isPathDimmed(path: ConnectorPath): boolean {
    if (this.selectedId === null) {
      return false;
    }
    const relevant = new Set<string>([
      this.selectedId as string,
      ...this.directPredecessors,
      ...this.ancestors,
    ]);
    return !relevant.has(path.predecessorId) && !relevant.has(path.successorId);
  }

  barAriaLabel(bar: TimelineBar): string {
    const endInclusive = formatDay(bar.endDayExclusive - 1);
    const parts = [
      `${bar.label}${bar.groupLabel && bar.groupLabel !== bar.label ? ` (${bar.groupLabel})` : ''}`,
      bar.kind === 'project' ? 'projeto' : 'tarefa',
      `de ${formatDay(bar.startDay)} até ${endInclusive}`,
    ];
    if (bar.status) {
      parts.push(`status: ${bar.status}`);
    }
    if (bar.progress !== undefined) {
      parts.push(`progresso: ${bar.progress}%`);
    }
    return parts.join(', ');
  }

  private recompute(): void {
    this.layout = buildLayout(this.items, this.config, todayDayIndex());
    this.graph = buildDependencyGraph(this.items);
    this.barByItemId = new Map(this.layout.bars.map((bar) => [bar.itemId, bar]));

    const geometry = new Map<string, BarGeometry>();
    for (const bar of this.layout.bars) {
      geometry.set(bar.itemId, {
        left: bar.x,
        right: bar.x + bar.width,
        centerY: this.headerHeight + bar.centerYInRows,
        rowIndex: bar.rowIndex,
      });
    }
    this.paths = buildConnectorPaths(this.graph.edges, geometry, this.config.barHeight);
  }
}
