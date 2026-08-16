import { Injectable, Inject, InjectionToken } from '@angular/core';
import { ChatMessage } from '../types';
import { BackendProgress, LlmBackend, LlmBackendKind, SYSTEM_PROMPT } from './llm-backend';
import { detectDevice } from './device';

export const WASM_MODEL_STANDARD = 'onnx-community/SmolLM2-360M-Instruct-ONNX';
export const WASM_MODEL_SMALL = 'onnx-community/SmolLM2-135M-Instruct-ONNX';

export type WasmWorkerFactory = () => Worker;

export const WASM_WORKER_FACTORY = new InjectionToken<WasmWorkerFactory>('WASM_WORKER_FACTORY', {
  factory: () => createWasmWorker,
});

function createWasmWorker(): Worker {
  return new Worker(new URL('../llm-wasm.worker', import.meta.url), { type: 'module' });
}

export type WasmModelDetector = () => string;

export const WASM_MODEL_DETECTOR = new InjectionToken<WasmModelDetector>('WASM_MODEL_DETECTOR', {
  factory: () => detectWasmModel,
});

function detectWasmModel(): string {
  const device = detectDevice();
  return device.isMobile || device.isLowMemory ? WASM_MODEL_SMALL : WASM_MODEL_STANDARD;
}

type WasmRequest =
  | { type: 'init'; modelId: string }
  | { type: 'generate'; messages: ChatMessage[] }
  | { type: 'dispose' };

type WasmResponse =
  | { type: 'progress'; progressPercent: number; status: string }
  | { type: 'ready'; modelId: string }
  | { type: 'result'; text: string }
  | { type: 'error'; message: string };

@Injectable({ providedIn: 'root' })
export class WasmBackend implements LlmBackend {
  readonly kind: LlmBackendKind = 'wasm';

  selectedModel: string | null = null;

  get activeModelLabel(): string {
    return this.selectedModel ?? '';
  }

  private worker: Worker | null = null;
  private ready = false;
  private progressHandler: ((progress: BackendProgress) => void) | null = null;
  private pending: {
    resolve: (response: WasmResponse) => void;
    reject: (err: Error) => void;
  } | null = null;

  constructor(
    @Inject(WASM_WORKER_FACTORY) private workerFactory: WasmWorkerFactory,
    @Inject(WASM_MODEL_DETECTOR) private modelDetector: WasmModelDetector
  ) {}

  async initialize(onProgress: (progress: BackendProgress) => void): Promise<void> {
    this.progressHandler = onProgress;
    this.selectedModel = this.modelDetector();

    this.worker = this.workerFactory();
    this.worker.onmessage = (event: MessageEvent): void => {
      this.handleMessage(event.data as WasmResponse);
    };
    this.worker.onerror = (event: ErrorEvent): void => {
      this.rejectPending(new Error(event.message || 'Falha no worker WASM.'));
    };

    const response = await this.request({ type: 'init', modelId: this.selectedModel });
    if (response.type !== 'ready') {
      throw new Error('Resposta inesperada do worker WASM.');
    }

    this.ready = true;
  }

  async generate(messages: ChatMessage[], onToken: (token: string) => void): Promise<string> {
    this.assertReady();

    const conversation: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];

    const response = await this.request({ type: 'generate', messages: conversation });
    if (response.type !== 'result') {
      throw new Error('Resposta inesperada do worker WASM.');
    }

    onToken(response.text);
    return response.text;
  }

  async dispose(): Promise<void> {
    if (this.worker) {
      try {
        this.worker.postMessage({ type: 'dispose' } satisfies WasmRequest);
      } catch {
        // ignore failures while tearing down
      }
      this.worker.terminate();
    }

    this.worker = null;
    this.ready = false;
    this.pending = null;
    this.selectedModel = null;
  }

  private request(request: WasmRequest): Promise<WasmResponse> {
    if (!this.worker) {
      return Promise.reject(new Error('Worker WASM não inicializado.'));
    }

    return new Promise<WasmResponse>((resolve, reject) => {
      this.pending = { resolve, reject };
      this.worker?.postMessage(request);
    });
  }

  private handleMessage(message: WasmResponse): void {
    if (message.type === 'progress') {
      this.progressHandler?.({
        progressPercent: message.progressPercent,
        status: message.status,
      });
      return;
    }

    if (message.type === 'error') {
      this.rejectPending(new Error(message.message));
      return;
    }

    if (message.type === 'ready' || message.type === 'result') {
      this.resolvePending(message);
    }
  }

  private resolvePending(response: WasmResponse): void {
    this.pending?.resolve(response);
    this.pending = null;
  }

  private rejectPending(err: Error): void {
    this.pending?.reject(err);
    this.pending = null;
  }

  private assertReady(): void {
    if (!this.ready || !this.worker) {
      throw new Error(
        'O modelo ainda não foi carregado. Clique em "Baixar e Ativar IA" primeiro.'
      );
    }
  }
}
