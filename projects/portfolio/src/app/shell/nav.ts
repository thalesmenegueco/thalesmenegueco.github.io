import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  signal,
  viewChild,
  afterNextRender,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollSpy } from '../core/scroll-spy.service';
import { NAV_LINKS } from '../data/portfolio-content';
import { IconComponent } from '../ui/icon';

/**
 * The sticky shell nav: brand, section anchors, a way into the lab, and the
 * scroll-progress hairline.
 *
 * It lives in the shell rather than inside the one-page component because
 * `/tools` and `/estudos` need the same bar — so the anchor links target
 * `/#section` and work from any route (the router's anchor scrolling handles
 * the jump after navigation).
 *
 * The active-section underline reads `ScrollSpy`, which the one-page component
 * starts; on every other route the spy is stopped and no link is marked, which
 * is correct: there is no section being read.
 */
@Component({
  selector: 'app-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './nav.html',
  styleUrl: './nav.scss',
})
export class NavComponent {
  private readonly doc = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly sheet = viewChild<ElementRef<HTMLElement>>('sheet');
  private readonly toggleButton = viewChild<ElementRef<HTMLButtonElement>>('menuToggle');

  readonly spy = inject(ScrollSpy);
  readonly links = NAV_LINKS;
  readonly open = signal(false);
  readonly scrolled = signal(false);
  readonly progress = signal(0);

  /** Tracks scroll state and the read progress for the hairline. */
  private readonly onScroll = (): void => {
    const scrolling = this.doc.scrollingElement ?? this.doc.documentElement;
    const max = scrolling.scrollHeight - scrolling.clientHeight;
    this.progress.set(max > 0 ? Math.min(1, scrolling.scrollTop / max) : 0);
    this.scrolled.set(scrolling.scrollTop > 8);
  };

  constructor() {
    afterNextRender(() => {
      const view = this.doc.defaultView;
      if (!view) return;

      // The first read matters on a deep link (/#projetos): the nav must
      // already be in its "scrolled" state before the user touches anything.
      this.onScroll();
      view.addEventListener('scroll', this.onScroll, { passive: true });
      this.destroyRef.onDestroy(() => {
        view.removeEventListener('scroll', this.onScroll);
        this.unlockBody();
      });
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.setOpen(false);
  }

  toggle(): void {
    this.setOpen(!this.open());
  }

  close(): void {
    if (this.open()) this.setOpen(false);
  }

  /** Brand click: go home, and to the top when already home. */
  toTop(): void {
    this.doc.defaultView?.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private setOpen(next: boolean): void {
    this.open.set(next);

    if (next) {
      this.lockBody();
      // Focus moves into the sheet once it is painted, so a keyboard user
      // lands on the first link instead of behind the overlay.
      setTimeout(() => {
        this.sheet()
          ?.nativeElement.querySelector<HTMLElement>('a')
          ?.focus();
      });
    } else {
      this.unlockBody();
      this.toggleButton()?.nativeElement.focus();
    }
  }

  private lockBody(): void {
    this.doc.body.style.overflow = 'hidden';
  }

  private unlockBody(): void {
    this.doc.body.style.overflow = '';
  }
}
