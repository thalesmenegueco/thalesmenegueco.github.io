import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FLAGSHIP_PROJECTS,
  PROFILE,
} from '../../data/portfolio-content';
import { IconComponent } from '../../ui/icon';
import { RevealDirective } from '../ui/reveal.directive';
import { SectionHeadingComponent } from '../ui/section-heading';

/**
 * The two projects with a real product behind them, as alternating rows.
 *
 * Alternating full-width rows rather than two equal columns: these are the
 * page's proof of work, so each gets a wide screenshot and a paragraph of
 * breathing room. The Sinal Fala channel closes the section as a quiet strip —
 * it is a channel, not a product, and giving it a card would have over-claimed
 * it.
 */
@Component({
  selector: 'app-projects-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent, RevealDirective, SectionHeadingComponent],
  templateUrl: './projects.section.html',
  styleUrl: './projects.section.scss',
})
export class ProjectsSectionComponent {
  readonly projects = FLAGSHIP_PROJECTS;
  readonly sinalFala = PROFILE.sinalFala;
}
