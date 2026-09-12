import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { PlotSize } from '../plotting';
import { DEFAULT_PLOT_THEME, PlotTheme } from '../plot-theme';

/**
 * A single responsive `<canvas>` that handles device-pixel-ratio scaling and
 * redraws when its container resizes. The parent supplies `drawFn`, which
 * receives a 2D context and the CSS-pixel size.
 *
 * The frame's colours come from the `theme` input rather than hardcoded values,
 * so a host app with its own identity can restyle the widget without forking
 * it. `theme` is published to the frame as the `--plot-border-color` and
 * `--plot-bg` custom properties; the stylesheet consumes them with fallbacks
 * equal to `DEFAULT_PLOT_THEME`, so an unthemed use renders identically.
 */
@Component({
  selector: 'app-plot-canvas',
  standalone: true,
  template: `
    <div class="plot-wrap" #wrap>
      <canvas #canvas></canvas>
    </div>
  `,
  styleUrl: './plot-canvas.component.scss',
  host: {
    '[style.--plot-border-color]': 'theme.plotBorder',
    '[style.--plot-bg]': 'theme.plotBg',
  },
})
export class PlotCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wrap', { static: true }) wrap!: ElementRef<HTMLDivElement>;

  @Input() drawFn: (
    ctx: CanvasRenderingContext2D,
    size: PlotSize,
  ) => void = () => {};

  /**
   * Palette used for the plot frame. Setting it re-renders the frame so a
   * runtime theme switch does not leave a stale canvas behind.
   */
  @Input()
  set theme(value: PlotTheme | undefined) {
    this.currentTheme = value ?? DEFAULT_PLOT_THEME;
    if (this.viewReady) {
      this.redraw();
    }
  }

  get theme(): PlotTheme {
    return this.currentTheme;
  }

  private currentTheme: PlotTheme = DEFAULT_PLOT_THEME;
  private resizeObserver?: ResizeObserver;
  private viewReady = false;

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.redraw();
    this.resizeObserver = new ResizeObserver(() => this.redraw());
    this.resizeObserver.observe(this.wrap.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  redraw(): void {
    const canvas = this.canvas.nativeElement;
    const wrap = this.wrap.nativeElement;
    const rect = wrap.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width * ratio));
    const height = Math.max(1, Math.floor(rect.height * ratio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.drawFn(ctx, { width: rect.width, height: rect.height });
  }
}
