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
  selector: 'app-average-slope-explorer',
  standalone: true,
  imports: [PlotCanvasComponent],
  templateUrl: './average-slope-explorer.component.html',
  styleUrl: './average-slope-explorer.component.scss',
})
export class AverageSlopeExplorerComponent implements OnInit {
  @ViewChild(PlotCanvasComponent) plot!: PlotCanvasComponent;
  @Output() valueChange = new EventEmitter<number>();

  readonly b = signal(4);
  readonly a = 3;
  readonly fn = (x: number) => x * x;
  readonly formatNumber = formatNumber;

  readonly metrics = computed(() => {
    const b = this.b();
    const yA = this.fn(this.a);
    const yB = this.fn(b);
    const slope = (yB - yA) / (b - this.a);
    return { yA, yB, slope };
  });

  readonly drawFn = (ctx: CanvasRenderingContext2D, size: PlotSize) =>
    this.draw(ctx, size);

  ngOnInit(): void {
    this.valueChange.emit(this.b());
  }

  onB(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    this.b.set(value);
    this.valueChange.emit(value);
    this.plot?.redraw();
  }

  private draw(ctx: CanvasRenderingContext2D, size: PlotSize): void {
    const b = this.b();
    const bounds = { xMin: 1, xMax: 5.5, yMin: 0, yMax: 32 };
    const axis = drawGrid(ctx, size, bounds);

    drawCurve(ctx, size, axis, bounds, this.fn, PALETTE.studySky, 3);

    const yA = this.fn(this.a);
    const yB = this.fn(b);

    ctx.strokeStyle = PALETTE.accentWarm;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(axis.xToPixel(this.a), axis.yToPixel(yA));
    ctx.lineTo(axis.xToPixel(b), axis.yToPixel(yB));
    ctx.stroke();

    drawPoint(ctx, axis.xToPixel(this.a), axis.yToPixel(yA), PALETTE.studyTeal);
    drawPoint(ctx, axis.xToPixel(b), axis.yToPixel(yB), PALETTE.accentSecondary);
  }
}
