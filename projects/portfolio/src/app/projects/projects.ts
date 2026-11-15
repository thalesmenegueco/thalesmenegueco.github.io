import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TOOLS } from '../data/portfolio-content';
import { ToolCardComponent } from '../one-page/ui/tool-card';

/**
 * The `/tools` lab index: the full list, for people who want the catalogue
 * without the page's story.
 *
 * It renders the same `TOOLS` data and the same card the one-page
 * "Ferramentas" section uses, so a tool cannot appear in one place and be
 * missing from the other.
 */
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterLink, ToolCardComponent],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class ProjectsComponent {
  readonly tools = TOOLS;
}
