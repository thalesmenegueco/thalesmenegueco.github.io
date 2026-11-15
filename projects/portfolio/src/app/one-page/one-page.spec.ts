import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FLAGSHIP_PROJECTS, NAV_LINKS, TOOLS } from '../data/portfolio-content';
import { PLATFORM_LINKS } from '../platform-links';
import { OnePageComponent } from './one-page.component';

/**
 * The one-page contract, asserted against the rendered DOM.
 *
 * The interesting tests are the data-driven ones: every tool must link to its
 * real route, the flagships must point at the real products, and the
 * screenshots must actually load. The last one is the only check a build
 * cannot give — a mistyped image path type-checks, compiles and deploys
 * perfectly, and the visitor gets a broken image on the page's proof-of-work.
 */
describe('OnePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnePageComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  function render(): HTMLElement {
    const fixture = TestBed.createComponent(OnePageComponent);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders every section the nav links to', () => {
    const compiled = render();

    for (const link of NAV_LINKS) {
      expect(compiled.querySelector(`#${link.id}`))
        .withContext(`missing section #${link.id}`)
        .toBeTruthy();
    }
  });

  it('renders exactly one h1, the hero name', () => {
    const compiled = render();

    expect(compiled.querySelectorAll('h1').length).toBe(1);
    expect(compiled.querySelector('h1')?.textContent).toContain('Eu construo');
  });

  it('links every tool card to its route under /tools', () => {
    const compiled = render();
    const hrefs = [...compiled.querySelectorAll('.tool-card')].map((card) =>
      card.getAttribute('href'),
    );

    expect(hrefs).toEqual(TOOLS.map((tool) => tool.href));
  });

  it('points the flagship cards at the real products', () => {
    const compiled = render();
    const hrefs = [...compiled.querySelectorAll('.project__cta')].map((cta) =>
      cta.getAttribute('href'),
    );

    expect(hrefs).toEqual(FLAGSHIP_PROJECTS.map((project) => project.href));
    expect(hrefs).toContain('https://www.sinalize.org');
    expect(hrefs).toContain(PLATFORM_LINKS.hub);
  });

  it('loads every flagship screenshot, so a bad asset path fails here', async () => {
    // The screenshots are the only images the one-page renders from the local
    // `public/` folder, and they are the page's proof of work. The Karma
    // builder serves that folder, so these resolve exactly as they do under
    // `<base href="/">` in production.
    for (const project of FLAGSHIP_PROJECTS) {
      const loaded = await new Promise<boolean>((resolve) => {
        const probe = new Image();
        probe.onload = () => resolve(probe.naturalWidth > 0);
        probe.onerror = () => resolve(false);
        probe.src = project.image;
      });

      expect(loaded)
        .withContext(`screenshot did not load: ${project.image}`)
        .toBeTrue();
    }
  });
});
