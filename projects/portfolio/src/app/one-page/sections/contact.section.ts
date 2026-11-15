import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SOCIALS } from '../../data/portfolio-content';
import { IconComponent } from '../../ui/icon';

/**
 * The closing invitation.
 *
 * A full-bleed panel rather than another white-on-black section: the page
 * hands the visitor one last glow and three doors (GitHub, LinkedIn, the
 * Sinal Fala channel) before it ends.
 */
@Component({
  selector: 'app-contact-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconComponent],
  templateUrl: './contact.section.html',
  styleUrl: './contact.section.scss',
})
export class ContactSectionComponent {
  readonly socials = SOCIALS;
}
