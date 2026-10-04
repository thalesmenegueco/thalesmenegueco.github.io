import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  styleUrl: './card.scss',
  imports: [],
  template: `
    <div class="group-card">
      <div class="card-hover-shadow">
        <a [href]="link">
          <img [src]="image" alt="{{ name }}" class="image" [class.image--rounded]="roundedImage">
          <h2>{{ name }}</h2>
          <div class="content">
            <div><span>{{ description }}</span></div>
          </div>
        </a>
      </div>
    </div>`,
})
export class CardComponent {
  @Input() image!: string;
  @Input() name!: string;
  @Input() description!: string;
  @Input() link?: string;

  /**
   * Rounds this card's media corners (`--radius-image`).
   *
   * Opt-in, and only correct for an **opaque** image. The cards' icons are
   * transparent SVG glyphs, and a `border-radius` does not frame a glyph — it
   * cuts it. That is measured rather than assumed: in a real browser, forcing
   * the radius to 0 changed 450 pixels of the `creativity-1` glyph and 210 of
   * the `puzzle` glyph, i.e. the radius was removing artwork, while the same
   * comparison on the two screenshots changed 294 and 290 pixels *at the
   * picture's own corners*, which is the rounding doing its job.
   *
   * So screenshot cards set this and icon cards do not. `CardItem.roundedImage`
   * is the data-side switch; see it for what the caller is expected to decide.
   */
  @Input() roundedImage = false;
}
