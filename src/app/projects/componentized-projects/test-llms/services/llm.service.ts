import { Injectable, Inject, InjectionToken } from '@angular/core';
import { ChatMessage } from '../types';
import { LlmBackend, LlmBackendKind } from './llm-backend';
import { WebGpuBackend } from './webgpu-backend';
import { WasmBackend } from './wasm-backend';

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

function isWebGpuUnavailableError(err: unknown): boolean {
  const message = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
  return (
    message.includes('WebGPUNotAvailableError') || message.includes('WebGPUNotFoundError')
  );
}

@Injectable({ providedIn: 'root' })
export class LlmService {
  status = '';
  progressPercent = 0;
  isReady = false;
  errorMessage: string | null = null;
  activeBackend: LlmBackendKind | null = null;
  activeModel: string | null = null;

  private backend: LlmBackend | null = null;

  constructor(
    @Inject(WEBGPU_DETECTOR) private webGpuDetector: WebGpuDetector,
    private webGpuBackend: WebGpuBackend,
    private wasmBackend: WasmBackend
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
    this.activeModel = null;

    const useWebGpu = await this.webGpuDetector();

    try {
      if (useWebGpu) {
        try {
          await this.initializeBackend(this.webGpuBackend);
        } catch (err) {
          if (!isWebGpuUnavailableError(err)) {
            throw err;
          }

          await this.webGpuBackend.dispose();
          this.status = 'WebGPU indisponível. Alternando para WebAssembly (CPU)...';
          await this.initializeBackend(this.wasmBackend);
        }
      } else {
        await this.initializeBackend(this.wasmBackend);
      }

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
    if (!this.isReady || !this.backend) {
      throw new Error(
        'O modelo ainda não foi carregado. Clique em "Baixar e Ativar IA" primeiro.'
      );
    }

    return this.backend.generate(messages);
  }

  async dispose(): Promise<void> {
    await this.webGpuBackend.dispose();
    await this.wasmBackend.dispose();

    this.backend = null;
    this.activeBackend = null;
    this.activeModel = null;
    this.isReady = false;
    this.progressPercent = 0;
    this.status = '';
    this.errorMessage = null;
  }

  private async initializeBackend(backend: LlmBackend): Promise<void> {
    this.backend = backend;
    this.activeBackend = backend.kind;

    await backend.initialize((progress) => {
      this.progressPercent = progress.progressPercent;
      this.status = progress.status;
    });

    if (backend.kind === 'wasm') {
      this.activeModel = this.wasmBackend.selectedModel;
    }
  }

  private toFriendlyError(err: unknown): string {
    if (err instanceof Error) {
      return `Falha ao carregar o modelo: ${err.message}`;
    }
    return 'Falha ao carregar o modelo. Verifique sua conexão e tente novamente.';
  }
}
