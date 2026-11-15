import { DOCUMENT } from '@angular/common';
import { Injectable, OnDestroy, inject, signal } from '@angular/core';

/**
 * Tracks which section of the one-page portfolio is crossing the viewport's
 * middle band, and exposes it as `activeId`.
 *
 * The nav renders `aria-current` from this signal, but the service owns no
 * markup — the section ids come from the page that starts it, so the nav and
 * the sections cannot drift apart: both read `NAV_LINKS` in
 * `data/portfolio-content.ts`.
 *
 * Implementation note: the observer uses a zero-thickness band at the middle
 * of the viewport (`-45%` root margin on both edges) instead of thresholds.
 * A section is "active" exactly while it crosses where the eye is reading,
 * which keeps the highlight monotonic while scrolling in either direction —
 * a threshold-based observer flickers between neighbours around section
 * boundaries.
 */
@Injectable({ providedIn: 'root' })
export class ScrollSpy implements OnDestroy {
  private readonly doc = inject(DOCUMENT);
  private observer: IntersectionObserver | null = null;
  private ids: readonly string[] = [];
  private readonly intersecting = new Set<string>();

  /** The section id crossing the middle band, or `null` between sections. */
  readonly activeId = signal<string | null>(null);

  /**
   * Starts observing the given section ids.
   *
   * Safe to call repeatedly (the one-page component calls it once after its
   * sections render); it disconnects the previous observer first.
   */
  start(ids: readonly string[]): void {
    this.stop();
    this.ids = ids;

    // Environments without IntersectionObserver (older browsers, SSR-like
    // test harnesses) fall back to marking the first section active rather
    // than leaving the nav permanently blank.
    if (typeof IntersectionObserver === 'undefined') {
      this.activeId.set(ids[0] ?? null);
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => this.handle(entries),
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    for (const id of ids) {
      const element = this.doc.getElementById(id);
      if (element) {
        this.observer.observe(element);
      }
    }
  }

  /** Disconnects the observer and clears the active section. */
  stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.ids = [];
    this.intersecting.clear();
    this.activeId.set(null);
  }

  ngOnDestroy(): void {
    this.stop();
  }

  private handle(entries: readonly IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        this.intersecting.add(entry.target.id);
      } else {
        this.intersecting.delete(entry.target.id);
      }
    }

    // Page order decides the winner, so a section entering from below never
    // steals the highlight from the one the reader is actually in.
    const next = this.ids.find((id) => this.intersecting.has(id)) ?? null;
    this.activeId.set(next);
  }
}
