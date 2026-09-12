/**
 * `@shared/plotting` — canvas plotting primitives and the plot theme.
 *
 * Extracted from the Cálculo feature so both the portfolio and the ML platform
 * can draw with the same primitives while owning their own visual identity.
 */
export {
  PlotCanvasComponent,
} from './plot-canvas/plot-canvas.component';
export {
  DEFAULT_PLOT_THEME,
  PALETTE,
  type PlotTheme,
} from './plot-theme';
export {
  drawCurve,
  drawGrid,
  drawPoint,
  type Axis,
  type PlotBounds,
  type PlotSize,
} from './plotting';
