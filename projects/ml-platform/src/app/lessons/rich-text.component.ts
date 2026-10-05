import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RichTextPipe } from './rich-text.pipe';

/**
 * Renders one string of lesson prose with its inline emphasis, as text nodes plus
 * `<strong>`/`<em>` elements. No `innerHTML`, so there is no injection surface and no
 * sanitiser to trust.
 *
 * `display: inline` on the host keeps the segments flowing inside the paragraph that wraps
 * them, so `<p><app-rich-text …/></p>` reads as one paragraph rather than a block.
 *
 * The emphasis syntax it understands is documented in `content-source/CAMADA3.md` next to
 * the field list, so a generation knows exactly what a `narrative` block may contain.
 */
@Component({
  selector: 'app-rich-text',
  standalone: true,
  imports: [RichTextPipe],
  template: `
    @for (segment of text() | richText; track $index) {
      @if (segment.emphasis === 'bold') {
        <strong>{{ segment.text }}</strong>
      } @else if (segment.emphasis === 'italic') {
        <em>{{ segment.text }}</em>
      } @else {
        {{ segment.text }}
      }
    }
  `,
  styles: ':host { display: inline; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RichTextComponent {
  readonly text = input<string>('');
}
