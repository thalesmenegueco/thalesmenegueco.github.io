import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
/**
 * The portfolio's shell: a nav, the routed surface, and a footer.
 *
 * It has no `title` field. The generated component carried
 * `title = signal('learning-gallery')`, but nothing ever read it — not this
 * app's template, not any spec — so after Phase 1 renamed the project to
 * `portfolio` it was only a stale string kept alive by a test asserting the
 * placeholder `Hello, learning-gallery` heading. Both are gone now, and
 * `app.spec.ts` asserts the shell that actually renders.
 */
export class AppComponent {}
