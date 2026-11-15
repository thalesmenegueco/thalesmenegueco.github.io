import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * The eyebrow + title + lead block every section opens with.
 *
 * It exists so the six sections share one heading rhythm — the alternative
 * was the same three elements repeated in six templates, drifting apart one
 * spacing tweak at a time.
 *
 * `headingId` is optional and only needed by sections that point
 * `aria-labelledby` at their heading.
 */
@Component({
  selector: 'app-section-heading',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="section__head">
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h2 [attr.id]="headingId() || null">{{ title() }}</h2>
      @if (lead()) {
        <p class="section__lead">{{ lead() }}</p>
      }
    </header>
  `,
})
export class SectionHeadingComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly lead = input('');
  readonly headingId = input('');
}
