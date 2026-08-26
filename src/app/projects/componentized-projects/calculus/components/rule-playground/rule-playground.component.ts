import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  signal,
} from '@angular/core';
import { KatexComponent } from '../katex/katex.component';

type RuleType = 'power' | 'product' | 'chain';

const RULE_CONTENT: Record<RuleType, { text: string; latex: string }> = {
  power: {
    text: 'Uma única variável aparece elevada a uma potência. O expoente desce e a potência é reduzida.',
    latex: String.raw`\frac{d}{dx}x^n = nx^{n-1}`,
  },
  product: {
    text: 'Preço e quantidade mudam simultaneamente. A receita sente os dois efeitos.',
    latex: String.raw`\frac{d}{dt}[p(t)q(t)] = p'(t)q(t)+p(t)q'(t)`,
  },
  chain: {
    text: 'O volume depende do raio, e o raio depende do tempo. A mudança percorre duas relações.',
    latex: String.raw`\frac{dV}{dt}=\frac{dV}{dr}\cdot\frac{dr}{dt}`,
  },
};

@Component({
  selector: 'app-rule-playground',
  standalone: true,
  imports: [KatexComponent],
  templateUrl: './rule-playground.component.html',
  styleUrl: './rule-playground.component.scss',
})
export class RulePlaygroundComponent implements OnInit {
  @Output() valueChange = new EventEmitter<RuleType>();

  readonly rule = signal<RuleType>('power');
  readonly content = computed(() => RULE_CONTENT[this.rule()]);

  ngOnInit(): void {
    this.valueChange.emit(this.rule());
  }

  onRule(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as RuleType;
    this.rule.set(value);
    this.valueChange.emit(value);
  }
}
