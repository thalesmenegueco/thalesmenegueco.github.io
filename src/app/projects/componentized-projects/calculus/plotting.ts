import { PALETTE } from './calculus.palette';

export interface PlotBounds {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
}

export interface PlotSize {
  width: number;
  height: number;
}

export interface Axis {
  xToPixel: (x: number) => number;
  yToPixel: (y: number) => number;
}

/**
 * Clears the canvas and draws the grid + axes. Returns the pixel mapping so
 * callers can draw their own curves on top.
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  bounds: PlotBounds,
): Axis {
  const { xMin, xMax, yMin, yMax } = bounds;
  const xToPixel = (x: number) => ((x - xMin) / (xMax - xMin)) * size.width;
  const yToPixel = (y: number) =>
    size.height - ((y - yMin) / (yMax - yMin)) * size.height;

  ctx.clearRect(0, 0, size.width, size.height);
  ctx.fillStyle = PALETTE.plotBg;
  ctx.fillRect(0, 0, size.width, size.height);

  ctx.strokeStyle = 'rgba(151, 166, 161, 0.12)';
  ctx.lineWidth = 1;

  for (let x = Math.ceil(xMin); x <= xMax; x++) {
    const px = xToPixel(x);
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, size.height);
    ctx.stroke();
  }

  for (let y = Math.ceil(yMin); y <= yMax; y++) {
    const py = yToPixel(y);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(size.width, py);
    ctx.stroke();
  }

  ctx.strokeStyle = 'rgba(231, 236, 233, 0.5)';
  ctx.lineWidth = 1.2;

  if (yMin <= 0 && yMax >= 0) {
    const py = yToPixel(0);
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(size.width, py);
    ctx.stroke();
  }

  if (xMin <= 0 && xMax >= 0) {
    const px = xToPixel(0);
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, size.height);
    ctx.stroke();
  }

  return { xToPixel, yToPixel };
}

/**
 * Draws a continuous curve y = fn(x). Skips non-finite samples (asymptotes,
 * domain holes) by breaking the path, so discontinuities don't draw a bogus
 * connector segment.
 */
export function drawCurve(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  axis: Axis,
  bounds: PlotBounds,
  fn: (x: number) => number,
  color: string,
  lineWidth = 2.5,
): void {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();

  let started = false;

  for (let i = 0; i <= size.width; i++) {
    const x = bounds.xMin + (i / size.width) * (bounds.xMax - bounds.xMin);
    let y: number;

    try {
      y = fn(x);
    } catch {
      y = NaN;
    }

    if (!Number.isFinite(y)) {
      started = false;
      continue;
    }

    const px = axis.xToPixel(x);
    const py = axis.yToPixel(y);

    if (py < -size.height * 3 || py > size.height * 4) {
      started = false;
      continue;
    }

    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.stroke();
  ctx.restore();
}

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  radius = 6,
): void {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = PALETTE.plotBg;
  ctx.lineWidth = 2;
  ctx.stroke();
}
