import { PALETTE } from '../calculus/calculus.palette';
import {
  PlotBounds,
  PlotSize,
  drawCurve,
  drawGrid,
  drawPoint,
} from '../calculus/plotting';
import { VisualizationType } from './calculus-practice.types';

export const VISUALIZATION_CAPTIONS: Record<VisualizationType, string> = {
  rc: 'A curva mostra o crescimento da tensão e a diminuição da taxa de carregamento.',
  braking: 'A inclinação da curva de posição representa a velocidade do veículo.',
  window: 'O topo da parábola indica a largura que produz a maior área.',
  algorithm: 'A curva representa o custo total conforme o tamanho do lote cresce.',
  revenue: 'A receita cresce, atinge um máximo e depois diminui.',
  tank: 'O volume cresce linearmente porque o raio permanece constante.',
};

type Drawer = (ctx: CanvasRenderingContext2D, size: PlotSize) => void;

const drawers: Record<VisualizationType, Drawer> = {
  rc: (ctx, size) => {
    const bounds: PlotBounds = { xMin: 0, xMax: 8, yMin: 0, yMax: 5.5 };
    const axis = drawGrid(ctx, size, bounds);
    drawCurve(
      ctx, size, axis, bounds,
      (t) => 5 * (1 - Math.exp(-0.5 * t)),
      PALETTE.studySky, 3,
    );
    drawCurve(
      ctx, size, axis, bounds,
      (t) => 2.5 * Math.exp(-0.5 * t),
      PALETTE.accentWarm, 3,
    );
    drawPoint(
      ctx,
      axis.xToPixel(2),
      axis.yToPixel(5 * (1 - Math.exp(-1))),
      PALETTE.studyTeal,
    );
  },

  braking: (ctx, size) => {
    const bounds: PlotBounds = { xMin: 0, xMax: 5, yMin: 0, yMax: 55 };
    const axis = drawGrid(ctx, size, bounds);
    drawCurve(
      ctx, size, axis, bounds,
      (t) => 24 * t - 3 * t * t,
      PALETTE.studySky, 3,
    );
    drawCurve(
      ctx, size, axis, bounds,
      (t) => 24 - 6 * t,
      PALETTE.accentWarm, 3,
    );
    drawPoint(ctx, axis.xToPixel(4), axis.yToPixel(48), PALETTE.accentWarm);
  },

  window: (ctx, size) => {
    const bounds: PlotBounds = { xMin: 0, xMax: 10, yMin: 0, yMax: 27 };
    const axis = drawGrid(ctx, size, bounds);
    drawCurve(
      ctx, size, axis, bounds,
      (x) => 10 * x - x * x,
      PALETTE.studySky, 3,
    );
    drawPoint(ctx, axis.xToPixel(5), axis.yToPixel(25), PALETTE.accentWarm, 7);

    ctx.fillStyle = 'rgba(255, 163, 0, 0.13)';
    ctx.fillRect(
      axis.xToPixel(4.75),
      axis.yToPixel(25),
      axis.xToPixel(5.25) - axis.xToPixel(4.75),
      size.height - axis.yToPixel(25),
    );
  },

  algorithm: (ctx, size) => {
    const bounds: PlotBounds = { xMin: 0, xMax: 100, yMin: 0, yMax: 700 };
    const axis = drawGrid(ctx, size, bounds);
    drawCurve(
      ctx, size, axis, bounds,
      (n) => 0.02 * n * n + 4 * n + 100,
      PALETTE.studySky, 3,
    );
    drawCurve(
      ctx, size, axis, bounds,
      (n) => 0.04 * n + 4,
      PALETTE.accentWarm, 3,
    );
    drawPoint(
      ctx,
      axis.xToPixel(50),
      axis.yToPixel(0.02 * 50 * 50 + 4 * 50 + 100),
      PALETTE.studyTeal,
    );
  },

  revenue: (ctx, size) => {
    const bounds: PlotBounds = { xMin: 0, xMax: 30, yMin: 0, yMax: 950 };
    const axis = drawGrid(ctx, size, bounds);
    drawCurve(
      ctx, size, axis, bounds,
      (p) => 120 * p - 4 * p * p,
      PALETTE.studySky, 3,
    );
    drawPoint(
      ctx,
      axis.xToPixel(15),
      axis.yToPixel(120 * 15 - 4 * 15 * 15),
      PALETTE.accentWarm,
      7,
    );
  },

  tank: (ctx, size) => {
    // Bounds widened (vs. the original prototype) so the t = 5 point is visible.
    const bounds: PlotBounds = { xMin: 0, xMax: 10, yMin: 0, yMax: 65 };
    const axis = drawGrid(ctx, size, bounds);
    drawCurve(
      ctx, size, axis, bounds,
      (t) => Math.PI * 4 * (0.4 * t + 1),
      PALETTE.studySky, 3,
    );
    drawPoint(
      ctx,
      axis.xToPixel(5),
      axis.yToPixel(Math.PI * 4 * (0.4 * 5 + 1)),
      PALETTE.accentWarm,
    );
  },
};

export function drawVisualization(
  ctx: CanvasRenderingContext2D,
  size: PlotSize,
  id: VisualizationType,
): void {
  drawers[id]?.(ctx, size);
}
