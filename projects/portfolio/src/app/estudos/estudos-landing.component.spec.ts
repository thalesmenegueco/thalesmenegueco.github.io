import { TestBed } from '@angular/core/testing';
import { EstudosLandingComponent } from './estudos-landing.component';
import { PLATFORM_LINKS } from '../platform-links';

describe('EstudosLandingComponent', () => {
  function hrefs(): string[] {
    const fixture = TestBed.createComponent(EstudosLandingComponent);
    fixture.detectChanges();

    return Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('a'),
    ).map((link) => link.getAttribute('href') ?? '');
  }

  beforeEach(() => TestBed.resetTestingModule());

  it('links out to the platform hub', () => {
    expect(hrefs()).toContain(PLATFORM_LINKS.hub);
  });

  it('links to each of the three live Cálculo courses', () => {
    const links = hrefs();

    expect(links).toContain(PLATFORM_LINKS.calculoTeoria);
    expect(links).toContain(PLATFORM_LINKS.calculoAplicada);
    expect(links).toContain(PLATFORM_LINKS.calculoProcesso);
  });

  it('sends every link to the platform origin, never a relative path', () => {
    // The whole point of this page is to hand visitors to another origin. A
    // relative href would silently 404 inside the portfolio instead.
    for (const href of hrefs()) {
      expect(href.startsWith(PLATFORM_LINKS.hub)).toBeTrue();
    }
  });
});
