import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
} from '@angular/core';
import { render } from 'katex';

/**
 * Renders a single LaTeX expression into its host element using KaTeX.
 *
 * KaTeX's stylesheet and web fonts must be loaded **globally**, not as component
 * styles: `katex.render` builds its DOM imperatively, so the generated elements
 * never receive Angular's emulated-encapsulation `_ngcontent` attribute and a
 * scoped stylesheet would not match them (and KaTeX's ~25 kB stylesheet also
 * exceeds the per-component style budget). Each app therefore registers
 * `node_modules/katex/dist/katex.min.css` in its `angular.json` `styles` array;
 * see `libs/shared-katex/README.md`.
 */
@Component({
  selector: 'app-katex',
  standalone: true,
  template: '',
})
export class KatexComponent implements AfterViewInit, OnChanges {
  @Input() latex = '';
  @Input() displayMode = false;

  private rendered = false;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.rendered = true;
    this.renderMath();
  }

  ngOnChanges(): void {
    if (this.rendered) {
      this.renderMath();
    }
  }

  private renderMath(): void {
    const host = this.el.nativeElement;
    host.replaceChildren();

    try {
      render(this.latex, host, {
        throwOnError: false,
        displayMode: this.displayMode,
      });
    } catch (err) {
      console.error('KaTeX render failed:', err);
      host.textContent = this.latex;
    }
  }
}
