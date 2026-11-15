import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  afterNextRender,
  effect,
  inject,
  input,
} from '@angular/core';

/**
 * One-shot scroll reveal: the host starts faded and lifted, and gets
 * `.is-revealed` the first time it enters the viewport, then stops being
 * observed.
 *
 * The visual states live in `styles.scss` under `[appReveal]`, not here, so
 * the same behaviour works for any element without extra CSS, and the
 * `prefers-reduced-motion` rule there disables it wholesale.
 *
 * `appRevealDelay` staggers siblings (cards arriving 60ms apart) by setting
 * the `--reveal-delay` custom property; the global transition consumes it.
 */
@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);
  private observer: IntersectionObserver | null = null;

  /** Milliseconds to wait after the element enters the viewport. */
  readonly delay = input(0, { alias: 'appRevealDelay' });

  constructor() {
    effect(() => {
      this.el.nativeElement.style.setProperty(
        '--reveal-delay',
        `${this.delay()}ms`,
      );
    });

    // `afterNextRender` rather than `ngOnInit`: observing needs the element to
    // be laid out, and in tests this keeps the observer out of the first
    // change-detection pass on a detached fixture.
    afterNextRender(() => this.observe());
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
  }

  private observe(): void {
    const node = this.el.nativeElement;

    if (typeof IntersectionObserver === 'undefined') {
      node.classList.add('is-revealed');
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.classList.add('is-revealed');
          this.observer?.unobserve(target);
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.15 },
    );

    this.observer.observe(node);
  }
}
