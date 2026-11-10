import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { focusLabel, type MandarinFocus } from './language-catalog';
import { LanguageTheme } from './language-theme';
import { findMandarinText } from './mandarin-content';
import type { MandarinToken, MandarinWord } from './mandarin.types';

/**
 * The Mandarin reading surface: one short text with the four reading aids this
 * feature exists for.
 *
 * The aids are **independent local state**, not route state: pinyin, script,
 * word spacing and translation are reading preferences for the current passage,
 * and none of them changes which text is open. They persist for the life of the
 * component and reset on the next reading — deliberately, because the defaults
 * (pinyin on, simplified, no spacing) are the ones a learner should start from
 * on every new text.
 *
 * The component renders only through `text()`; every branch of the template
 * hangs off the same resolved reading, and an unknown `:textId` gets an honest
 * "texto não encontrado" instead of an empty page.
 */
@Component({
  selector: 'app-mandarin-reader',
  imports: [RouterLink],
  templateUrl: './mandarin-reader.component.html',
  styleUrl: './mandarin-reader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Same host-class contract as the hub: one class repaints the reading surface.
  host: { '[class.theme-light]': 'theme.light()' },
})
export class MandarinReaderComponent {
  readonly theme = inject(LanguageTheme);

  private readonly route = inject(ActivatedRoute);
  private readonly pageTitle = inject(Title);

  /** Route parameter, kept live so a param change on the same route re-renders. */
  private readonly textId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('textId'))),
    { initialValue: this.route.snapshot.paramMap.get('textId') },
  );

  readonly text = computed(() => findMandarinText(this.textId()));

  /** Pinyin is shown by default: it is the aid a reading product should not hide. */
  readonly showPinyin = signal(true);
  readonly showSpaces = signal(false);
  readonly showTranslation = signal(false);
  /** `false` = simplified (the authored form), `true` = traditional. */
  readonly traditional = signal(false);

  /** The word whose tooltip is pinned by click/tap — hover is handled by CSS alone. */
  readonly pinned = signal<MandarinToken | null>(null);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.theme.enterPage();
    this.destroyRef.onDestroy(() => this.theme.leavePage());

    effect(() => {
      const text = this.text();
      this.pageTitle.setTitle(
        text ? `${text.title} — Mandarim · VisuaLab` : 'Texto não encontrado — VisuaLab',
      );
    });
  }

  /** Character form for a word, honouring the simplified/traditional toggle. */
  scriptWord(word: MandarinWord): string {
    return this.traditional() ? word.traditional : word.zh;
  }

  focusName(focus: MandarinFocus): string {
    return focusLabel(focus);
  }

  isActive(token: MandarinToken): boolean {
    return this.pinned() === token;
  }

  togglePinyin(): void {
    this.showPinyin.update((on) => !on);
  }

  toggleSpaces(): void {
    this.showSpaces.update((on) => !on);
  }

  toggleTranslation(): void {
    this.showTranslation.update((on) => !on);
  }

  useSimplified(): void {
    this.traditional.set(false);
  }

  useTraditional(): void {
    this.traditional.set(true);
  }

  togglePin(token: MandarinToken): void {
    this.pinned.update((current) => (current === token ? null : token));
  }

  /** Enter and Space pin a word for keyboard users, exactly like a tap does. */
  onWordKey(event: KeyboardEvent, token: MandarinToken): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.togglePin(token);
    }
  }
}
