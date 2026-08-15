import { Injectable, Inject, InjectionToken } from '@angular/core';
import {
  ChatCompletionMessageParam,
  CreateWebWorkerMLCEngine,
  InitProgressReport,
  MLCEngineInterface,
} from '@mlc-ai/web-llm';
import { ChatMessage } from '../types';

export const MODEL_ID = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

const SYSTEM_PROMPT =
  'Você é um assistente útil, educado e conciso. Responda sempre em português do Brasil.';

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

export type WebGpuDetector = () => Promise<boolean>;

type WebGpuApi = {
  gpu?: { requestAdapter(): Promise<object | null> };
};

function detectWebGpuAdapter(): Promise<boolean> {
  if (typeof navigator === 'undefined') {
    return Promise.resolve(false);
  }

  const gpu = (navigator as WebGpuApi).gpu;
  if (!gpu) {
    return Promise.resolve(false);
  }

  return gpu
    .requestAdapter()
    .then((adapter) => adapter !== null)
    .catch(() => false);
}

export const WEBGPU_DETECTOR = new InjectionToken<WebGpuDetector>('WEBGPU_DETECTOR', {
  factory: () => detectWebGpuAdapter,
});

@Injectable({ providedIn: 'root' })
export class LlmService {
  status = '';
  progressPercent = 0;
  isReady = false;
  errorMessage: string | null = null;

  private engine: MLCEngineInterface | null = null;

  constructor(
    @Inject(LLM_ENGINE_FACTORY) private engineFactory: LlmEngineFactory,
    @Inject(WEBGPU_DETECTOR) private webGpuDetector: WebGpuDetector
  ) {}

  detectWebGpuSupport(): Promise<boolean> {
    return this.webGpuDetector();
  }

  async initialize(): Promise<void> {
    if (this.isReady) {
      return;
    }

    this.errorMessage = null;
    this.progressPercent = 0;
    this.status = 'Iniciando...';

    try {
      this.engine = await this.engineFactory(MODEL_ID, (report) => {
        this.progressPercent = Math.round(report.progress * 100);
        this.status = this.toStatusText(report.text);
      });
      this.isReady = true;
      this.progressPercent = 100;
      this.status = 'Modelo carregado. Pode conversar!';
    } catch (err) {
      this.isReady = false;
      this.errorMessage = this.toFriendlyError(err);
      throw err;
    }
  }

  async generate(messages: ChatMessage[]): Promise<string> {
    if (!this.isReady || !this.engine) {
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
    this.isReady = false;
    this.progressPercent = 0;
    this.status = '';
    this.errorMessage = null;
  }

  private toStatusText(text: string): string {
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

  private toFriendlyError(err: unknown): string {
    if (err instanceof Error) {
      return `Falha ao carregar o modelo: ${err.message}`;
    }
    return 'Falha ao carregar o modelo. Verifique sua conexão e tente novamente.';
  }
}
