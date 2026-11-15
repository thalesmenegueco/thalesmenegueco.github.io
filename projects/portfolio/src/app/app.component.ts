import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PROFILE } from './data/portfolio-content';
import { NavComponent } from './shell/nav';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
/**
 * The portfolio's shell: skip link, sticky nav, the routed surface, footer.
 *
 * The nav lives here rather than in the one-page component because `/tools`
 * and `/estudos` are real routes that need the same bar; its section links
 * are `/#section` targets so they work from anywhere. The footer carries the
 * outbound links that used to sit under every page's content, which means a
 * tool page never has to repeat them.
 *
 * It has no `title` field: the generated placeholder was never read and is
 * gone along with the placeholder heading it kept alive.
 */
export class AppComponent {
  readonly profile = PROFILE;
  readonly year = new Date().getFullYear();
  readonly sourceUrl =
    'https://github.com/thalesmenegueco/thalesmenegueco.github.io';
}
