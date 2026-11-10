import { ChangeDetectionStrategy, Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  HSK_LEVELS,
  LANGUAGE_TRACKS,
  MANDARIN_FOCUS_ORDER,
  focusLabel,
  type HskLevel,
  type MandarinFocus,
} from './language-catalog';
import { MANDARIN_TEXTS } from './mandarin-content';
import { LanguageTheme } from './language-theme';

/** `0` means "every level": the filter is a display choice, not a level value. */
type LevelFilter = HskLevel | 0;
type FocusFilter = MandarinFocus | 'todos';

/**
 * The reading hub of the languages section: one track, its texts, and the two
 * filters the collection is organised by (HSK level and editorial focus).
 *
 * The filters are local display state over a static collection. Nothing here
 * fetches, pages or scores: there are seventeen readings, and the honest UI for
 * seventeen
 * readings is a filter bar plus a grid, not a search engine.
 *
 * Today the grid is the Mandarin collection. A second language needs its own
 * reader and its own filter scope inside that track's `<section>`, not a second
 * loop over `MANDARIN_TEXTS` — see `./README.md`.
 */
@Component({
  selector: 'app-language-hub',
  imports: [RouterLink],
  templateUrl: './language-hub.component.html',
  styleUrl: './language-hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // The section's reading theme lives on the page host, so `:host(.theme-light)`
  // can repaint the whole surface from one class.
  host: { '[class.theme-light]': 'theme.light()' },
})
export class LanguageHubComponent {
  readonly theme = inject(LanguageTheme);

  private readonly destroyRef = inject(DestroyRef);

  readonly tracks = LANGUAGE_TRACKS;
  readonly levels = HSK_LEVELS;
  readonly focuses = MANDARIN_FOCUS_ORDER;

  readonly level = signal<LevelFilter>(0);
  readonly focus = signal<FocusFilter>('todos');

  readonly texts = computed(() =>
    MANDARIN_TEXTS.filter((text) => {
      const levelOk = this.level() === 0 || text.level === this.level();
      const focusOk = this.focus() === 'todos' || text.focus === this.focus();
      return levelOk && focusOk;
    }),
  );

  /** The active focus label, or `null` when every focus is shown. */
  readonly activeFocus = computed(() => {
    const focus = this.focus();
    return focus === 'todos' ? null : focusLabel(focus);
  });

  constructor() {
    // The light chrome (body, nav, footer) is a document-level class; the page
    // enters and leaves it so the frame matches whichever surface is mounted.
    this.theme.enterPage();
    this.destroyRef.onDestroy(() => this.theme.leavePage());
  }

  setLevel(level: LevelFilter): void {
    this.level.set(level);
  }

  setFocus(focus: FocusFilter): void {
    this.focus.set(focus);
  }

  focusName(focus: MandarinFocus): string {
    return focusLabel(focus);
  }
}
