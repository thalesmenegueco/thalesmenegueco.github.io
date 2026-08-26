import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormulaOption } from '../../calculus.types';
import { KatexComponent } from '../katex/katex.component';

@Component({
  selector: 'app-formula-match',
  standalone: true,
  imports: [KatexComponent],
  templateUrl: './formula-match.component.html',
  styleUrl: './formula-match.component.scss',
})
export class FormulaMatchComponent {
  @Input() options: FormulaOption[] = [];
  @Output() valueChange = new EventEmitter<string>();

  readonly selectedId = signal<string | null>(null);

  select(id: string): void {
    this.selectedId.set(id);
    this.valueChange.emit(id);
  }
}
