import { buildLayout } from './timeline.layout';
import { DEFAULT_TIMELINE_CONFIG, TimelineItem } from './timeline.types';
import { TIMELINE_FIXTURE } from './timeline.fixture';
import { parseIsoDay } from './timeline.date';

const task = (
  id: string,
  parentId: string,
  start: string,
  end: string
): TimelineItem => ({
  id,
  kind: 'task',
  parentId,
  label: id,
  start,
  end,
  dependencies: [],
});

const project = (id: string, label: string): TimelineItem => ({
  id,
  kind: 'project',
  label,
  start: '',
  end: '',
  dependencies: [],
});

describe('timeline.layout', () => {
  it('should be deterministic for the same input', () => {
    const a = buildLayout(TIMELINE_FIXTURE, DEFAULT_TIMELINE_CONFIG);
    const b = buildLayout(TIMELINE_FIXTURE, DEFAULT_TIMELINE_CONFIG);
    expect(a).toEqual(b);
  });

  it('should flatten the hierarchy in pre-order', () => {
    const layout = buildLayout(TIMELINE_FIXTURE, DEFAULT_TIMELINE_CONFIG);
    expect(layout.rows.map(r => r.itemId)).toEqual(['p1', 't1', 't2', 't3', 'p2', 't4']);
    expect(layout.rows.map(r => r.depth)).toEqual([0, 1, 1, 2, 0, 1]);
  });

  it('should compute range with padding and finite coordinates', () => {
    const layout = buildLayout(TIMELINE_FIXTURE, DEFAULT_TIMELINE_CONFIG);
    expect(Number.isFinite(layout.contentWidth)).toBeTrue();
    expect(layout.contentWidth).toBeGreaterThan(0);
    for (const bar of layout.bars) {
      expect(Number.isFinite(bar.x)).toBeTrue();
      expect(Number.isFinite(bar.width)).toBeTrue();
      expect(bar.width).toBeGreaterThan(0);
      expect(Number.isFinite(bar.topInRows)).toBeTrue();
    }
  });

  it('should derive project summary bars from child tasks', () => {
    const layout = buildLayout(TIMELINE_FIXTURE, DEFAULT_TIMELINE_CONFIG);
    const p1 = layout.bars.find(b => b.itemId === 'p1');
    const p2 = layout.bars.find(b => b.itemId === 'p2');
    expect(p1).toBeDefined();
    expect(p1?.derived).toBeTrue();
    expect(p2).toBeDefined();
    expect(p2?.derived).toBeTrue();
  });

  it('should render zero-duration tasks as a minimum-width milestone', () => {
    const layout = buildLayout(TIMELINE_FIXTURE, DEFAULT_TIMELINE_CONFIG);
    const t4 = layout.bars.find(b => b.itemId === 't4');
    expect(t4?.milestone).toBeTrue();
    expect(t4?.width).toBeGreaterThan(0);
  });

  it('should produce day headers and gridlines in the same coordinate space', () => {
    const layout = buildLayout(TIMELINE_FIXTURE, DEFAULT_TIMELINE_CONFIG);
    const dayHeaders = layout.headers.filter(h => h.kind === 'day');
    expect(dayHeaders.length).toBeGreaterThan(0);
    // Every day header width is exactly unitWidth.
    for (const header of dayHeaders) {
      expect(header.width).toBe(DEFAULT_TIMELINE_CONFIG.unitWidth);
    }
    // Gridlines cover the full range inclusive of both ends.
    const firstGrid = layout.gridlines[0];
    const lastGrid = layout.gridlines[layout.gridlines.length - 1];
    expect(firstGrid.x).toBe(0);
    expect(lastGrid.x).toBe(layout.contentWidth);
  });

  it('should report invalid dates as issues without breaking the layout', () => {
    const items: TimelineItem[] = [
      project('p1', 'P1'),
      task('t1', 'p1', '2026-02-05', '2026-02-01'), // reversed
      task('t2', 'p1', 'garbage', '2026-02-10'), // malformed
      task('t3', 'p1', '2026-02-01', ''), // missing end
      task('t4', 'p1', '2026-02-01', '2026-02-02'), // valid
    ];
    const layout = buildLayout(items, DEFAULT_TIMELINE_CONFIG);

    const codes = layout.issues.map(i => i.code);
    expect(codes).toContain('reversed-date');
    expect(codes).toContain('invalid-date');
    expect(codes).toContain('missing-date');

    // Only the valid task and the derived project get bars.
    expect(layout.bars.map(b => b.itemId)).toEqual(['p1', 't4']);
  });

  it('should handle unscheduled items without a bar', () => {
    const items: TimelineItem[] = [
      project('p1', 'P1'),
      task('t1', 'p1', '', ''),
    ];
    const layout = buildLayout(items, DEFAULT_TIMELINE_CONFIG);
    expect(layout.hasScheduledItem).toBeFalse();
    expect(layout.bars).toEqual([]);
    expect(layout.rows.length).toBe(2);
  });

  it('should handle a 100-task fixture with finite geometry', () => {
    const items: TimelineItem[] = [project('p1', 'P1')];
    for (let i = 0; i < 100; i++) {
      items.push(task(`t${i}`, 'p1', '2026-01-01', '2026-01-02'));
    }
    const layout = buildLayout(items, DEFAULT_TIMELINE_CONFIG);
    expect(layout.rows.length).toBe(101);
    expect(layout.bars.length).toBe(101);
    for (const bar of layout.bars) {
      expect(Number.isFinite(bar.x)).toBeTrue();
      expect(bar.width).toBeGreaterThan(0);
    }
  });

  it('should mark today only when showToday is enabled and in range', () => {
    const items = [project('p1', 'P1'), task('t1', 'p1', '2026-01-01', '2026-01-02')];
    const today = parseIsoDay('2026-01-01') as number;
    const shown = buildLayout(items, DEFAULT_TIMELINE_CONFIG, today);
    expect(shown.todayMarkerX).not.toBeNull();

    const hidden = buildLayout(items, { ...DEFAULT_TIMELINE_CONFIG, showToday: false }, today);
    expect(hidden.todayMarkerX).toBeNull();
  });
});
