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
  selector: 'app-derivative-function-explorer',
  standalone: true,
  imports: [PlotCanvasComponent],
  templateUrl: './derivative-function-explorer.component.html',
  styleUrl: './derivative-function-explorer.component.scss',
})
export class DerivativeFunctionExplorerComponent implements OnInit {
  @ViewChild(PlotCanvasComponent) plot!: PlotCanvasComponent;
  @Output() valueChange = new EventEmitter<number>();

  readonly x = signal(2);
  readonly formatNumber = formatNumber;

  readonly metrics = computed(() => {
    const x = this.x();
    const position = x * x;
    const velocity = 2 * x;
    const sign = velocity > 0 ? 'positivo' : 'zero';
    return { position, velocity, sign };
  });

  readonly drawFn = (ctx: CanvasRenderingContext2D, size: PlotSize) =>
    this.draw(ctx, size);

  ngOnInit(): void {
    this.valueChange.emit(this.x());
  }

  onX(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.x.set(value);
    this.valueChange.emit(value);
    this.plot?.redraw();
  }

  private draw(ctx: CanvasRenderingContext2D, size: PlotSize): void {
    const x = this.x();
    const bounds = { xMin: 0, xMax: 4, yMin: 0, yMax: 18 };
    const axis = drawGrid(ctx, size, bounds);

    drawCurve(ctx, size, axis, bounds, (v) => v * v, PALETTE.studySky, 3);
    drawCurve(ctx, size, axis, bounds, (v) => 2 * v, PALETTE.studyTeal, 3);

    drawPoint(ctx, axis.xToPixel(x), axis.yToPixel(x * x), PALETTE.accentWarm);
    drawPoint(ctx, axis.xToPixel(x), axis.yToPixel(2 * x), PALETTE.accentSecondary);
  }
}
