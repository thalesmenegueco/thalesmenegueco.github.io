import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MILESTONES } from '../../data/portfolio-content';
import { RevealDirective } from '../ui/reveal.directive';
import { SectionHeadingComponent } from '../ui/section-heading';

/**
 * The trajectory, told as four stages on a single rail.
 *
 * Stages, not years: the story here is the order in which the projects
 * followed each other, and a date the page cannot vouch for is the one thing
 * on it that could be wrong. The rail gradients rose → violet → azure, so it
 * borrows the hero's palette without repeating it.
 */
@Component({
  selector: 'app-timeline-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective, SectionHeadingComponent],
  templateUrl: './timeline.section.html',
  styleUrl: './timeline.section.scss',
})
export class TimelineSectionComponent {
  readonly milestones = MILESTONES;
}
