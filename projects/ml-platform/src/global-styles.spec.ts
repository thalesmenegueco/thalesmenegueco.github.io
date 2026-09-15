/**
 * Phase 3 prerequisite 6, asserted.
 *
 * The study surface moved here from the portfolio was written on top of the
 * portfolio's global stylesheet and declares none of this reset for itself.
 * When it is missing the result is not a compile error but a visible layout
 * break — widgets that combine `width: 100%` with padding, the auto-fit grids,
 * and every heading/paragraph/list regaining browser-default metrics. So it
 * gets a test rather than a hand-check.
 *
 * Karma loads this target's `styles` array, so these assertions are reading the
 * real `projects/ml-platform/src/styles.scss`.
 */
describe('global stylesheet (Phase 3 prerequisite 6)', () => {
  function withElement<T extends HTMLElement>(el: T, run: (el: T) => void): void {
    document.body.appendChild(el);
    try {
      run(el);
    } finally {
      el.remove();
    }
  }

  it('applies the margin/padding and box-sizing reset', () => {
    withElement(document.createElement('p'), (probe) => {
      const style = getComputedStyle(probe);

      expect(style.boxSizing).toBe('border-box');
      expect(style.marginTop).toBe('0px');
      expect(style.paddingTop).toBe('0px');
    });
  });

  it('declares the font family the module stylesheets were authored against', () => {
    expect(getComputedStyle(document.documentElement).fontFamily).toContain(
      'Roboto',
    );
  });

  it('keeps the page gutter the surface was laid out inside', () => {
    const style = getComputedStyle(document.body);

    // Breakpoint-aware on purpose: Karma's iframe is narrower than the 768px
    // breakpoint, so the mobile gutter is the one that applies here. Asserting
    // a bare "40px" would have tested the viewport, not the stylesheet.
    const gutter = window.innerWidth <= 768 ? '16px' : '40px';

    expect(style.paddingLeft).toBe(gutter);
    expect(style.paddingRight).toBe(gutter);
  });

  it('keeps images fluid, which the hub course icons rely on', () => {
    withElement(document.createElement('img'), (img) => {
      expect(getComputedStyle(img).maxWidth).toBe('100%');
    });
  });

  it('strips list markers, as the portfolio reset did', () => {
    const list = document.createElement('ul');
    const item = document.createElement('li');
    list.appendChild(item);

    withElement(list, () => {
      expect(getComputedStyle(item).listStyleType).toBe('none');
    });
  });

  it('paints the chrome and the course surface from one palette', () => {
    const root = getComputedStyle(document.documentElement);

    // Emitted by `_plot-tokens.scss`, which is also what the module
    // stylesheets consume — the reason nav, footer and content agree.
    expect(root.getPropertyValue('--color-bg').trim()).toBe('#0a0f10');
    expect(root.getPropertyValue('--color-accent-warm').trim()).toBe('#ffa300');
  });
});
