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
 * KaTeX CSS/fonts are loaded globally (see styles.scss).
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
