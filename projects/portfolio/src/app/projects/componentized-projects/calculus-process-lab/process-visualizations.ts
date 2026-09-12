import { PALETTE } from '../calculus/calculus.palette';
import {
  PlotBounds,
  PlotSize,
  drawCurve,
  drawGrid,
  drawPoint,
} from '../calculus/plotting';
import { chargingRate, secantSlope, voltage } from './process-engine';
import { ProcessVisualType } from './process.types';

export interface ProcessVisualParams {
  time: number;
  h: number;
  approachDistance: number;
}

type Drawer = (
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  params: ProcessVisualParams,
) => void;

// ---------- circuit (schematic, no axes) ----------

function drawCircuit(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  params: ProcessVisualParams,
): void {
  const { width, height } = size;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = '#0d1415';
  ctx.fillRect(0, 0, width, height);

  const centerY = height / 2;
  const left = width * 0.16;
  const right = width * 0.84;

  // Main wire.
  ctx.strokeStyle = PALETTE.studySky;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(left, centerY);
  ctx.lineTo(right, centerY);
  ctx.stroke();

  // Capacitor plates.
  ctx.strokeStyle = PALETTE.accentWarm;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(width * 0.48, centerY - 50);
  ctx.lineTo(width * 0.48, centerY + 50);
  ctx.moveTo(width * 0.54, centerY - 50);
  ctx.lineTo(width * 0.54, centerY + 50);
  ctx.stroke();

  // Source (circle).
  ctx.strokeStyle = PALETTE.studyTeal;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(width * 0.27, centerY, 30, 0, Math.PI * 2);
  ctx.stroke();

  // Labels.
  ctx.fillStyle = PALETTE.text;
  ctx.font = '700 14px system-ui';
  ctx.fillText('fonte', width * 0.22, centerY - 52);
  ctx.fillText('capacitor', width * 0.44, centerY + 82);
  ctx.fillText('sensor', width * 0.73, centerY - 52);

  // Sensor gauge: fill level for the voltage at the target instant.
  const voltageLevel = 30 + (voltage(params.time) / 12) * 100;
  ctx.fillStyle = 'rgba(79, 179, 166, 0.15)';
  ctx.fillRect(
    width * 0.69,
    centerY + 22 - voltageLevel,
    50,
    voltageLevel,
  );
  ctx.strokeStyle = PALETTE.studyTeal;
  ctx.strokeRect(width * 0.69, centerY - 80, 50, 102);
}

// ---------- function plots ----------

function drawModel(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  params: ProcessVisualParams,
): void {
  const bounds: PlotBounds = { xMin: 0, xMax: 9, yMin: 0, yMax: 13 };
  const axis = drawGrid(ctx, size, bounds);
  drawCurve(ctx, size, axis, bounds, voltage, PALETTE.studySky, 3);
  drawPoint(
    ctx,
    axis.xToPixel(params.time),
    axis.yToPixel(voltage(params.time)),
    PALETTE.accentWarm,
  );
}

function drawLimit(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  params: ProcessVisualParams,
): void {
  const bounds: PlotBounds = { xMin: 1.5, xMax: 4.5, yMin: 4, yMax: 10 };
  const axis = drawGrid(ctx, size, bounds);
  drawCurve(ctx, size, axis, bounds, voltage, PALETTE.studySky, 3);

  const distance = params.approachDistance;
  const left = 3 - distance;
  const right = 3 + distance;

  // Dashed vertical line at the target instant.
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = PALETTE.accentWarm;
  ctx.beginPath();
  ctx.moveTo(axis.xToPixel(3), 0);
  ctx.lineTo(axis.xToPixel(3), size.height);
  ctx.stroke();
  ctx.setLineDash([]);

  drawPoint(
    ctx,
    axis.xToPixel(left),
    axis.yToPixel(voltage(left)),
    PALETTE.studyTeal,
  );
  drawPoint(
    ctx,
    axis.xToPixel(right),
    axis.yToPixel(voltage(right)),
    PALETTE.accentSecondary,
  );

  // Target ring.
  ctx.strokeStyle = PALETTE.accentWarm;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(
    axis.xToPixel(3),
    axis.yToPixel(voltage(3)),
    8,
    0,
    Math.PI * 2,
  );
  ctx.stroke();
}

function drawSecant(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  params: ProcessVisualParams,
): void {
  const bounds: PlotBounds = { xMin: 0, xMax: 7, yMin: 0, yMax: 13 };
  const axis = drawGrid(ctx, size, bounds);
  const t = 3;
  const h = params.h;
  const slope = secantSlope(t, h);
  const y0 = voltage(t);

  drawCurve(ctx, size, axis, bounds, voltage, PALETTE.studySky, 3);
  drawCurve(
    ctx, size, axis, bounds,
    (x) => y0 + slope * (x - t),
    PALETTE.accentSecondary,
    2,
  );
  drawPoint(ctx, axis.xToPixel(t), axis.yToPixel(y0), PALETTE.studyTeal);
  drawPoint(
    ctx,
    axis.xToPixel(t + h),
    axis.yToPixel(voltage(t + h)),
    PALETTE.accentSecondary,
  );
}

function drawTangent(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  params: ProcessVisualParams,
): void {
  const bounds: PlotBounds = { xMin: 0, xMax: 7, yMin: 0, yMax: 13 };
  const axis = drawGrid(ctx, size, bounds);
  const t = 3;
  const secant = secantSlope(t, params.h);
  const tangent = chargingRate(t);
  const y0 = voltage(t);

  drawCurve(ctx, size, axis, bounds, voltage, PALETTE.studySky, 3);
  drawCurve(
    ctx, size, axis, bounds,
    (x) => y0 + secant * (x - t),
    PALETTE.accentSecondary,
    2,
  );
  drawCurve(
    ctx, size, axis, bounds,
    (x) => y0 + tangent * (x - t),
    PALETTE.accentWarm,
    2,
  );
  drawPoint(ctx, axis.xToPixel(t), axis.yToPixel(y0), PALETTE.accentWarm, 7);
}

function drawDerivative(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  params: ProcessVisualParams,
): void {
  const bounds: PlotBounds = { xMin: 0, xMax: 9, yMin: 0, yMax: 13 };
  const axis = drawGrid(ctx, size, bounds);

  drawCurve(ctx, size, axis, bounds, voltage, PALETTE.studySky, 3);
  drawCurve(ctx, size, axis, bounds, chargingRate, PALETTE.accentWarm, 3);

  drawPoint(
    ctx,
    axis.xToPixel(params.time),
    axis.yToPixel(voltage(params.time)),
    PALETTE.studyTeal,
  );
  drawPoint(
    ctx,
    axis.xToPixel(params.time),
    axis.yToPixel(chargingRate(params.time)),
    PALETTE.accentWarm,
  );
}

function drawResult(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  params: ProcessVisualParams,
): void {
  const bounds: PlotBounds = { xMin: 0, xMax: 7, yMin: 0, yMax: 13 };
  const axis = drawGrid(ctx, size, bounds);
  const t = params.time;
  const slope = chargingRate(t);
  const y = voltage(t);

  drawCurve(ctx, size, axis, bounds, voltage, PALETTE.studySky, 3);
  drawCurve(
    ctx, size, axis, bounds,
    (x) => y + slope * (x - t),
    PALETTE.accentWarm,
    3,
  );
  drawPoint(ctx, axis.xToPixel(t), axis.yToPixel(y), PALETTE.accentWarm, 7);
}

const drawers: Record<ProcessVisualType, Drawer> = {
  circuit: drawCircuit,
  model: drawModel,
  limit: drawLimit,
  secant: drawSecant,
  tangent: drawTangent,
  derivative: drawDerivative,
  result: drawResult,
};

export function drawProcessVisual(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  visual: ProcessVisualType,
  params: ProcessVisualParams,
): void {
  drawers[visual]?.(ctx, size, params);
}
