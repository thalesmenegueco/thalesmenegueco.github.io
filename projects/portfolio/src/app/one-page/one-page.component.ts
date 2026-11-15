import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  afterNextRender,
  inject,
} from '@angular/core';
import { ScrollSpy } from '../core/scroll-spy.service';
import { NAV_LINKS } from '../data/portfolio-content';
import { AboutSectionComponent } from './sections/about.section';
import { ContactSectionComponent } from './sections/contact.section';
import { HeroSectionComponent } from './sections/hero.section';
import { ProjectsSectionComponent } from './sections/projects.section';
import { TimelineSectionComponent } from './sections/timeline.section';
import { ToolsSectionComponent } from './sections/tools.section';

/**
 * The one-page portfolio: six sections in reading order.
 *
 * The component itself is only a composition root — it hosts no content and
 * no styles. Its one job beyond that is starting the `ScrollSpy`, which it
 * does after the sections render, using the same `NAV_LINKS` ids the nav
 * renders, so the two can never disagree about what a section is called.
 */
@Component({
  selector: 'app-one-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroSectionComponent,
    AboutSectionComponent,
    ProjectsSectionComponent,
    ToolsSectionComponent,
    TimelineSectionComponent,
    ContactSectionComponent,
  ],
  template: `
    <app-hero-section />
    <app-about-section />
    <app-projects-section />
    <app-tools-section />
    <app-timeline-section />
    <app-contact-section />
  `,
})
export class OnePageComponent implements OnDestroy {
  private readonly spy = inject(ScrollSpy);

  constructor() {
    afterNextRender(() => {
      this.spy.start(NAV_LINKS.map((link) => link.id));
    });
  }

  ngOnDestroy(): void {
    this.spy.stop();
  }
}
