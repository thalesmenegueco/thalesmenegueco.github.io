/**
 * Pure layout engine. No Angular, DOM, or framework imports.
 *
 * Transforms normalized items into a deterministic geometry model used by the
 * renderer. Every coordinate is expressed in "chart space": x is measured in
 * pixels from the timeline range start (`x = (day - rangeStart) * unitWidth`),
 * and y is measured in pixels from the top of the rows area.
 */

import { classifySchedule, DateInterval, formatDay, parseIsoDay } from './timeline.date';
import { TimelineItem, TimelineIssue, TimelineViewConfig } from './timeline.types';

const MILESTONE_WIDTH = 12;
const RANGE_PADDING_DAYS = 2;

const MONTH_LABELS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export interface TimelineRow {
  readonly itemId: string;
  readonly kind: 'project' | 'task';
  readonly depth: number;
  readonly label: string;
  readonly status?: string;
  readonly hasBar: boolean;
}

export interface TimelineBar {
  readonly itemId: string;
  readonly kind: 'project' | 'task';
  readonly rowIndex: number;
  readonly depth: number;
  readonly x: number;
  readonly width: number;
  readonly height: number;
  /** Top of the bar within the rows area. */
  readonly topInRows: number;
  /** Vertical center of the bar within the rows area (for connectors). */
  readonly centerYInRows: number;
  readonly startDay: number;
  readonly endDayExclusive: number;
  readonly label: string;
  /** Label of the containing project (for accessible names). */
  readonly groupLabel: string;
  readonly status?: string;
  readonly progress?: number;
  readonly derived: boolean;
  readonly milestone: boolean;
}

export interface TimelineHeaderUnit {
  readonly kind: 'month' | 'day';
  readonly label: string;
  readonly x: number;
  readonly width: number;
}

export interface TimelineGridline {
  readonly kind: 'month' | 'day';
  readonly x: number;
}

export interface TimelineLayout {
  readonly rangeStartDay: number;
  readonly rangeEndDayExclusive: number;
  readonly rows: readonly TimelineRow[];
  readonly bars: readonly TimelineBar[];
  readonly headers: readonly TimelineHeaderUnit[];
  readonly gridlines: readonly TimelineGridline[];
  readonly todayMarkerX: number | null;
  readonly contentWidth: number;
  readonly contentHeight: number;
  readonly issues: readonly TimelineIssue[];
  readonly hasScheduledItem: boolean;
}

interface ScheduledItem {
  readonly interval: DateInterval;
  readonly derived: boolean;
  readonly milestone: boolean;
}

const xFor = (day: number, rangeStartDay: number, unitWidth: number): number =>
  (day - rangeStartDay) * unitWidth;

export function buildLayout(
  items: readonly TimelineItem[],
  config: TimelineViewConfig,
  todayDay?: number
): TimelineLayout {
  const itemById = new Map(items.map((item) => [item.id, item]));
  const childrenByParent = buildChildrenMap(items);
  const issues: TimelineIssue[] = [];

  // Pass 1: classify every task's own schedule.
  const schedules = new Map<string, ScheduledItem>();
  for (const item of items) {
    if (item.kind !== 'task') {
      continue;
    }
    const result = classifySchedule(item.start, item.end);
    if (result.kind === 'scheduled') {
      schedules.set(item.id, {
        interval: result.interval,
        derived: false,
        milestone: result.milestone,
      });
    } else if (result.kind === 'invalid') {
      schedules.delete(item.id);
      issues.push(issueForSchedule(item, result.reason));
    }
  }

  // Pass 2: derive project summary intervals from the now-known task schedules.
  for (const item of items) {
    if (item.kind !== 'project') {
      continue;
    }
    const explicit = classifySchedule(item.start, item.end);
    if (explicit.kind === 'scheduled') {
      schedules.set(item.id, {
        interval: explicit.interval,
        derived: false,
        milestone: explicit.milestone,
      });
    } else if (explicit.kind === 'invalid') {
      issues.push(issueForSchedule(item, explicit.reason));
    } else {
      const derived = deriveProjectInterval(item, childrenByParent, schedules);
      if (derived) {
        schedules.set(item.id, { interval: derived, derived: true, milestone: false });
      }
    }
  }

  // Flatten rows in pre-order (project -> its tasks -> nested subtasks).
  const rows = flattenRows(items, childrenByParent, schedules);

  // Global range from scheduled items.
  let rangeStartDay = Number.POSITIVE_INFINITY;
  let rangeEndDayExclusive = Number.NEGATIVE_INFINITY;
  for (const schedule of schedules.values()) {
    rangeStartDay = Math.min(rangeStartDay, schedule.interval.startDay);
    rangeEndDayExclusive = Math.max(rangeEndDayExclusive, schedule.interval.endDayExclusive);
  }

  const hasScheduledItem = schedules.size > 0;
  if (!hasScheduledItem) {
    return {
      rangeStartDay: 0,
      rangeEndDayExclusive: 0,
      rows,
      bars: [],
      headers: [],
      gridlines: [],
      todayMarkerX: null,
      contentWidth: 0,
      contentHeight: rows.length * config.rowHeight,
      issues,
      hasScheduledItem: false,
    };
  }

  rangeStartDay -= RANGE_PADDING_DAYS;
  rangeEndDayExclusive += RANGE_PADDING_DAYS;

  // Bars.
  const bars: TimelineBar[] = [];
  const rowIndexByItem = new Map<string, number>();
  rows.forEach((row, index) => rowIndexByItem.set(row.itemId, index));

  for (const row of rows) {
    const schedule = schedules.get(row.itemId);
    if (!schedule) {
      continue;
    }
    const rowIndex = rowIndexByItem.get(row.itemId) as number;
    const milestone = schedule.milestone;
    const rawWidth = milestone
      ? 0
      : (schedule.interval.endDayExclusive - schedule.interval.startDay) * config.unitWidth;
    const width = milestone ? MILESTONE_WIDTH : Math.max(rawWidth, MILESTONE_WIDTH);
    const x = milestone
      ? xFor(schedule.interval.startDay, rangeStartDay, config.unitWidth) +
        (config.unitWidth - MILESTONE_WIDTH) / 2
      : xFor(schedule.interval.startDay, rangeStartDay, config.unitWidth);
    const height = config.barHeight;
    const topInRows = rowIndex * config.rowHeight + (config.rowHeight - height) / 2;
    const item = itemById.get(row.itemId);

    bars.push({
      itemId: row.itemId,
      kind: row.kind,
      rowIndex,
      depth: row.depth,
      x,
      width,
      height,
      topInRows,
      centerYInRows: topInRows + height / 2,
      startDay: schedule.interval.startDay,
      endDayExclusive: schedule.interval.endDayExclusive,
      label: row.label,
      groupLabel: groupLabelOf(row.itemId, itemById),
      status: row.status,
      progress: item?.progress,
      derived: schedule.derived,
      milestone,
    });
  }

  const headers = buildHeaders(rangeStartDay, rangeEndDayExclusive, config.unitWidth);
  const gridlines = buildGridlines(rangeStartDay, rangeEndDayExclusive, config.unitWidth);

  const todayMarkerX =
    config.showToday && todayDay !== undefined && todayDay >= rangeStartDay && todayDay < rangeEndDayExclusive
      ? xFor(todayDay, rangeStartDay, config.unitWidth)
      : null;

  return {
    rangeStartDay,
    rangeEndDayExclusive,
    rows,
    bars,
    headers,
    gridlines,
    todayMarkerX,
    contentWidth: (rangeEndDayExclusive - rangeStartDay) * config.unitWidth,
    contentHeight: rows.length * config.rowHeight,
    issues,
    hasScheduledItem: true,
  };
}

function buildChildrenMap(items: readonly TimelineItem[]): Map<string | undefined, TimelineItem[]> {
  const map = new Map<string | undefined, TimelineItem[]>();
  for (const item of items) {
    const list = map.get(item.parentId) ?? [];
    list.push(item);
    map.set(item.parentId, list);
  }
  return map;
}

function flattenRows(
  items: readonly TimelineItem[],
  childrenByParent: Map<string | undefined, TimelineItem[]>,
  schedules: ReadonlyMap<string, ScheduledItem>
): TimelineRow[] {
  const roots = items.filter((item) => item.kind === 'project' && item.parentId === undefined);
  const rows: TimelineRow[] = [];
  const visited = new Set<string>();

  const visit = (item: TimelineItem, depth: number): void => {
    if (visited.has(item.id)) {
      return;
    }
    visited.add(item.id);
    rows.push({
      itemId: item.id,
      kind: item.kind,
      depth,
      label: item.label,
      status: item.status,
      hasBar: schedules.has(item.id),
    });
    for (const child of childrenByParent.get(item.id) ?? []) {
      visit(child, depth + 1);
    }
  };

  for (const root of roots) {
    visit(root, 0);
  }
  // Orphan safety net: items without a valid project ancestor still get a row.
  for (const item of items) {
    if (!visited.has(item.id)) {
      visit(item, 0);
    }
  }
  return rows;
}

function deriveProjectInterval(
  project: TimelineItem,
  childrenByParent: Map<string | undefined, TimelineItem[]>,
  schedules: ReadonlyMap<string, ScheduledItem>
): DateInterval | null {
  const descendants: TimelineItem[] = [];
  const collect = (parentId: string): void => {
    for (const child of childrenByParent.get(parentId) ?? []) {
      descendants.push(child);
      collect(child.id);
    }
  };
  collect(project.id);

  let startDay = Number.POSITIVE_INFINITY;
  let endDayExclusive = Number.NEGATIVE_INFINITY;
  let any = false;
  for (const descendant of descendants) {
    const schedule = schedules.get(descendant.id);
    if (schedule) {
      startDay = Math.min(startDay, schedule.interval.startDay);
      endDayExclusive = Math.max(endDayExclusive, schedule.interval.endDayExclusive);
      any = true;
    }
  }
  return any ? { startDay, endDayExclusive } : null;
}

function groupLabelOf(itemId: string, itemById: ReadonlyMap<string, TimelineItem>): string {
  let current = itemById.get(itemId);
  while (current) {
    if (current.kind === 'project') {
      return current.label;
    }
    if (!current.parentId) {
      return '';
    }
    current = itemById.get(current.parentId);
  }
  return '';
}

function issueForSchedule(item: TimelineItem, reason: 'missing' | 'malformed' | 'reversed'): TimelineIssue {
  switch (reason) {
    case 'missing':
      return {
        code: 'missing-date',
        itemId: item.id,
        message: `"${item.label}" precisa de uma data de início e de fim.`,
        severity: 'error',
      };
    case 'malformed':
      return {
        code: 'invalid-date',
        itemId: item.id,
        message: `"${item.label}" possui uma data inválida.`,
        severity: 'error',
      };
    case 'reversed':
      return {
        code: 'reversed-date',
        itemId: item.id,
        message: `"${item.label}" termina antes de começar.`,
        severity: 'error',
      };
  }
}

function buildHeaders(
  rangeStartDay: number,
  rangeEndDayExclusive: number,
  unitWidth: number
): TimelineHeaderUnit[] {
  const headers: TimelineHeaderUnit[] = [];

  // Month segments.
  let cursor = rangeStartDay;
  while (cursor < rangeEndDayExclusive) {
    const monthStart = monthStartDay(cursor);
    const nextMonthStart = monthStartDay(monthStart + 32);
    const monthEnd = Math.min(nextMonthStart, rangeEndDayExclusive);
    headers.push({
      kind: 'month',
      label: monthLabel(cursor),
      x: xFor(cursor, rangeStartDay, unitWidth),
      width: (monthEnd - cursor) * unitWidth,
    });
    cursor = monthEnd;
  }

  // Day cells.
  for (let day = rangeStartDay; day < rangeEndDayExclusive; day++) {
    headers.push({
      kind: 'day',
      label: String(new Date(day * 86_400_000).getUTCDate()),
      x: xFor(day, rangeStartDay, unitWidth),
      width: unitWidth,
    });
  }

  return headers;
}

function buildGridlines(
  rangeStartDay: number,
  rangeEndDayExclusive: number,
  unitWidth: number
): TimelineGridline[] {
  const gridlines: TimelineGridline[] = [];

  let cursor = rangeStartDay;
  while (cursor <= rangeEndDayExclusive) {
    const isMonthBoundary = cursor === monthStartDay(cursor) || cursor === rangeEndDayExclusive;
    gridlines.push({
      kind: isMonthBoundary ? 'month' : 'day',
      x: xFor(cursor, rangeStartDay, unitWidth),
    });
    cursor++;
  }

  return gridlines;
}

function monthStartDay(day: number): number {
  const date = new Date(day * 86_400_000);
  return parseIsoDay(`${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-01`) as number;
}

function monthLabel(day: number): string {
  const date = new Date(day * 86_400_000);
  return `${MONTH_LABELS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

// Re-export for the renderer's accessible-name formatting.
export { formatDay };
