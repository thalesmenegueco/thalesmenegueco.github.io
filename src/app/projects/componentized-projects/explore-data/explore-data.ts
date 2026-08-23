import { Component, inject } from '@angular/core';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { ExploreDataState } from './state/explore-data.state';
import { LessonService } from './lessons/lesson.service';
import { InsightsPanelComponent } from './insights/insights-panel.component';
import { LessonsComponent } from './lessons/lessons.component';
import type { ChartCustomization, FieldType } from './models/types';

@Component({
  selector: 'app-explore-data',
  standalone: true,
  imports: [NgxEchartsDirective, InsightsPanelComponent, LessonsComponent],
  providers: [
    provideEchartsCore({ echarts: () => import('echarts') }),
    ExploreDataState,
    LessonService,
  ],
  templateUrl: './explore-data.html',
  styleUrl: './explore-data.scss',
})
export class ExploreData {
  readonly state = inject(ExploreDataState);

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    void this.state.parseFile(file).finally(() => {
      input.value = '';
    });
  }

  updateType(name: string, event: Event): void {
    const value = (event.target as HTMLSelectElement).value as FieldType;
    this.state.setTypeOverride(name, value);
  }

  updateCustom(key: keyof ChartCustomization, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.state.setCustomization(key, value);
  }
}
