import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PlotSize } from '../calculus/plotting';
import { VisualizationType } from './calculus-practice.types';
import { VISUALIZATION_CAPTIONS, drawVisualization } from './visualizations';

/**
 * Renders the canvas visualization for a single applied problem, plus its
 * caption. Redraws on problem change and on resize.
 */
@Component({
  selector: 'app-problem-visualization',
  standalone: true,
  template: `
    <div class="visualization-wrap" #wrap>
      <canvas #canvas aria-hidden="true"></canvas>
      <div class="visualization-caption">{{ caption }}</div>
    </div>
  `,
  styleUrl: './problem-visualization.component.scss',
})
export class ProblemVisualizationComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() visualization!: VisualizationType;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wrap', { static: true }) wrap!: ElementRef<HTMLDivElement>;

  private resizeObserver?: ResizeObserver;

  get caption(): string {
    return (
      VISUALIZATION_CAPTIONS[this.visualization] ??
      'Visualização do modelo matemático.'
    );
  }

  ngAfterViewInit(): void {
    this.redraw();
    this.resizeObserver = new ResizeObserver(() => this.redraw());
    this.resizeObserver.observe(this.wrap.nativeElement);
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.redraw();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  redraw(): void {
    const canvas = this.canvas?.nativeElement;
    const wrap = this.wrap?.nativeElement;
    if (!canvas || !wrap) {
      return;
    }

    const rect = wrap.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width * ratio));
    const height = Math.max(1, Math.floor(rect.height * ratio));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const size: PlotSize = { width: rect.width, height: rect.height };
    drawVisualization(ctx, size, this.visualization);
  }
}
