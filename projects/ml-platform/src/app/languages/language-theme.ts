import { Injectable, computed, signal } from '@angular/core';

/**
 * Dark/light preference for the languages section.
 *
 * The rest of VisuaLab keeps its dark identity; this is a reading surface, and a
 * reader may want warm paper at 22:00. The choice is therefore **scoped to the
 * section** (one class on the page host, no global stylesheet change) and lives
 * in `localStorage` under a section-specific key, so moving between the hub and
 * a reading keeps the theme instead of resetting it per page.
 *
 * First visit: the platform preference decides. After the first toggle the
 * explicit choice wins and survives reloads.
 */

export type LanguageThemeMode = 'dark' | 'light';

export const LANGUAGE_THEME_STORAGE_KEY = 'visualab:languages-theme';

function isMode(value: unknown): value is LanguageThemeMode {
  return value === 'dark' || value === 'light';
}

/**
 * The theme the browser asks for. Dark is the platform default, so an absent or
 * unreadable signal means dark rather than an arbitrary light page.
 */
export function preferredLanguageTheme(): LanguageThemeMode {
  try {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-color-scheme: light)').matches
    ) {
      return 'light';
    }
  } catch {
    // `matchMedia` can be absent in exotic test hosts; the platform default is fine.
  }

  return 'dark';
}

/** The stored choice, or the platform preference when there is none. */
export function readLanguageTheme(): LanguageThemeMode {
  try {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(LANGUAGE_THEME_STORAGE_KEY);
      if (isMode(stored)) {
        return stored;
      }
    }
  } catch {
    // Storage blocked (private mode, quota): the page still reads, just forgets.
  }

  return preferredLanguageTheme();
}

/** Persist the chooser's choice; a blocked storage is not an error to the reader. */
export function saveLanguageTheme(mode: LanguageThemeMode): void {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(LANGUAGE_THEME_STORAGE_KEY, mode);
    }
  } catch {
    // Same trade-off as above: the current page keeps the theme, the next visit forgets.
  }
}

/**
 * The class the stylesheet in `src/styles.scss` keys the light chrome on
 * (`html.lang-theme-light`). Component styles cannot reach `<body>` or the site
 * nav, so the page host class alone would leave a dark frame around a light page.
 */
export const LANGUAGE_THEME_DOCUMENT_CLASS = 'lang-theme-light';

@Injectable({ providedIn: 'root' })
export class LanguageTheme {
  private readonly modeState = signal<LanguageThemeMode>(readLanguageTheme());

  readonly mode = this.modeState.asReadonly();

  readonly light = computed(() => this.modeState() === 'light');

  /**
   * How many languages pages are mounted right now. The class leaves `<html>`
   * only when the last one unmounts, so hub→reader navigation (where the new
   * page is created before the old one is destroyed) cannot flicker the theme.
   */
  private mountedPages = 0;

  /** Called by a languages page when it mounts. */
  enterPage(): void {
    this.mountedPages += 1;
    this.applyDocumentClass();
  }

  /** Called when a languages page is destroyed. */
  leavePage(): void {
    this.mountedPages = Math.max(0, this.mountedPages - 1);
    this.applyDocumentClass();
  }

  toggle(): void {
    const next: LanguageThemeMode = this.light() ? 'dark' : 'light';
    this.modeState.set(next);
    saveLanguageTheme(next);
    this.applyDocumentClass();
  }

  private applyDocumentClass(): void {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.classList.toggle(
      LANGUAGE_THEME_DOCUMENT_CLASS,
      this.mountedPages > 0 && this.light(),
    );
  }
}
