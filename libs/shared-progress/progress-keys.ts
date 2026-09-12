/**
 * Canonical `localStorage` keys for learning progress.
 *
 * These strings are **persisted user data**: changing one silently orphans
 * every student's saved progress for that module. They are byte-identical to
 * the keys the three original per-feature services used.
 */
export const PROGRESS_KEYS = {
  calculus: 'calculus-completed-lessons',
  calculusPractice: 'calculus-practice-completed',
  calculusProcess: 'calculus-process-completed',
} as const;

export type ProgressKey = (typeof PROGRESS_KEYS)[keyof typeof PROGRESS_KEYS];
