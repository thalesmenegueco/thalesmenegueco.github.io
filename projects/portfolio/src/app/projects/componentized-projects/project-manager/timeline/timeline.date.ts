/**
 * Pure date engine. No Angular, DOM, or framework imports.
 *
 * Internal representation: a "day index" is an integer number of days since the
 * Unix epoch, computed in UTC to remain timezone-stable. Intervals are
 * half-open: `[startDay, endDayExclusive)`.
 */

export interface DateInterval {
  /** Inclusive first day index. */
  readonly startDay: number;
  /** Exclusive day index (one past the last active day). */
  readonly endDayExclusive: number;
}

export type ScheduleResult =
  | { readonly kind: 'unscheduled' }
  | { readonly kind: 'scheduled'; readonly interval: DateInterval; readonly milestone: boolean }
  | { readonly kind: 'invalid'; readonly reason: 'missing' | 'malformed' | 'reversed' };

const DAY_MS = 86_400_000;

/** Parse a `YYYY-MM-DD` string into a UTC day index, or null when invalid. */
export function parseIsoDay(date: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) {
    return null;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }
  const utc = new Date(Date.UTC(year, month - 1, day));
  const roundTrips =
    utc.getUTCFullYear() === year &&
    utc.getUTCMonth() === month - 1 &&
    utc.getUTCDate() === day;
  if (!roundTrips) {
    return null;
  }
  return Math.floor(utc.getTime() / DAY_MS);
}

/** True when `date` is a valid `YYYY-MM-DD` calendar date. */
export function isValidIsoDate(date: string): boolean {
  return parseIsoDay(date) !== null;
}

/** Format a day index back into a `YYYY-MM-DD` string (UTC). */
export function formatDay(day: number): string {
  const utc = new Date(day * DAY_MS);
  const year = utc.getUTCFullYear();
  const month = String(utc.getUTCMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(utc.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${dayOfMonth}`;
}

/** Add a whole number of days to a day index. */
export function addDays(day: number, amount: number): number {
  return day + amount;
}

/**
 * Classify a task/project schedule from inclusive `YYYY-MM-DD` inputs.
 *
 * - Both empty -> unscheduled (not an error).
 * - One empty  -> invalid (missing date).
 * - Malformed  -> invalid (malformed).
 * - End before start -> invalid (reversed).
 * - start === end -> scheduled single-day (milestone) interval.
 */
export function classifySchedule(start: string, end: string): ScheduleResult {
  const hasStart = start !== '';
  const hasEnd = end !== '';
  if (!hasStart && !hasEnd) {
    return { kind: 'unscheduled' };
  }
  if (!hasStart || !hasEnd) {
    return { kind: 'invalid', reason: 'missing' };
  }

  const startDay = parseIsoDay(start);
  const endDay = parseIsoDay(end);
  if (startDay === null || endDay === null) {
    return { kind: 'invalid', reason: 'malformed' };
  }
  if (endDay < startDay) {
    return { kind: 'invalid', reason: 'reversed' };
  }
  return {
    kind: 'scheduled',
    interval: { startDay, endDayExclusive: endDay + 1 },
    milestone: startDay === endDay,
  };
}

/** Number of whole days covered by a half-open interval. */
export function intervalDays(interval: DateInterval): number {
  return interval.endDayExclusive - interval.startDay;
}

/** Today as a UTC day index (used only for the "today" marker). */
export function todayDayIndex(): number {
  const now = new Date();
  return Math.floor(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / DAY_MS
  );
}
