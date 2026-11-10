import { TestBed } from '@angular/core/testing';
import {
  LANGUAGE_THEME_DOCUMENT_CLASS,
  LANGUAGE_THEME_STORAGE_KEY,
  LanguageTheme,
  preferredLanguageTheme,
  readLanguageTheme,
  saveLanguageTheme,
} from './language-theme';

/**
 * The preference contract: the choice is remembered across pages and reloads,
 * falls back to the platform preference on a first visit, and puts the light
 * chrome on `<html>` only while a languages page is mounted.
 */
describe('language theme preference', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove(LANGUAGE_THEME_DOCUMENT_CLASS);
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove(LANGUAGE_THEME_DOCUMENT_CLASS);
  });

  it('persists and reads an explicit choice', () => {
    saveLanguageTheme('light');

    expect(localStorage.getItem(LANGUAGE_THEME_STORAGE_KEY)).toBe('light');
    expect(readLanguageTheme()).toBe('light');
  });

  it('ignores an unknown stored value and uses the platform preference', () => {
    localStorage.setItem(LANGUAGE_THEME_STORAGE_KEY, 'sepia');

    expect(readLanguageTheme()).toBe(preferredLanguageTheme());
  });

  it('falls back to the platform preference when storage is empty', () => {
    expect(readLanguageTheme()).toBe(preferredLanguageTheme());
  });

  it('starts the service from the stored choice', () => {
    localStorage.setItem(LANGUAGE_THEME_STORAGE_KEY, 'light');

    const theme = TestBed.inject(LanguageTheme);

    expect(theme.mode()).toBe('light');
    expect(theme.light()).toBeTrue();
  });

  it('toggles the service and persists the new mode', () => {
    const theme = TestBed.inject(LanguageTheme);
    const wasLight = theme.light();

    theme.toggle();

    expect(theme.light()).toBe(!wasLight);
    expect(localStorage.getItem(LANGUAGE_THEME_STORAGE_KEY)).toBe(
      wasLight ? 'dark' : 'light',
    );
  });

  it('only themes the document while a languages page is mounted', () => {
    localStorage.setItem(LANGUAGE_THEME_STORAGE_KEY, 'light');
    const theme = TestBed.inject(LanguageTheme);

    expect(document.documentElement.classList).not.toContain(
      LANGUAGE_THEME_DOCUMENT_CLASS,
    );

    theme.enterPage();
    expect(document.documentElement.classList).toContain(
      LANGUAGE_THEME_DOCUMENT_CLASS,
    );

    // A second page mounting (hub → reader) must not drop the class when the
    // first one unmounts.
    theme.enterPage();
    theme.leavePage();
    expect(document.documentElement.classList).toContain(
      LANGUAGE_THEME_DOCUMENT_CLASS,
    );

    theme.leavePage();
    expect(document.documentElement.classList).not.toContain(
      LANGUAGE_THEME_DOCUMENT_CLASS,
    );
  });

  it('keeps a dark page dark on the document too', () => {
    localStorage.setItem(LANGUAGE_THEME_STORAGE_KEY, 'dark');
    const theme = TestBed.inject(LanguageTheme);

    theme.enterPage();

    expect(document.documentElement.classList).not.toContain(
      LANGUAGE_THEME_DOCUMENT_CLASS,
    );

    theme.toggle();

    expect(document.documentElement.classList).toContain(
      LANGUAGE_THEME_DOCUMENT_CLASS,
    );
  });
});
