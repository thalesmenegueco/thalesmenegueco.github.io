import { Injectable } from '@angular/core';

/**
 * Key/value progress store backed by `localStorage`.
 *
 * This replaces three byte-identical per-feature services
 * (`CalculusProgressService`, `CalculusPracticeProgressService`,
 * `ProcessProgressService`) that differed only in their hardcoded storage key.
 * The key is now supplied by the caller, so any number of learning modules can
 * share one store without duplicating the persistence and guard logic.
 */
@Injectable({ providedIn: 'root' })
export class ProgressStore {
  /**
   * Reads the completed-id list stored under `key`.
   *
   * Returns an empty list when the key is absent, when the stored value is not
   * JSON, when it is not an array, or when storage is unavailable. Non-string
   * entries are dropped rather than surfaced.
   */
  load(key: string): string[] {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return [];
      }
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === 'string')
        : [];
    } catch {
      return [];
    }
  }

  save(key: string, ids: string[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(ids));
    } catch {
      // Storage may be unavailable (private mode); progress is best-effort.
    }
  }
}
