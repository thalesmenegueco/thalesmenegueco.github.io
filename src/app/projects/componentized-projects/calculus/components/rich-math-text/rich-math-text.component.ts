import { Component, Input } from '@angular/core';
import { KatexComponent } from '../katex/katex.component';

interface Segment {
  type: 'text' | 'latex';
  value: string;
}

function splitMath(text: string): Segment[] {
  const segments: Segment[] = [];
  const regex = /\$\$([\s\S]*?)\$\$/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) {
      segments.push({ type: 'text', value: text.slice(last, match.index) });
    }
    segments.push({ type: 'latex', value: match[1] });
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    segments.push({ type: 'text', value: text.slice(last) });
  }

  return segments;
}

/**
 * Renders a text string that may contain inline `$$...$$` LaTeX segments,
 * mixing plain text with KaTeX-rendered formulas.
 */
@Component({
  selector: 'app-rich-math-text',
  standalone: true,
  imports: [KatexComponent],
  template: `
    @for (segment of segments; track $index) {
      @if (segment.type === 'latex') {
        <app-katex [latex]="segment.value" />
      } @else {
        {{ segment.value }}
      }
    }
  `,
})
export class RichMathTextComponent {
  @Input() set text(value: string) {
    this.segments = splitMath(value);
  }

  segments: Segment[] = [];
}
