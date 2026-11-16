import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

/**
 * A subtle, decorative "two scripts, one curve" emblem for the studies hero.
 *
 * A point traces a sine curve while its tangent line slides along with it —
 * the derivative made visible. Riding that same curve is 学习 ("to study"), the
 * platform's other lab in the same frame: the character is a drawing and the
 * curve is a drawing, and the same method reads both. The word slides along the
 * wave like a sled, tilting with it. It loops slowly, pauses when scrolled out
 * of view, and renders a static frame under `prefers-reduced-motion`.
 *
 * Palette values derive from `DEFAULT_PLOT_THEME` (`@shared/plotting`), with
 * the axis and tangent strokes given extra transparency for this decorative
 * use. `studies.component.scss` consumes the same identity via `plot-tokens`.
 */

const LOOP_SECONDS = 9;
const CYCLES = 1.5;

/**
 * The sled's own period, deliberately not a multiple of `LOOP_SECONDS`: the
 * word overtakes the point and is overtaken by it, which reads as two objects
 * on the same curve rather than one machine.
 */
const SLED_SECONDS = 13;

/**
 * The hero word. Rendered with the same serif CJK stack the languages section
 * uses, so the platform's one decorative Chinese glyph and its 20 readings are
 * set in the same face. No webfont is loaded for it — these are system faces,
 * and `Noto Serif CJK SC` is listed because that, not `Noto Serif SC`, is the
 * family name the Linux `fonts-noto-cjk` package installs.
 */
const HERO_WORD = '学习';
const CJK_FONT =
  "'Noto Serif SC', 'Songti SC', 'SimSun', 'Source Han Serif SC', 'Noto Serif CJK SC', serif";

const PALETTE = {
  axis: 'rgba(151, 166, 161, 0.22)',
  curve: '#4fb3a6',
  tangent: 'rgba(255, 163, 0, 0.55)',
  point: '#ffa300',
  word: '#7cc9bd',
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

    // Envelope. The crests have to leave room for the word that rides them —
    // `centerY - amplitude` must exceed the glyph height — but no more than
    // that, or the bottom half of the band would be empty air.
    const centerY = height * 0.58;
    const amplitude = height * 0.22;
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

    // The word, drawn last so it sits on the stroke rather than under it.
    //
    // It rides the curve like a sled with two runners. A rigid word cannot
    // follow a curve that bends 30px across its own width — on a 320px canvas
    // the wave's radius is comparable to the word's length, so a tangent-aligned
    // label cuts straight through the line. Instead the word spans the chord
    // between its two ends, tilts with that chord, and is lifted by the curve's
    // bulge so both ends clear the surface at once.
    //
    // Its own slower period means it overtakes the point and is overtaken by
    // it; the fade at both edges hides the wrap from right to left, which would
    // otherwise read as a teleport.
    const wordSize = Math.round(Math.min(height * 0.28, width * 0.11));
    const sledU = this.reducedMotion
      ? 1 / 6
      : (this.time % SLED_SECONDS) / SLED_SECONDS;
    const sx = sledU * width;

    ctx.font = `${wordSize}px ${CJK_FONT}`;
    const halfLength = ctx.measureText(HERO_WORD).width / 2;
    const yAt = (x: number): number => centerY - amplitude * Math.sin(k * x);
    const x0 = Math.max(0, sx - halfLength);
    const x1 = Math.min(width, sx + halfLength);
    const span = Math.max(1, x1 - x0);
    const y0 = yAt(x0);
    const y1 = yAt(x1);

    const chordSlope = (y1 - y0) / span;
    const chordY = (y0 + y1) / 2;
    const bulge = Math.abs(yAt((x0 + x1) / 2) - chordY);
    const gap = wordSize * 0.03;
    const normal = Math.hypot(1, chordSlope);

    const tilt = Math.atan(chordSlope);
    const anchorX = (x0 + x1) / 2 + (chordSlope / normal) * (bulge + gap);
    const anchorY = chordY - (bulge + gap) / normal;

    const fade = this.reducedMotion
      ? 1
      : Math.max(0, Math.min(1, Math.min(sledU, 1 - sledU) / 0.1));

    ctx.save();
    ctx.globalAlpha = 0.8 * fade;
    ctx.translate(anchorX, anchorY);
    ctx.rotate(tilt);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = PALETTE.word;
    ctx.fillText(HERO_WORD, 0, 0);
    ctx.restore();
  }
}
