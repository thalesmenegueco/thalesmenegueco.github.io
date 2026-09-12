/**
 * Theme contract for the shared canvas plotting widgets.
 *
 * Canvas drawing code cannot read CSS custom properties, so the values it needs
 * live here as plain strings. This is the **single source of truth** for the
 * Cálculo palette: the module stylesheets (`_plot-tokens.scss`) and this file
 * used to carry independent copies of the same hex values, which is exactly the
 * identity leakage this lib exists to remove.
 *
 * A host app restyles the widgets by passing its own `PlotTheme` to
 * `PlotCanvasComponent` and to the `draw*` helpers — not by forking them.
 */
export interface PlotTheme {
  /** Page background behind the widgets. */
  readonly bg: string;
  /** Fill of the plot area itself. */
  readonly plotBg: string;
  /** Border of the plot frame. */
  readonly plotBorder: string;
  /** Grid strokes. Derived from `textMuted` by default. */
  readonly gridLine: string;
  /** Axis strokes. Derived from `text` by default. */
  readonly axisLine: string;
  readonly surface: string;
  readonly surfaceHover: string;
  readonly text: string;
  readonly textMuted: string;
  readonly border: string;
  readonly accentWarm: string;
  readonly accentWarmSoft: string;
  readonly studySage: string;
  readonly studyTeal: string;
  readonly studySky: string;
  readonly accentSecondary: string;
  readonly danger: string;
}

/**
 * The "Exatas em Movimento" dark, matte, teal-tinted identity.
 *
 * These are the exact values the Cálculo widgets used before this lib existed,
 * so adopting the lib is a no-op visually.
 */
export const DEFAULT_PLOT_THEME: PlotTheme = {
  bg: '#0a0f10',
  plotBg: '#0c1213',
  plotBorder: '#263432',
  gridLine: 'rgba(151, 166, 161, 0.12)',
  axisLine: 'rgba(231, 236, 233, 0.5)',
  surface: '#182023',
  surfaceHover: '#223033',
  text: '#e7ece9',
  textMuted: '#97a6a1',
  border: '#33433f',
  accentWarm: '#ffa300',
  accentWarmSoft: '#e0a94f',
  studySage: '#8fae9b',
  studyTeal: '#4fb3a6',
  studySky: '#7fb4d4',
  accentSecondary: '#b06aa3',
  danger: '#d87878',
} as const;

/**
 * Backwards-compatible alias for the name the Cálculo widgets already import.
 *
 * @deprecated Prefer `DEFAULT_PLOT_THEME`, which is typed. This alias exists so
 * the extraction is a pure move; migrate consumers with the Phase 6 selector
 * cleanup rather than mixing both names in the same file.
 */
export const PALETTE = DEFAULT_PLOT_THEME;
