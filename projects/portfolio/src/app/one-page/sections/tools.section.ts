import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOOLS } from '../../data/portfolio-content';
import { IconComponent } from '../../ui/icon';
import { RevealDirective } from '../ui/reveal.directive';
import { SectionHeadingComponent } from '../ui/section-heading';
import { ToolCardComponent } from '../ui/tool-card';

/**
 * The tools lab, as a grid that links out to the apps themselves.
 *
 * The apps under `/tools/*` are real surfaces with their own layouts, so the
 * section does not try to embed them — it advertises them, and the card is
 * the door. `/tools` keeps the full index for people who want the list
 * without the story.
 */
@Component({
  selector: 'app-tools-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    IconComponent,
    RevealDirective,
    SectionHeadingComponent,
    ToolCardComponent,
  ],
  templateUrl: './tools.section.html',
  styleUrl: './tools.section.scss',
})
export class ToolsSectionComponent {
  readonly tools = TOOLS;
}
