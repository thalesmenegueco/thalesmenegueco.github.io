import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../../data/portfolio-content';
import { IconComponent } from '../../ui/icon';

/**
 * The first impression: name, promise, two doors out.
 *
 * Full-bleed and atmospheric on purpose. The aurora is a single blurred
 * element (`.aurora` in `styles.scss`) rather than a canvas — it composites
 * once, costs no JavaScript, and `prefers-reduced-motion` stops the drift.
 */
@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './hero.section.html',
  styleUrl: './hero.section.scss',
})
export class HeroSectionComponent {
  readonly profile = PROFILE;
}
