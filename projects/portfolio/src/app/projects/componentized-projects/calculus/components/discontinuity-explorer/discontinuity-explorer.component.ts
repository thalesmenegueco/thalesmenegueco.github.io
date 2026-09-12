import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { PlotCanvasComponent } from '../plot-canvas/plot-canvas.component';
import { drawGrid, PlotSize } from '../../plotting';
import { PALETTE } from '../../calculus.palette';

type DiscontinuityMode = 'jump' | 'asymptote';

@Component({
  selector: 'app-discontinuity-explorer',
  standalone: true,
  imports: [PlotCanvasComponent],
  templateUrl: './discontinuity-explorer.component.html',
  styleUrl: './discontinuity-explorer.component.scss',
})
export class DiscontinuityExplorerComponent implements OnInit {
  @ViewChild(PlotCanvasComponent) plot!: PlotCanvasComponent;
  @Output() valueChange = new EventEmitter<DiscontinuityMode>();

  readonly mode = signal<DiscontinuityMode>('jump');

  readonly drawFn = (ctx: CanvasRenderingContext2D, size: PlotSize) =>
    this.draw(ctx, size);

  ngOnInit(): void {
    this.valueChange.emit(this.mode());
  }

  onMode(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as DiscontinuityMode;
    this.mode.set(value);
    this.valueChange.emit(value);
    this.plot?.redraw();
  }

  private draw(ctx: CanvasRenderingContext2D, size: PlotSize): void {
    const mode = this.mode();
    const bounds = { xMin: -1, xMax: 5, yMin: -5, yMax: 8 };
    const axis = drawGrid(ctx, size, bounds);

    ctx.strokeStyle = PALETTE.studySky;
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i <= size.width; i++) {
      const x = bounds.xMin + (i / size.width) * (bounds.xMax - bounds.xMin);
      let y: number;

      if (mode === 'jump') {
        y = x < 2 ? 2 : 5;
      } else {
        y = 1 / (x - 2);
      }

      if (!Number.isFinite(y)) {
        continue;
      }

      const px = axis.xToPixel(x);
      const py = axis.yToPixel(y);

      if (i === 0 || Math.abs(x - 2) < 0.025) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }

    ctx.stroke();

    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = PALETTE.accentWarm;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(axis.xToPixel(2), 0);
    ctx.lineTo(axis.xToPixel(2), size.height);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
