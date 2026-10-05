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
  /**
   * Curso 1's theory module — the first ML module with generated content. Unlike the
   * three above it has no prior key to stay compatible with, so it is named for what it
   * is. Adding a key is safe; renaming one is not.
   */
  mlFundamentos: 'ml-fundamentos-teoria-completed',
} as const;

export type ProgressKey = (typeof PROGRESS_KEYS)[keyof typeof PROGRESS_KEYS];
