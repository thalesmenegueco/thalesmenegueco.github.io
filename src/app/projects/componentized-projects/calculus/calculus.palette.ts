/**
 * Runtime palette used by the canvas widgets.
 *
 * The same values are declared as CSS custom properties on `:host` in
 * `calculus.component.scss`. Canvas drawing code cannot read SCSS variables,
 * so it uses this constant directly. Keep the two in sync.
 */
export const PALETTE = {
  bg: '#0a0f10',
  plotBg: '#0c1213',
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
