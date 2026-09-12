import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent {
  @Input() text = '';
  @Input() disabled = false;
  @Output() textChange = new EventEmitter<string>();

  copyStatus: 'idle' | 'copied' | 'error' = 'idle';

  onTextChange(value: string): void {
    this.textChange.emit(value);
  }

  async copyText(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.text);
      this.copyStatus = 'copied';
      setTimeout(() => (this.copyStatus = 'idle'), 2000);
    } catch {
      this.copyStatus = 'error';
      setTimeout(() => (this.copyStatus = 'idle'), 2000);
    }
  }

  get charCount(): number {
    return this.text?.length ?? 0;
  }
}
