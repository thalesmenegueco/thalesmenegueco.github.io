import { Component, Input } from '@angular/core';
import type { Insight } from './insight.types';

@Component({
  selector: 'app-insight-card',
  standalone: true,
  imports: [],
  templateUrl: './insight-card.component.html',
  styleUrl: './insight-card.component.scss',
})
export class InsightCardComponent {
  @Input({ required: true }) insight!: Insight;

  severityLabel(severity: string): string {
    switch (severity) {
      case 'critical':
        return 'Crítico';
      case 'warning':
        return 'Atenção';
      default:
        return 'Info';
    }
  }
}
