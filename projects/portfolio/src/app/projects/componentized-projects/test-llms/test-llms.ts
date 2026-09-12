import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LlmService } from './services/llm.service';
import { LlmMode } from './services/llm-backend';
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
  mode: LlmMode;

  constructor(public llm: LlmService) {
    this.mode = this.llm.defaultMode;
  }

  get isOnline(): boolean {
    return this.mode === 'online';
  }

  get actionLabel(): string {
    return this.isOnline ? 'Conectar' : 'Baixar e Ativar IA';
  }

  get canRun(): boolean {
    return this.isOnline ? true : this.webGpuSupported === true || this.wasmSupported;
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

  async setMode(mode: LlmMode): Promise<void> {
    await this.llm.setMode(mode);
    this.mode = mode;
    this.clearChat();
  }

  async activate(): Promise<void> {
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

    const history = [...this.messages];
    const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
    this.messages.push(assistantMessage);

    try {
      const reply = await this.llm.generate(history, (token) => {
        assistantMessage.content += token;
      });
      assistantMessage.content = reply;
    } catch (err) {
      assistantMessage.content =
        err instanceof Error ? err.message : 'Falha ao gerar resposta. Tente novamente.';
    } finally {
      this.isGenerating = false;
    }
  }

  clearChat(): void {
    this.messages = [];
  }
}
