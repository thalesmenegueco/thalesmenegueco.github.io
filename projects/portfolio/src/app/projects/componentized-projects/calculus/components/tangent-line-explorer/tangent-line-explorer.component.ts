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
  selector: 'app-tangent-line-explorer',
  standalone: true,
  imports: [PlotCanvasComponent],
  templateUrl: './tangent-line-explorer.component.html',
  styleUrl: './tangent-line-explorer.component.scss',
})
export class TangentLineExplorerComponent implements OnInit {
  @ViewChild(PlotCanvasComponent) plot!: PlotCanvasComponent;
  @Output() valueChange = new EventEmitter<number>();

  readonly h = signal(1);
  readonly a = 2;
  readonly fn = (x: number) => x * x;
  readonly formatNumber = formatNumber;

  readonly metrics = computed(() => {
    const h = this.h();
    const b = this.a + h;
    const secantSlope = (this.fn(b) - this.fn(this.a)) / h;
    const tangentSlope = 2 * this.a;
    return { secantSlope, tangentSlope, h };
  });

  readonly drawFn = (ctx: CanvasRenderingContext2D, size: PlotSize) =>
    this.draw(ctx, size);

  ngOnInit(): void {
    this.valueChange.emit(this.h());
  }

  onH(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.h.set(value);
    this.valueChange.emit(value);
    this.plot?.redraw();
  }

  private draw(ctx: CanvasRenderingContext2D, size: PlotSize): void {
    const h = this.h();
    const a = this.a;
    const b = a + h;
    const bounds = { xMin: 0, xMax: 4.2, yMin: 0, yMax: 18 };
    const axis = drawGrid(ctx, size, bounds);

    drawCurve(ctx, size, axis, bounds, this.fn, PALETTE.studySky, 3);

    const yA = this.fn(a);
    const yB = this.fn(b);
    const secantSlope = (yB - yA) / h;
    const tangentSlope = 2 * a;

    const secantFn = (x: number) => yA + secantSlope * (x - a);
    const tangentFn = (x: number) => yA + tangentSlope * (x - a);

    drawCurve(ctx, size, axis, bounds, secantFn, PALETTE.accentSecondary, 2);
    drawCurve(ctx, size, axis, bounds, tangentFn, PALETTE.accentWarm, 2);

    drawPoint(ctx, axis.xToPixel(a), axis.yToPixel(yA), PALETTE.studyTeal);
    drawPoint(ctx, axis.xToPixel(b), axis.yToPixel(yB), PALETTE.accentSecondary);
  }
}
