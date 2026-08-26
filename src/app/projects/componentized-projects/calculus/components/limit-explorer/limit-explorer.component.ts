import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { PlotCanvasComponent } from '../plot-canvas/plot-canvas.component';
import { drawGrid, drawCurve, drawPoint, PlotSize } from '../../plotting';
import { PALETTE } from '../../calculus.palette';
import { formatNumber } from '../../calculus.format';

@Component({
  selector: 'app-limit-explorer',
  standalone: true,
  imports: [PlotCanvasComponent],
  templateUrl: './limit-explorer.component.html',
  styleUrl: './limit-explorer.component.scss',
})
export class LimitExplorerComponent implements OnInit {
  @ViewChild(PlotCanvasComponent) plot!: PlotCanvasComponent;
  @Output() valueChange = new EventEmitter<number>();

  readonly distance = signal(0.8);
  readonly formatNumber = formatNumber;

  readonly rows = computed(() => {
    const d = this.distance();
    const leftX = 2 - d;
    const rightX = 2 + d;
    return [
      { t: leftX, s: leftX * leftX, direction: 'pela esquerda' },
      { t: rightX, s: rightX * rightX, direction: 'pela direita' },
    ];
  });

  readonly drawFn = (ctx: CanvasRenderingContext2D, size: PlotSize) =>
    this.draw(ctx, size);

  ngOnInit(): void {
    this.valueChange.emit(this.distance());
  }

  onDistance(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.distance.set(value);
    this.valueChange.emit(value);
    this.plot?.redraw();
  }

  private draw(ctx: CanvasRenderingContext2D, size: PlotSize): void {
    const bounds = { xMin: 0.4, xMax: 3.6, yMin: 0, yMax: 8 };
    const axis = drawGrid(ctx, size, bounds);
    const fn = (x: number) => x * x;

    drawCurve(ctx, size, axis, bounds, fn, PALETTE.studySky, 3);

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = PALETTE.accentWarm;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(axis.xToPixel(2), 0);
    ctx.lineTo(axis.xToPixel(2), size.height);
    ctx.stroke();
    ctx.setLineDash([]);

    const d = this.distance();
    const leftX = 2 - d;
    const rightX = 2 + d;

    drawPoint(ctx, axis.xToPixel(leftX), axis.yToPixel(fn(leftX)), PALETTE.studyTeal);
    drawPoint(
      ctx,
      axis.xToPixel(rightX),
      axis.yToPixel(fn(rightX)),
      PALETTE.accentSecondary,
    );
    drawPoint(ctx, axis.xToPixel(2), axis.yToPixel(fn(2)), PALETTE.accentWarm);
  }
}
