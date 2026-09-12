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
import { ProcessVisualType } from './process.types';
import { drawProcessVisual } from './process-visualizations';

/**
 * Responsive canvas that renders the current stage's visualization and
 * redraws when the stage or any live control parameter changes.
 */
@Component({
  selector: 'app-process-visualization',
  standalone: true,
  template: '<canvas #canvas aria-hidden="true"></canvas>',
  styleUrl: './process-visualization.component.scss',
})
export class ProcessVisualizationComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input() visual!: ProcessVisualType;
  @Input() time = 3;
  @Input() h = 1;
  @Input() approachDistance = 0.7;

  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.redraw();
    this.resizeObserver = new ResizeObserver(() => this.redraw());
    const parent = this.canvas.nativeElement.parentElement;
    if (parent) {
      this.resizeObserver.observe(parent);
    }
  }

  ngOnChanges(_changes: SimpleChanges): void {
    this.redraw();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  redraw(): void {
    const canvas = this.canvas?.nativeElement;
    if (!canvas) {
      return;
    }
    const parent = canvas.parentElement;
    if (!parent) {
      return;
    }

    const rect = parent.getBoundingClientRect();
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
    drawProcessVisual(ctx, size, this.visual, {
      time: this.time,
      h: this.h,
      approachDistance: this.approachDistance,
    });
  }
}
