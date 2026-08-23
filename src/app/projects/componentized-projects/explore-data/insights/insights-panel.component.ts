import { Component, computed, inject } from '@angular/core';
import { ExploreDataState } from '../state/explore-data.state';
import { InsightGeneratorService } from './insight-generator.service';
import { InsightCardComponent } from './insight-card.component';

@Component({
  selector: 'app-insights-panel',
  standalone: true,
  imports: [InsightCardComponent],
  templateUrl: './insights-panel.component.html',
  styleUrl: './insights-panel.component.scss',
})
export class InsightsPanelComponent {
  private readonly state = inject(ExploreDataState);
  private readonly generator = inject(InsightGeneratorService);

  readonly insights = computed(() => {
    const dataset = this.state.dataset();
    return dataset ? this.generator.generateInsights(dataset).insights : [];
  });
}
