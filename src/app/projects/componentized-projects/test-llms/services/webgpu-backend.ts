import { Injectable, Inject, InjectionToken } from '@angular/core';
import {
  ChatCompletionMessageParam,
  CreateWebWorkerMLCEngine,
  InitProgressReport,
  MLCEngineInterface,
} from '@mlc-ai/web-llm';
import { ChatMessage } from '../types';
import { BackendProgress, LlmBackend, LlmBackendKind, SYSTEM_PROMPT } from './llm-backend';

export const MODEL_ID = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

export type LlmEngineFactory = (
  modelId: string,
  initProgressCallback: (report: InitProgressReport) => void
) => Promise<MLCEngineInterface>;

export const LLM_ENGINE_FACTORY = new InjectionToken<LlmEngineFactory>('LLM_ENGINE_FACTORY', {
  factory: () => createWorkerEngine,
});

function createWorkerEngine(
  modelId: string,
  initProgressCallback: (report: InitProgressReport) => void
): Promise<MLCEngineInterface> {
  const worker = new Worker(new URL('../llm.worker', import.meta.url), { type: 'module' });
  return CreateWebWorkerMLCEngine(worker, modelId, { initProgressCallback });
}

function toStatusText(text: string): string {
  if (text.startsWith('Loading model from url')) {
    return 'Baixando modelo...';
  }
  if (text.startsWith('Loading model from cache')) {
    return 'Carregando modelo do cache...';
  }
  if (text.startsWith('Loading GPU shader modules')) {
    return 'Carregando shaders da GPU...';
  }
  if (text.startsWith('Fetching param cache')) {
    return 'Buscando cache de parâmetros...';
  }
  if (text.startsWith('Creating WebGPU device')) {
    return 'Inicializando WebGPU...';
  }
  if (text.startsWith('Initializing the model')) {
    return 'Inicializando o modelo...';
  }
  return text;
}

@Injectable({ providedIn: 'root' })
export class WebGpuBackend implements LlmBackend {
  readonly kind: LlmBackendKind = 'webgpu';

  private engine: MLCEngineInterface | null = null;

  constructor(@Inject(LLM_ENGINE_FACTORY) private engineFactory: LlmEngineFactory) {}

  async initialize(onProgress: (progress: BackendProgress) => void): Promise<void> {
    this.engine = await this.engineFactory(MODEL_ID, (report) => {
      onProgress({
        progressPercent: Math.round(report.progress * 100),
        status: toStatusText(report.text),
      });
    });
  }

  async generate(messages: ChatMessage[]): Promise<string> {
    if (!this.engine) {
      throw new Error(
        'O modelo ainda não foi carregado. Clique em "Baixar e Ativar IA" primeiro.'
      );
    }

    const chatMessages: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(
        (message) => ({ role: message.role, content: message.content }) as ChatCompletionMessageParam
      ),
    ];

    const reply = await this.engine.chat.completions.create({ messages: chatMessages });
    const content = reply.choices[0]?.message?.content ?? '';

    if (!content) {
      throw new Error('O modelo retornou uma resposta vazia. Tente novamente.');
    }

    return content;
  }

  async dispose(): Promise<void> {
    if (this.engine) {
      try {
        await this.engine.unload();
      } catch {
        // ignore failures while tearing down
      }
    }

    this.engine = null;
  }
}
