import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

/**
 * A subtle, decorative "math in movement" emblem for the studies hero.
 *
 * A point traces a sine curve while its tangent line slides along with it —
 * the derivative made visible. It loops slowly, pauses when scrolled out of
 * view, and renders a static frame under `prefers-reduced-motion`.
 *
 * Palette values mirror `studies.component.scss` / `calculus.palette.ts`.
 */

const LOOP_SECONDS = 9;
const CYCLES = 1.5;

const PALETTE = {
  axis: 'rgba(151, 166, 161, 0.22)',
  curve: '#4fb3a6',
  tangent: 'rgba(255, 163, 0, 0.55)',
  point: '#ffa300',
} as const;

@Component({
  selector: 'app-hero-motion',
  standalone: true,
  template: `
    <div class="wrap" #wrap>
      <canvas #canvas aria-hidden="true"></canvas>
    </div>
  `,
  styleUrl: './hero-motion.component.scss',
})
export class HeroMotionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wrap', { static: true }) wrap!: ElementRef<HTMLDivElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private rafId: number | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private visibilityObserver: IntersectionObserver | null = null;

  private reducedMotion = false;
  private visible = false;
  private startedAt = 0;
  private time = 0;

  ngAfterViewInit(): void {
    this.reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.ctx = this.canvas.nativeElement.getContext('2d');

    this.resizeObserver = new ResizeObserver(() => this.redraw());
    this.resizeObserver.observe(this.wrap.nativeElement);

    this.visibilityObserver = new IntersectionObserver((entries) => {
      this.visible = entries[0]?.isIntersecting ?? false;
      this.syncLoop();
    });
    this.visibilityObserver.observe(this.canvas.nativeElement);

    this.startedAt = performance.now();
    this.time = this.reducedMotion ? LOOP_SECONDS / 2 : 0;
    this.redraw();
    this.syncLoop();
  }

  ngOnDestroy(): void {
    this.stopLoop();
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
  }

  private redraw(): void {
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

    if (!this.ctx) {
      return;
    }

    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.drawFrame(rect.width, rect.height);
  }

  private syncLoop(): void {
    if (this.visible && !this.reducedMotion) {
      if (this.rafId === null) {
        this.startedAt = performance.now() - this.time * 1000;
        this.rafId = requestAnimationFrame(this.tick);
      }
      return;
    }

    this.stopLoop();
    this.redraw();
  }

  private stopLoop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private readonly tick = (now: number): void => {
    this.rafId = null;
    this.time = (now - this.startedAt) / 1000;
    this.redraw();

    if (this.visible && !this.reducedMotion) {
      this.rafId = requestAnimationFrame(this.tick);
    }
  };

  private drawFrame(width: number, height: number): void {
    const ctx = this.ctx;
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, width, height);

    const centerY = height / 2;
    const amplitude = height * 0.3;
    const k = (2 * Math.PI * CYCLES) / width;

    // Horizontal axis.
    ctx.strokeStyle = PALETTE.axis;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // The curve.
    ctx.strokeStyle = PALETTE.curve;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let x = 0; x <= width; x += 2) {
      const y = centerY - amplitude * Math.sin(k * x);
      if (x === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Point + tangent (the "movement").
    const u = this.reducedMotion
      ? 0.5
      : (this.time % LOOP_SECONDS) / LOOP_SECONDS;
    const xp = u * width;
    const yp = centerY - amplitude * Math.sin(k * xp);
    const slope = -amplitude * k * Math.cos(k * xp);

    const half = Math.min(90, width * 0.12);
    const invLength = 1 / Math.hypot(1, slope);
    const dx = half * invLength;
    const dy = half * invLength * slope;

    ctx.strokeStyle = PALETTE.tangent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xp - dx, yp - dy);
    ctx.lineTo(xp + dx, yp + dy);
    ctx.stroke();

    ctx.fillStyle = PALETTE.point;
    ctx.beginPath();
    ctx.arc(xp, yp, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}
