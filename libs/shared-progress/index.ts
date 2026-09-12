/**
 * `@shared/progress` — persistence for learning-module progress.
 *
 * One keyed store serves every learning module in both apps. Consumers read the
 * key they need from `PROGRESS_KEYS` so the persisted key strings stay in one
 * place.
 */
export { ProgressStore } from './progress-store';
export { PROGRESS_KEYS, type ProgressKey } from './progress-keys';
