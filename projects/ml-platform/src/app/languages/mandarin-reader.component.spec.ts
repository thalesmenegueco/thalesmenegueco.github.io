import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import {
  LANGUAGE_THEME_DOCUMENT_CLASS,
  LANGUAGE_THEME_STORAGE_KEY,
  type LanguageThemeMode,
} from './language-theme';
import { findMandarinText } from './mandarin-content';
import { MandarinReaderComponent } from './mandarin-reader.component';

/**
 * The reader contract: the four reading aids the feature was asked for, and the
 * per-word tooltip that makes a word's pinyin and meaning reachable without
 * leaving the text.
 */
describe('MandarinReaderComponent', () => {
  const sample = findMandarinText('hsk1-meu-domingo');
  if (!sample) {
    throw new Error('fixture reading hsk1-meu-domingo is missing');
  }

  const sampleWordCount = sample.tokens
    .flat()
    .filter((token) => token.word !== null).length;
  const samplePunctCount = sample.tokens
    .flat()
    .filter((token) => token.word === null).length;

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove(LANGUAGE_THEME_DOCUMENT_CLASS);
  });

  function create(textId: string, storedTheme?: LanguageThemeMode) {
    localStorage.clear();
    if (storedTheme) {
      localStorage.setItem(LANGUAGE_THEME_STORAGE_KEY, storedTheme);
    }

    const paramMap = convertToParamMap({ textId });

    TestBed.configureTestingModule({
      imports: [MandarinReaderComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap }, paramMap: of(paramMap) },
        },
      ],
    });

    const fixture = TestBed.createComponent(MandarinReaderComponent);
    fixture.detectChanges();

    return {
      fixture,
      element: fixture.nativeElement as HTMLElement,
      component: fixture.componentInstance,
    };
  }

  function click(element: HTMLElement, selector: string) {
    const button = element.querySelector<HTMLElement>(selector);
    if (!button) {
      throw new Error(`missing element ${selector}`);
    }

    button.click();
    return button;
  }

  it('opens the reading named by the route parameter', () => {
    const { element } = create(sample.id);

    expect(element.querySelector('.title')?.textContent).toContain('Meu domingo');
    expect(element.querySelector('.title-zh')?.textContent).toContain('我的星期天');
  });

  it('renders one ruby word per dictionary token and one literal per punctuation token', () => {
    const { element } = create(sample.id);

    expect(element.querySelectorAll('.word').length).toBe(sampleWordCount);
    expect(element.querySelectorAll('.punct').length).toBe(samplePunctCount);
    expect(element.querySelectorAll('.word rt').length).toBe(sampleWordCount);
  });

  it('shows pinyin by default and hides it through the pinyin toggle', () => {
    const { fixture, element } = create(sample.id);

    const toggle = click(element, '.toggle-pinyin');
    fixture.detectChanges();

    const passage = element.querySelector('.passage') as HTMLElement;

    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    expect(passage.classList).toContain('hide-pinyin');

    click(element, '.toggle-pinyin');
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(passage.classList).not.toContain('hide-pinyin');
  });

  it('switches every word from simplified to traditional and back', () => {
    const { fixture, element } = create(sample.id);

    const rubies = () =>
      Array.from(element.querySelectorAll('.word ruby')).map(
        (ruby) => ruby.textContent ?? '',
      );

    expect(rubies().some((text) => text.includes('高兴'))).toBeTrue();

    click(element, '.script-traditional');
    fixture.detectChanges();

    expect(rubies().some((text) => text.includes('高興'))).toBeTrue();
    expect(rubies().some((text) => text.includes('高兴'))).toBeFalse();

    click(element, '.script-simplified');
    fixture.detectChanges();

    expect(rubies().some((text) => text.includes('高兴'))).toBeTrue();
  });

  it('adds word spacing as a class on the passage, without touching the text', () => {
    const { fixture, element } = create(sample.id);
    const passage = element.querySelector('.passage') as HTMLElement;

    expect(passage.classList).not.toContain('show-spaces');

    click(element, '.toggle-spaces');
    fixture.detectChanges();

    expect(passage.classList).toContain('show-spaces');
    expect(element.querySelectorAll('.word').length).toBe(sampleWordCount);
  });

  it('shows the pt-BR translation only when the translation toggle is on', () => {
    const { fixture, element } = create(sample.id);

    expect(element.querySelectorAll('.translation').length).toBe(0);

    click(element, '.toggle-translation');
    fixture.detectChanges();

    expect(element.querySelectorAll('.translation').length).toBe(
      sample.translation.length,
    );
    expect(element.querySelector('.translation')?.textContent).toContain(
      'Hoje é domingo',
    );
  });

  it('gives every word a tooltip with its pinyin and its meaning', () => {
    const { element } = create(sample.id);
    const tips = element.querySelectorAll('.word .tip');

    expect(tips.length).toBe(sampleWordCount);
    expect(tips[0].textContent).toContain('jīntiān');
    expect(tips[0].textContent).toContain('hoje');
  });

  it('pins a word tooltip on click and unpins it on a second click', () => {
    const { fixture, element } = create(sample.id);
    const word = () => element.querySelector('.word') as HTMLElement;

    word().click();
    fixture.detectChanges();
    expect(word().classList).toContain('is-active');

    word().click();
    fixture.detectChanges();
    expect(word().classList).not.toContain('is-active');
  });

  it('pins a word tooltip from the keyboard', () => {
    const { fixture, element } = create(sample.id);
    const word = element.querySelector('.word') as HTMLElement;

    word.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(word.classList).toContain('is-active');
  });

  it('lists every word of the reading exactly once in the glossary', () => {
    const { element } = create(sample.id);

    expect(element.querySelectorAll('.glossary-item').length).toBe(
      sample.glossary.length,
    );
    expect(element.querySelector('.glossary-zh')?.textContent).toContain('今天');
  });

  it('sets the page title from the reading', () => {
    create(sample.id);

    expect(document.title).toContain('Meu domingo');
    expect(document.title).toContain('VisuaLab');
  });

  it('puts the same light/dark toggle on top of the reading', () => {
    const { fixture, element } = create(sample.id, 'dark');
    const host = fixture.nativeElement as HTMLElement;
    const toggle = element.querySelector<HTMLButtonElement>('.theme-toggle');

    if (!toggle) {
      throw new Error('missing theme toggle');
    }

    expect(host.classList).not.toContain('theme-light');

    toggle.click();
    fixture.detectChanges();

    expect(host.classList).toContain('theme-light');
    expect(document.documentElement.classList).toContain(
      LANGUAGE_THEME_DOCUMENT_CLASS,
    );
    expect(localStorage.getItem(LANGUAGE_THEME_STORAGE_KEY)).toBe('light');
  });

  it('opens the reading in the stored theme', () => {
    const { fixture } = create(sample.id, 'light');

    expect((fixture.nativeElement as HTMLElement).classList).toContain(
      'theme-light',
    );
  });

  it('fails honestly on an unknown text id', () => {
    const { element } = create('nao-existe');

    expect(element.querySelector('.reader-missing')).toBeTruthy();
    expect(element.querySelector('.passage')).toBeNull();
    expect(element.querySelector('.reader-missing h1')?.textContent).toContain(
      'não encontrado',
    );
  });
});
