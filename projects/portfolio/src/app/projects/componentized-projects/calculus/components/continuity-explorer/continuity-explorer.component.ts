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
import { drawGrid, drawPoint, PlotSize } from '../../plotting';
import { PALETTE } from '../../calculus.palette';

type ContinuityMode = 'continuous' | 'hole';

@Component({
  selector: 'app-continuity-explorer',
  standalone: true,
  imports: [PlotCanvasComponent],
  templateUrl: './continuity-explorer.component.html',
  styleUrl: './continuity-explorer.component.scss',
})
export class ContinuityExplorerComponent implements OnInit {
  @ViewChild(PlotCanvasComponent) plot!: PlotCanvasComponent;
  @Output() valueChange = new EventEmitter<ContinuityMode>();

  readonly mode = signal<ContinuityMode>('continuous');

  readonly metrics = computed(() => ({
    f2: this.mode() === 'continuous' ? '2' : 'não definido',
    limit: '2',
    continuous: this.mode() === 'continuous' ? 'sim' : 'não',
  }));

  readonly drawFn = (ctx: CanvasRenderingContext2D, size: PlotSize) =>
    this.draw(ctx, size);

  ngOnInit(): void {
    this.valueChange.emit(this.mode());
  }

  onMode(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as ContinuityMode;
    this.mode.set(value);
    this.valueChange.emit(value);
    this.plot?.redraw();
  }

  private draw(ctx: CanvasRenderingContext2D, size: PlotSize): void {
    const mode = this.mode();
    const bounds = { xMin: -1, xMax: 5, yMin: -1, yMax: 8 };
    const axis = drawGrid(ctx, size, bounds);
    const fn = (x: number) => (x * x) / 2;

    ctx.strokeStyle = PALETTE.studySky;
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i <= size.width; i++) {
      const x = bounds.xMin + (i / size.width) * (bounds.xMax - bounds.xMin);
      const y = fn(x);
      const px = axis.xToPixel(x);
      const py = axis.yToPixel(y);

      if (mode === 'hole' && Math.abs(x - 2) < 0.025) {
        continue;
      }

      if (i === 0 || (mode === 'hole' && Math.abs(x - 2) < 0.025)) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.stroke();

    const xPoint = axis.xToPixel(2);
    const yPoint = axis.yToPixel(2);

    drawPoint(
      ctx,
      xPoint,
      yPoint,
      mode === 'continuous' ? PALETTE.accentWarm : PALETTE.bg,
      7,
    );

    if (mode === 'hole') {
      ctx.strokeStyle = PALETTE.accentWarm;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(xPoint, yPoint, 7, 0, Math.PI * 2);
      ctx.stroke();
    }
  }
}
