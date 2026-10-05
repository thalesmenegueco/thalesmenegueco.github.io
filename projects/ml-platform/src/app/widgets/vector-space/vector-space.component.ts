import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

/** A point/vector in the plane, in widget units. */
export type Vec2 = [number, number];

/** The SVG is 360×360; this is its centre in pixels. */
const CENTRE = 180;
/** Largest pixels-per-unit, used when nothing needs the room. */
const MAX_SCALE = 34;
/** Keep at least this much margin beyond the outermost drawn point. */
const MARGIN = 1.25;
/** How close `v` must get to the target before the widget confirms it. */
const TOLERANCE = 0.15;

const BASIS_PRESETS: { label: string; bases: [Vec2, Vec2] }[] = [
  { label: 'canônica', bases: [[1, 0], [0, 1]] },
  { label: 'inclinada', bases: [[1, 0], [1, 1]] },
];

/**
 * `VectorSpaceWidget` — the widget `fundamentos-teoria-01` is contracted on.
 *
 * It exposes the three operations the manifest's `widgetConfig.availableOps` declares —
 * `sum`, `scale` and `linearCombination` — in one panel, in three labelled groups, because
 * the generation contract has no per-step widget configuration: a step can name a
 * `widgetId` but cannot configure it. Rather than guess a mode from the step index, the
 * widget shows all three and each step's `prompt` sends the student to a different group.
 *
 * **The view always fits what it draws.** A first version used a fixed ±5 units, and the
 * scaled vector left the frame as soon as `λ` was pushed — which showed the student the
 * *opposite* of what step 2 claims, that these operations never leave the plane. The scale
 * is now derived from the outermost point (`pxPerUnit`), so it only zooms out when
 * something needs the room, and the window size is printed so an out-zoomed view reads as
 * "the window moved", not as "the vector left the space".
 *
 * `λ` scales the **resulting movement `v`**, not the base directions — they are the robot's
 * fixed unit steps and stay put. The book uses `λ` for both roles, though: `λᵢ` are the
 * coefficients of the combination in §2.5 (the `c₁`/`c₂` sliders here) and `λ` is the scalar
 * of `λx` in §2.4(e). Step 3 of the lesson draws that distinction out loud, because it is a
 * genuine notational collision and not something the student should have to guess.
 */
@Component({
  selector: 'app-vector-space',
  standalone: true,
  templateUrl: './vector-space.component.html',
  styleUrl: './vector-space.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VectorSpaceWidgetComponent {
  /** Initial base vectors, from the manifest's `widgetConfig.bases`. */
  readonly bases = input<Vec2[]>([
    [1, 0],
    [0, 1],
  ]);

  /** The vector the student has to reach, from the manifest's `numericExample`. */
  readonly target = input<Vec2>([2, 3]);

  /** Slider positions. Public so the template can bind to them directly. */
  readonly values = {
    c1: signal(0),
    c2: signal(0),
    w1: signal(1),
    w2: signal(2),
    lambda: signal(2),
  };

  readonly presets = BASIS_PRESETS;
  readonly activePreset = signal(0);

  private readonly basisOverride = signal<[Vec2, Vec2] | null>(null);

  readonly activeBases = computed<[Vec2, Vec2]>(() => {
    const override = this.basisOverride();
    if (override) {
      return override;
    }
    const [b1, b2] = this.bases();
    return [b1 ?? [1, 0], b2 ?? [0, 1]];
  });

  readonly b1 = computed(() => this.activeBases()[0]);
  readonly b2 = computed(() => this.activeBases()[1]);

  /** The combination `v = c₁b₁ + c₂b₂`. */
  readonly v = computed<Vec2>(() => {
    const [b1, b2] = this.activeBases();
    const c1 = this.values.c1();
    const c2 = this.values.c2();
    return [c1 * b1[0] + c2 * b2[0], c1 * b1[1] + c2 * b2[1]];
  });

  /** The second vector, added by the "soma" group. */
  readonly w = computed<Vec2>(() => [this.values.w1(), this.values.w2()]);

  readonly sum = computed<Vec2>(() => [this.v()[0] + this.w()[0], this.v()[1] + this.w()[1]]);

  /** `λv` — the scalar applied to the resulting movement. */
  readonly scaled = computed<Vec2>(() => {
    const lambda = this.values.lambda();
    const v = this.v();
    return [lambda * v[0], lambda * v[1]];
  });

  /** Largest coordinate among everything drawn, including the origin-anchored target. */
  private readonly extent = computed(() => {
    const points: Vec2[] = [this.b1(), this.b2(), this.v(), this.sum(), this.scaled(), this.target()];
    return Math.max(
      1,
      ...points.map((p) => Math.max(Math.abs(p[0]), Math.abs(p[1]))),
    );
  });

  /** Pixels per unit, capped so a small scene still fills the frame. */
  readonly pxPerUnit = computed(() =>
    Math.min(MAX_SCALE, CENTRE / (this.extent() * MARGIN)),
  );

  /** Half-width of the visible window, in units. Printed, so the zoom is legible. */
  readonly windowUnits = computed(() => CENTRE / this.pxPerUnit());

  /** Grid spacing that keeps lines at least ~24 px apart. */
  readonly gridStep = computed(() => {
    const steps = [1, 2, 5, 10, 20, 50];
    const scale = this.pxPerUnit();
    return steps.find((step) => step * scale >= 24) ?? 50;
  });

  /** Grid positions, as multiples of `gridStep` that fit the window. */
  readonly gridLines = computed(() => {
    const step = this.gridStep();
    const limit = Math.floor(this.windowUnits() / step) * step;
    const lines: number[] = [];
    for (let value = -limit; value <= limit; value += step) {
      lines.push(value);
    }
    return lines;
  });

  /** Tick labels: the grid lines except the origin, where the axes already cross. */
  readonly ticks = computed(() => this.gridLines().filter((value) => value !== 0));

  /**
   * Endpoints of the line `λv` is confined to, clipped to the window so the guide fills the
   * frame instead of dictating its scale.
   */
  readonly scaleLine = computed<[Vec2, Vec2] | null>(() => {
    const [x, y] = this.scaled();
    const longest = Math.max(Math.abs(x), Math.abs(y));
    if (longest < 1e-6) {
      return null;
    }
    const k = this.windowUnits() / longest;
    return [
      [-x * k, -y * k],
      [x * k, y * k],
    ];
  });

  readonly distance = computed(() => {
    const [vx, vy] = this.v();
    const [tx, ty] = this.target();
    return Math.hypot(vx - tx, vy - ty);
  });

  readonly confirmed = computed(() => this.distance() <= TOLERANCE);

  onSlider(which: keyof VectorSpaceWidgetComponent['values'], event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(value)) {
      this.values[which].set(value);
    }
  }

  setPreset(index: number): void {
    this.activePreset.set(index);
    this.basisOverride.set(BASIS_PRESETS[index].bases);
  }

  reset(): void {
    this.values.c1.set(0);
    this.values.c2.set(0);
  }

  /** Unit-space → SVG pixels. y is flipped because SVG grows downwards. */
  pxX(x: number): number {
    return CENTRE + x * this.pxPerUnit();
  }

  pxY(y: number): number {
    return CENTRE - y * this.pxPerUnit();
  }

  /** Arrowhead for the line ending at `to`, pointing away from `from`. */
  headPoints(from: Vec2, to: Vec2): string {
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const length = Math.hypot(dx, dy);
    if (length < 1e-6) {
      return '';
    }
    const ux = dx / length;
    const uy = -dy / length;
    const tipX = this.pxX(to[0]);
    const tipY = this.pxY(to[1]);
    const baseX = tipX - ux * 9;
    const baseY = tipY - uy * 9;
    const perpX = -uy * 4;
    const perpY = ux * 4;
    return [
      `${tipX},${tipY}`,
      `${baseX + perpX},${baseY + perpY}`,
      `${baseX - perpX},${baseY - perpY}`,
    ].join(' ');
  }

  format(value: number): string {
    return Number(value.toFixed(2)).toString();
  }

  pair(value: Vec2): string {
    return `(${this.format(value[0])}, ${this.format(value[1])})`;
  }
}
