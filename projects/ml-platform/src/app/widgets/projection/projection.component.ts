import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import type {
  RuntimeWidgetBinding,
  WidgetSnapshot,
} from '../../lessons/runtime/lesson-runtime.types';
import {
  readFlag,
  requireVector,
  type MlWidgetComponent,
  type Vec2,
  type WidgetContext,
} from '../../lessons/runtime/widget-contract';

/** The name this widget answers to in `registries.json` and in the player's `@switch`. */
const WIDGET_ID = 'ProjectionWidget';

/** The SVG is 360×360; this is its centre in pixels. */
const CENTRE = 180;
/** Largest pixels-per-unit, used when nothing needs the room. */
const MAX_SCALE = 30;
/** Keep at least this much margin beyond the outermost drawn point. */
const MARGIN = 1.3;
/**
 * How far from 90° the student may be before the widget snaps **b** onto the exact
 * perpendicular.
 *
 * This is what makes the `completionCriterion` reachable: the manifest asks the student to
 * "prever quando cos θ = 0", and a free drag only ever *passes near* zero — the readout would
 * snap past 0.03 → −0.02 and the student could never land on it. Same mechanism, and same
 * reason, as `VectorSpaceWidget`'s tolerance around its target.
 */
const SNAP_DEGREES = 6;
/** A direction this short has no meaningful perpendicular to snap to. */
const MIN_LENGTH = 0.4;
/** Positions the student drags to are rounded, so the four readouts are legible numbers. */
const DRAG_STEP = 0.1;
/** `|cos ω|` at or below this reads as orthogonal — true only right after a snap. */
const ORTHOGONAL_EPSILON = 1e-6;

/** How close the pointer must land to a tip, in pixels, for a drag to start there. */
const HIT_RADIUS_PX = 26;

function dot(a: Vec2, b: Vec2): number {
  return a[0] * b[0] + a[1] * b[1];
}

function norm(a: Vec2): number {
  return Math.hypot(a[0], a[1]);
}

function round(value: number, digits: number): number {
  return Number(value.toFixed(digits));
}

function snapToStep(value: number): number {
  return round(Math.round(value / DRAG_STEP) * DRAG_STEP, 4);
}

function clampLength(vector: Vec2, minimum: number): Vec2 {
  const length = norm(vector);
  if (length >= minimum) {
    return vector;
  }
  if (length < 1e-9) {
    return [minimum, 0];
  }
  return [(vector[0] / length) * minimum, (vector[1] / length) * minimum];
}

/**
 * `ProjectionWidget` — the widget `fundamentos-teoria-02` is contracted on (§3.2, §3.4 and §3.8).
 *
 * Two vectors from the origin in ℝ²: **x**, the vector being projected, and **b**, the
 * direction. Both tips are draggable, and the student reads four numbers while dragging:
 * the dot product `xᵀb`, the cosine `cos ω`, the factor `λ`, and the projection's length.
 *
 * **Where the letters come from.** The manifest stores these numbers as
 * `numericExample.inputs.x` and `.y`, and `widgetConfig.vectorA`/`vectorB`; the book's §3.8 and
 * the manifest's own `completionCriterion` call the direction **b**. So `y` is the *machine* name
 * (it is what the evaluator and the bindings fixture key on) and **b** is what the student reads.
 * One name per audience, and no rename of the manifest: churning `inputs` would have invalidated
 * the generated fixture and the evaluator to buy a label.
 *
 * **Why the drawing shows the error segment.** The lesson's hardest idea is that the projection is
 * the *best approximation* — and what makes it best is not its length but that the error
 * `x − π` stays perpendicular to **b**. So the error is always drawn, a right angle is marked at
 * the foot, and when the student drags **b** to 90° the projection vanishes and the error becomes
 * **x** itself. The widget is evidence, not decoration: every claim the prose makes about this
 * lesson is visible here, including the one the pilot got wrong in the opposite direction (a
 * fixed window that contradicted the text).
 *
 * **The four readouts never name the notation.** The widget prints `xᵀb`, `cos ω`, `λ` and
 * `‖projeção‖` — the quantities — but never `π_U(x)`; the notation of §3.8 belongs to the last
 * step of the lesson, and spending it here would eat the discovery.
 */
@Component({
  selector: 'app-projection',
  standalone: true,
  templateUrl: './projection.component.html',
  styleUrl: './projection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectionWidgetComponent implements MlWidgetComponent {
  /** The lesson whose manifest declared this binding. Used only to name the manifest on error. */
  readonly lessonId = input.required<string>();

  /** `widget`, `widgetConfig` and `numericExample.inputs` of that lesson's manifest. */
  readonly binding = input.required<RuntimeWidgetBinding>();

  /** What the player validates against — the widget's side of the runtime protocol. */
  readonly snapshotChange = output<WidgetSnapshot>();

  private readonly context = computed<WidgetContext>(() => ({
    lessonId: this.lessonId(),
    widgetId: WIDGET_ID,
  }));

  /**
   * The vector being projected — `numericExample.inputs.x`, and **required**: an invented
   * starting vector would be a second copy of a number the manifest already owns.
   */
  private readonly startX = computed<Vec2>(() => requireVector(this.binding(), 'x', this.context()));

  /**
   * The direction — `numericExample.inputs.y` in the manifest, which the student reads as **b**.
   *
   * Required, like `x`: an invented direction would be a second copy of a number the manifest
   * already owns. `widgetConfig.vectorB` declares the same pair, and `inputs` wins when they
   * disagree — the documented split, because `inputs` is the field the gate proves.
   */
  private readonly startB = computed<Vec2>(() => requireVector(this.binding(), 'y', this.context()));

  /** Whether the manifest allows dragging at all (`widgetConfig.allowDrag`). */
  readonly allowDrag = computed(() => readFlag(this.binding(), 'allowDrag', true));

  /**
   * The student's drag overrides. `null` means "still where the manifest put it", so the
   * manifest stays the single source of the opening state and a reset is `set(null)`.
   */
  private readonly xOverride = signal<Vec2 | null>(null);
  private readonly bOverride = signal<Vec2 | null>(null);

  readonly x = computed<Vec2>(() => this.xOverride() ?? this.startX());
  /** The direction, labelled **b** for the student even though the manifest calls it `y`. */
  readonly b = computed<Vec2>(() => this.bOverride() ?? this.startB());

  /**
   * `xᵀb` — signed: negative means the directions point away from each other.
   *
   * **Unrounded.** Only the panel rounds (via `format`), because every drawn quantity is derived
   * from these numbers: a λ rounded to four decimals moved the foot of the projection by ~1e-4,
   * and the error stopped being *exactly* perpendicular to b — which is the one identity this
   * widget exists to show. Rounding belongs to the readout, never to the geometry.
   */
  readonly dotProduct = computed(() => dot(this.x(), this.b()));

  /** `cos ω` = ⟨x, b⟩ / (‖x‖‖b‖), the alignment in [−1, 1]. */
  readonly cos = computed(() => {
    const denominator = norm(this.x()) * norm(this.b());
    if (denominator < 1e-9) {
      return 0;
    }
    const value = dot(this.x(), this.b()) / denominator;
    return Math.max(-1, Math.min(1, value));
  });

  /** `λ` = bᵀx / ‖b‖², the factor that scales the direction. */
  readonly lambda = computed(() => {
    const squared = dot(this.b(), this.b());
    if (squared < 1e-9) {
      return 0;
    }
    return dot(this.x(), this.b()) / squared;
  });

  /** The projection `λb` — a point of the plane, not a number: that distinction is step 2's lesson. */
  readonly projection = computed<Vec2>(() => [
    this.lambda() * this.b()[0],
    this.lambda() * this.b()[1],
  ]);

  /** `‖λb‖` — the readout that changes sign-blind: it is the *length*, never the direction. */
  readonly projectionLength = computed(() => Math.abs(this.lambda()) * norm(this.b()));

  /** The error `x − π` — drawn always, because *this* is what makes the projection the best one. */
  readonly error = computed<Vec2>(() => [
    this.x()[0] - this.projection()[0],
    this.x()[1] - this.projection()[1],
  ]);

  /**
   * Whether the two directions are perpendicular — the state the manifest's criterion asks for.
   *
   * Computed from the **unrounded** dot product, relative to the lengths: reading it off the
   * rounded readout would let a hand-drag land on 0.0000 without ever being perpendicular. After
   * a snap this is exact, and a free drag cannot fake it (positions move in steps of 0.1).
   */
  readonly orthogonal = computed(
    () =>
      Math.abs(this.dotProduct()) <=
      ORTHOGONAL_EPSILON * (norm(this.x()) * norm(this.b()) + 1),
  );

  /** What the student is dragging, if anything. Drives the cursor and the dot highlight. */
  readonly dragging = signal<'x' | 'b' | null>(null);

  // ---- view geometry -------------------------------------------------------------------

  /** Largest coordinate drawn, so the frame always fits what it shows. */
  private readonly extent = computed(() => {
    const points: Vec2[] = [this.x(), this.b(), this.projection()];
    return Math.max(1, ...points.map((point) => Math.max(Math.abs(point[0]), Math.abs(point[1]))));
  });

  readonly pxPerUnit = computed(() => Math.min(MAX_SCALE, CENTRE / (this.extent() * MARGIN)));

  /** Half-width of the visible window, in units. Printed, so the zoom is legible. */
  readonly windowUnits = computed(() => CENTRE / this.pxPerUnit());

  /**
   * The whole line **b** lies on, clipped to the window.
   *
   * The projection can be longer than **b** itself — that is what `λ > 1` looks like — so its
   * foot would otherwise sit on an invisible line and read as floating. The guide names it.
   */
  readonly bLine = computed<[Vec2, Vec2] | null>(() => {
    const [x, y] = this.b();
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

  /** Grid spacing that keeps lines at least ~24 px apart. */
  readonly gridStep = computed(() => {
    const steps = [1, 2, 5, 10, 20, 50];
    return steps.find((step) => step * this.pxPerUnit() >= 24) ?? 50;
  });

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

  // ---- interaction ---------------------------------------------------------------------

  /**
   * Move one tip to `point` (in widget units) and report the new state.
   *
   * Public and unit-testable on purpose: the pointer wiring below is three lines of plumbing
   * around this function, and the pedagogy (snap, clamp, rounding) lives here where a spec can
   * reach it without synthesising a drag.
   */
  dragTo(which: 'x' | 'b', point: Vec2): void {
    if (!this.allowDrag()) {
      return;
    }

    const candidate = clampLength([snapToStep(point[0]), snapToStep(point[1])], MIN_LENGTH);

    if (which === 'x') {
      this.xOverride.set(candidate);
      this.report();
      return;
    }

    this.bOverride.set(this.snapToPerpendicular(candidate));
    this.report();
  }

  /**
   * Snap **b** onto the exact perpendicular of **x** when it is dragged close to it.
   *
   * The snapped vector is not rounded: the margin that makes `xᵀb` exactly zero is worth more
   * than round coordinates, because that zero is the state the lesson is about.
   */
  private snapToPerpendicular(candidate: Vec2): Vec2 {
    const x = this.x();
    const lengthX = norm(x);
    if (lengthX < 1e-9) {
      return candidate;
    }

    // The two perpendicular directions to x, as unit vectors.
    const perpendiculars: Vec2[] = [
      [-x[1] / lengthX, x[0] / lengthX],
      [x[1] / lengthX, -x[0] / lengthX],
    ];

    const lengthCandidate = norm(candidate);
    const candidateAngle = Math.atan2(candidate[1], candidate[0]);

    for (const perpendicular of perpendiculars) {
      const angle = Math.atan2(perpendicular[1], perpendicular[0]);
      const degrees = Math.abs(((candidateAngle - angle) * 180) / Math.PI);
      const distance = Math.min(degrees, 360 - degrees);
      if (distance <= SNAP_DEGREES) {
        const length = Math.max(lengthCandidate, MIN_LENGTH);
        return [perpendicular[0] * length, perpendicular[1] * length];
      }
    }

    return candidate;
  }

  /** Put both vectors back where the manifest put them. */
  reset(): void {
    this.xOverride.set(null);
    this.bOverride.set(null);
    this.report();
  }

  // ---- pointer plumbing ----------------------------------------------------------------

  onPointerDown(event: PointerEvent): void {
    if (!this.allowDrag()) {
      return;
    }
    const point = this.toUnits(event);
    const which = this.nearestTip(point);
    const tip = which === 'x' ? this.x() : this.b();
    const distance = Math.hypot(point[0] - tip[0], point[1] - tip[1]);

    // Only a press that lands near a tip starts a drag: grabbing the nearest tip from anywhere
    // on the canvas would move a vector the student did not mean to touch.
    if (distance > HIT_RADIUS_PX / this.pxPerUnit()) {
      return;
    }

    this.dragging.set(which);
    this.dragTo(which, point);
  }

  onPointerMove(event: PointerEvent): void {
    const which = this.dragging();
    if (which) {
      this.dragTo(which, this.toUnits(event));
    }
  }

  onPointerUp(): void {
    this.dragging.set(null);
  }

  /** Whichever tip the pointer is closer to — the two are never far apart at these scales. */
  private nearestTip(point: Vec2): 'x' | 'b' {
    const toX = norm([point[0] - this.x()[0], point[1] - this.x()[1]]);
    const toB = norm([point[0] - this.b()[0], point[1] - this.b()[1]]);
    return toX <= toB ? 'x' : 'b';
  }

  /** Client pixels → widget units, through the SVG's own box so the layout can scale. */
  private toUnits(event: PointerEvent): Vec2 {
    const svg = event.currentTarget as SVGSVGElement | null;
    const rect = svg?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
      return this.x();
    }
    const px = ((event.clientX - rect.left) / rect.width) * 360;
    const py = ((event.clientY - rect.top) / rect.height) * 360;
    return [(px - CENTRE) / this.pxPerUnit(), (CENTRE - py) / this.pxPerUnit()];
  }

  /**
   * Emit the snapshot the runtime asserts.
   *
   * Only scalars, and only what a step could plausibly check: `dot` and `cos` answer "did the
   * numbers go negative / did the alignment reverse", `lambda` and `projectionLength` answer
   * "did the projection grow, flip and vanish", and `orthogonal` answers the criterion's
   * "prever quando cos θ = 0" without the runtime having to reason about a threshold.
   */
  private report(): void {
    // Rounded to four decimals here and **only** here: a snapshot is what a step asserts and what
    // the review box prints, so noise in the twelfth decimal helps nobody. The geometry above stays
    // exact — see `dotProduct`.
    this.snapshotChange.emit({
      dot: round(this.dotProduct(), 4),
      cos: round(this.cos(), 4),
      lambda: round(this.lambda(), 4),
      projectionLength: round(this.projectionLength(), 4),
      orthogonal: this.orthogonal(),
    });
  }

  // ---- template helpers ----------------------------------------------------------------

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

  /**
   * The little right-angle square at the foot of the projection, between the error segment and
   * the direction — the visual proof that `x − π` is ⟂ to **b**, which is *why* the projection is
   * the closest point of the line. Empty while the projection is degenerate (nothing to mark).
   */
  rightAnglePoints(): string {
    const projection = this.projection();
    const error = this.error();
    const lengthError = norm(error);
    const lengthDirection = norm(this.b());
    if (lengthError < 1e-6 || lengthDirection < 1e-6) {
      return '';
    }

    const size = 9;
    const direction: Vec2 = [this.b()[0] / lengthDirection, this.b()[1] / lengthDirection];
    const across: Vec2 = [error[0] / lengthError, error[1] / lengthError];

    const originX = this.pxX(projection[0]);
    const originY = this.pxY(projection[1]);
    // Unit space → pixels flips y, so the square is built in pixel space directly.
    const alongX = direction[0] * size;
    const alongY = -direction[1] * size;
    const acrossX = across[0] * size;
    const acrossY = -across[1] * size;

    return [
      `${originX},${originY}`,
      `${originX + alongX},${originY + alongY}`,
      `${originX + alongX + acrossX},${originY + alongY + acrossY}`,
      `${originX + acrossX},${originY + acrossY}`,
    ].join(' ');
  }

  format(value: number): string {
    return Number(value.toFixed(2)).toString();
  }

  pair(value: Vec2): string {
    return `(${this.format(value[0])}, ${this.format(value[1])})`;
  }
}
