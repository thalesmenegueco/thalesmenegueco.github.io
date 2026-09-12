import { Injectable } from '@angular/core';

const STORAGE_KEY = 'calculus-completed-lessons';

@Injectable({ providedIn: 'root' })
export class CalculusProgressService {
  load(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
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

  save(ids: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // Storage may be unavailable (private mode); progress is best-effort.
    }
  }
}
