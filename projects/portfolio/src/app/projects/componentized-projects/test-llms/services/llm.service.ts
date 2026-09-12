import { Injectable, Inject, InjectionToken } from '@angular/core';
import { ChatMessage } from '../types';
import { LlmBackend, LlmBackendKind, LlmMode } from './llm-backend';
import { WebGpuBackend } from './webgpu-backend';
import { WasmBackend } from './wasm-backend';
import { CloudBackend } from './cloud-backend';
import { detectDevice } from './device';

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

  isMobile: boolean;
  mode: LlmMode;

  private backend: LlmBackend | null = null;

  constructor(
    @Inject(WEBGPU_DETECTOR) private webGpuDetector: WebGpuDetector,
    private webGpuBackend: WebGpuBackend,
    private wasmBackend: WasmBackend,
    private cloudBackend: CloudBackend
  ) {
    this.isMobile = detectDevice().isMobile;
    this.mode = this.defaultMode;
  }

  get defaultMode(): LlmMode {
    return this.isMobile ? 'online' : 'local';
  }

  detectWebGpuSupport(): Promise<boolean> {
    return this.webGpuDetector();
  }

  async setMode(mode: LlmMode): Promise<void> {
    if (this.mode === mode) {
      return;
    }

    await this.dispose();
    this.mode = mode;
  }

  async initialize(): Promise<void> {
    if (this.isReady) {
      return;
    }

    this.errorMessage = null;
    this.progressPercent = 0;
    this.status = 'Iniciando...';
    this.activeModel = null;

    try {
      if (this.mode === 'online') {
        await this.initializeBackend(this.cloudBackend);
      } else {
        const useWebGpu = await this.webGpuDetector();

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
      }

      this.isReady = true;
      this.progressPercent = 100;
      this.status =
        this.mode === 'online' ? 'Online: pronto para conversar.' : 'Modelo carregado. Pode conversar!';
    } catch (err) {
      this.isReady = false;
      this.errorMessage = this.toFriendlyError(err);
      throw err;
    }
  }

  async generate(messages: ChatMessage[], onToken: (token: string) => void): Promise<string> {
    if (!this.isReady || !this.backend) {
      throw new Error(
        this.mode === 'online'
          ? 'O modo online ainda não foi ativado. Clique em "Conectar" primeiro.'
          : 'O modelo ainda não foi carregado. Clique em "Baixar e Ativar IA" primeiro.'
      );
    }

    return this.backend.generate(messages, onToken);
  }

  async dispose(): Promise<void> {
    await this.webGpuBackend.dispose();
    await this.wasmBackend.dispose();
    await this.cloudBackend.dispose();

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

    this.activeModel = backend.activeModelLabel;
  }

  private toFriendlyError(err: unknown): string {
    if (this.mode === 'online') {
      return err instanceof Error
        ? err.message
        : 'Não foi possível conectar ao serviço online. Verifique sua conexão.';
    }

    if (err instanceof Error) {
      return `Falha ao carregar o modelo: ${err.message}`;
    }

    return 'Falha ao carregar o modelo. Verifique sua conexão e tente novamente.';
  }
}
