import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { ToolItem } from '../../data/portfolio-content';
import { IconComponent } from '../../ui/icon';

/**
 * One tool, as a card.
 *
 * Shared by the one-page "Ferramentas" section and the `/tools` lab index —
 * the same data, the same card, two grids. The card is decorative-free: its
 * only interactive element is the whole surface, so a click anywhere is a
 * click on the tool, and the arrow is only a cue.
 */
@Component({
  selector: 'app-tool-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, IconComponent],
  templateUrl: './tool-card.html',
  styleUrl: './tool-card.scss',
})
export class ToolCardComponent {
  readonly tool = input.required<ToolItem>();
}
