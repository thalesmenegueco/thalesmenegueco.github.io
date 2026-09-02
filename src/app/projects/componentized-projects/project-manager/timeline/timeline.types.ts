/**
 * Normalized timeline contract.
 *
 * The timeline is a read-only visualization. It consumes `TimelineItem` objects
 * produced by the adapter from the domain model (Project/Task). The renderer
 * must treat every object in this module as immutable.
 *
 * Date representation: `start` and `end` are `YYYY-MM-DD` strings and are
 * INCLUSIVE (a task that starts and ends on the same day is a single-day
 * milestone). The pure date engine converts them into a half-open interval
 * `[startDay, endDayExclusive)`. An empty string means "not scheduled".
 */

export type TimelineItemKind = 'project' | 'task';

export type TimelineDependencyType = 'finish-to-start';

export interface TimelineDependency {
  readonly predecessorId: string;
  readonly type: TimelineDependencyType;
}

export interface TimelineItem {
  readonly id: string;
  readonly kind: TimelineItemKind;
  /** For a task: the id of its parent task, or of its project group. */
  readonly parentId?: string;
  readonly label: string;
  /** YYYY-MM-DD (inclusive), or '' when unscheduled. */
  readonly start: string;
  /** YYYY-MM-DD (inclusive), or '' when unscheduled. */
  readonly end: string;
  readonly status?: string;
  readonly progress?: number;
  readonly colorToken?: string;
  readonly dependencies: readonly TimelineDependency[];
}

export interface TimelineViewConfig {
  readonly scale: 'day' | 'week' | 'month';
  readonly rowHeight: number;
  readonly barHeight: number;
  readonly unitWidth: number;
  readonly showToday: boolean;
}

export interface TimelineIssue {
  readonly code: string;
  readonly itemId?: string;
  readonly relatedItemId?: string;
  readonly message: string;
  readonly severity: 'warning' | 'error';
}

export const DEFAULT_TIMELINE_CONFIG: TimelineViewConfig = {
  scale: 'day',
  rowHeight: 40,
  barHeight: 22,
  unitWidth: 24,
  showToday: true,
};
