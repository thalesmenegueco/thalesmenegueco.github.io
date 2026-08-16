import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LlmService } from './services/llm.service';
import { ChatMessage } from './types';

@Component({
  selector: 'app-test-llms',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './test-llms.html',
  styleUrl: './test-llms.scss',
})
export class TestLlms implements OnInit, OnDestroy {
  messages: ChatMessage[] = [];
  userInput = '';
  isGenerating = false;
  webGpuSupported: boolean | null = null;
  wasmSupported = typeof WebAssembly !== 'undefined';

  constructor(public llm: LlmService) {}

  get canRun(): boolean {
    return this.webGpuSupported === true || this.wasmSupported;
  }

  get wasmHint(): string | null {
    if (this.llm.activeBackend !== 'wasm' || !this.llm.activeModel) {
      return null;
    }
    return this.llm.activeModel.includes('135M')
      ? 'Usando o modelo menor (135M) por causa de memória limitada.'
      : 'Rodando via WebAssembly (CPU) — mais lento que WebGPU.';
  }

  async ngOnInit(): Promise<void> {
    this.webGpuSupported = await this.llm.detectWebGpuSupport();
  }

  ngOnDestroy(): void {
    this.llm.dispose();
  }

  async downloadModel(): Promise<void> {
    try {
      await this.llm.initialize();
    } catch {
      // error message is stored in llm.errorMessage
    }
  }

  async send(): Promise<void> {
    const text = this.userInput.trim();
    if (!text || this.isGenerating || !this.llm.isReady) {
      return;
    }

    this.messages.push({ role: 'user', content: text });
    this.userInput = '';
    this.isGenerating = true;

    try {
      const reply = await this.llm.generate([...this.messages]);
      this.messages.push({ role: 'assistant', content: reply });
    } catch (err) {
      this.messages.push({
        role: 'assistant',
        content: err instanceof Error ? err.message : 'Falha ao gerar resposta. Tente novamente.',
      });
    } finally {
      this.isGenerating = false;
    }
  }

  clearChat(): void {
    this.messages = [];
  }
}
