import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLink, provideRouter } from '@angular/router';
import { LANGUAGE_TRACKS } from './language-catalog';
import { LanguageHubComponent } from './language-hub.component';
import {
  LANGUAGE_THEME_DOCUMENT_CLASS,
  LANGUAGE_THEME_STORAGE_KEY,
  type LanguageThemeMode,
} from './language-theme';
import { MANDARIN_TEXTS } from './mandarin-content';

/**
 * The hub contract: the whole collection is visible by default, the level and
 * focus filters narrow it without lying about what exists, and every card leads
 * to its reading.
 */
describe('LanguageHubComponent', () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove(LANGUAGE_THEME_DOCUMENT_CLASS);
  });

  function render(storedTheme?: LanguageThemeMode) {
    localStorage.clear();
    if (storedTheme) {
      localStorage.setItem(LANGUAGE_THEME_STORAGE_KEY, storedTheme);
    }

    TestBed.configureTestingModule({
      imports: [LanguageHubComponent],
      providers: [provideRouter([])],
    });

    const fixture = TestBed.createComponent(LanguageHubComponent);
    fixture.detectChanges();

    return {
      fixture,
      element: fixture.nativeElement as HTMLElement,
    };
  }

  function cards(element: HTMLElement): HTMLElement[] {
    return Array.from(element.querySelectorAll<HTMLElement>('.text-card'));
  }

  function chip(element: HTMLElement, selector: string) {
    const button = element.querySelector<HTMLElement>(selector);
    if (!button) {
      throw new Error(`missing filter chip ${selector}`);
    }

    return button;
  }

  it('lists every reading of the collection', () => {
    const { element } = render();

    expect(cards(element).length).toBe(MANDARIN_TEXTS.length);
    expect(element.querySelector('.result-count')?.textContent).toContain(
      String(MANDARIN_TEXTS.length),
    );
  });

  it('lists the language tracks it renders', () => {
    const { element } = render();

    expect(element.querySelectorAll('.track').length).toBe(LANGUAGE_TRACKS.length);
    expect(element.querySelector('.track-name')?.textContent).toContain('Mandarim');
  });

  it('links each card to its reading with an in-app directive', () => {
    const { fixture, element } = render();
    const anchor = cards(element)[0];
    const sample = MANDARIN_TEXTS[0];

    expect(anchor.getAttribute('href')).toBe(`/linguas/mandarim/${sample.id}`);
    expect(
      fixture.debugElement.query(By.css('.text-card')).injector.get(RouterLink, null),
    ).toBeTruthy();
  });

  it('fronts each card with its reading cover', () => {
    const { element } = render();
    const sample = MANDARIN_TEXTS[0];
    const cover = cards(element)[0].querySelector('img');

    expect(cover).withContext('card cover').toBeTruthy();

    // The card uses the card-sized file, not the reader's 1280×720 cover, and
    // declares the 16:9 box up front so the grid does not jump as it loads.
    expect(cover?.getAttribute('src')).toBe(sample.cover.card);
    expect(cover?.getAttribute('width')).toBe('640');
    expect(cover?.getAttribute('height')).toBe('360');
    expect(cover?.getAttribute('loading')).toBe('lazy');
    // Decorative: the card's title is the accessible name of the picture.
    expect(cover?.getAttribute('alt')).toBe('');
  });

  it('filters by HSK level', () => {
    const { fixture, element } = render();

    chip(element, '[data-level="2"]').click();
    fixture.detectChanges();

    const expected = MANDARIN_TEXTS.filter((text) => text.level === 2);

    expect(cards(element).length).toBe(expected.length);
    for (const card of cards(element)) {
      expect(card.textContent).toContain('HSK 2');
    }
    expect(element.querySelector('.result-count')?.textContent).toContain('HSK 2');
  });

  it('filters by focus', () => {
    const { fixture, element } = render();

    chip(element, '[data-focus="cultura"]').click();
    fixture.detectChanges();

    const expected = MANDARIN_TEXTS.filter((text) => text.focus === 'cultura');

    expect(cards(element).length).toBe(expected.length);
    for (const card of cards(element)) {
      expect(card.textContent).toContain('Cultura');
    }
    expect(element.querySelector('.result-count')?.textContent).toContain('Cultura');
  });

  it('combines the two filters and says so when nothing matches', () => {
    const { fixture, element } = render();

    // The empty state is pinned on a (level, focus) pair the collection does not
    // have — HSK 1 has no cultura reading today. When a text fills that gap this
    // guard goes red, so the pair is re-chosen instead of the assertion dropped.
    // (The previous pin was HSK 3 · cultura, filled by "A dança da praça".)
    const emptyPair = MANDARIN_TEXTS.filter(
      (text) => text.level === 1 && text.focus === 'cultura',
    );
    expect(emptyPair.length).withContext('HSK 1 · Cultura must be empty').toBe(0);

    chip(element, '[data-level="1"]').click();
    chip(element, '[data-focus="cultura"]').click();
    fixture.detectChanges();

    expect(cards(element).length).toBe(0);
    expect(element.querySelector('.empty')).toBeTruthy();
  });

  it('puts a light/dark toggle on top and remembers the choice', () => {
    const { fixture, element } = render('dark');
    const host = fixture.nativeElement as HTMLElement;
    const toggle = element.querySelector<HTMLButtonElement>('.theme-toggle');

    if (!toggle) {
      throw new Error('missing theme toggle');
    }

    expect(toggle.getAttribute('aria-pressed')).toBe('false');

    toggle.click();
    fixture.detectChanges();

    expect(host.classList).toContain('theme-light');
    expect(document.documentElement.classList).toContain(
      LANGUAGE_THEME_DOCUMENT_CLASS,
    );
    expect(localStorage.getItem(LANGUAGE_THEME_STORAGE_KEY)).toBe('light');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');

    toggle.click();
    fixture.detectChanges();

    expect(host.classList).not.toContain('theme-light');
    expect(document.documentElement.classList).not.toContain(
      LANGUAGE_THEME_DOCUMENT_CLASS,
    );
    expect(localStorage.getItem(LANGUAGE_THEME_STORAGE_KEY)).toBe('dark');
  });

  it('opens in the theme the reader chose last time', () => {
    const { fixture } = render('light');

    expect((fixture.nativeElement as HTMLElement).classList).toContain(
      'theme-light',
    );
  });

  it('returns to the whole collection when the filters are cleared', () => {
    const { fixture, element } = render();

    chip(element, '[data-level="2"]').click();
    fixture.detectChanges();
    expect(cards(element).length).toBeLessThan(MANDARIN_TEXTS.length);

    // The first chip of each row is the "Todos" reset.
    element.querySelectorAll<HTMLElement>('.filter-level')[0].click();
    element.querySelectorAll<HTMLElement>('.filter-focus')[0].click();
    fixture.detectChanges();

    expect(cards(element).length).toBe(MANDARIN_TEXTS.length);
    expect(element.querySelector('.empty')).toBeNull();
  });
});
