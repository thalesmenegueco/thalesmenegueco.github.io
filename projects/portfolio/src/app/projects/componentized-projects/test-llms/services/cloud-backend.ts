import { Injectable, Inject, InjectionToken } from '@angular/core';
import { ChatMessage } from '../types';
import { BackendProgress, LlmBackend, LlmBackendKind, SYSTEM_PROMPT } from './llm-backend';

export const CLOUD_WORKER_URL = 'https://test-llms.thales-menegueco.workers.dev';

export const CLOUD_WORKER_URL_TOKEN = new InjectionToken<string>('CLOUD_WORKER_URL_TOKEN', {
  factory: () => CLOUD_WORKER_URL,
});

export type CloudFetch = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

export const CLOUD_FETCH = new InjectionToken<CloudFetch>('CLOUD_FETCH', {
  factory: () => fetch.bind(globalThis),
});

const DONE_MARKER = '[DONE]';

@Injectable({ providedIn: 'root' })
export class CloudBackend implements LlmBackend {
  readonly kind: LlmBackendKind = 'cloud';
  readonly activeModelLabel = 'Llama 3.1 8B (Cloudflare)';

  private controller: AbortController | null = null;

  constructor(
    @Inject(CLOUD_WORKER_URL_TOKEN) private workerUrl: string,
    @Inject(CLOUD_FETCH) private fetchImpl: CloudFetch
  ) {}

  async initialize(onProgress: (progress: BackendProgress) => void): Promise<void> {
    onProgress({ progressPercent: 100, status: 'Online: pronto para conversar.' });
  }

  async generate(messages: ChatMessage[], onToken: (token: string) => void): Promise<string> {
    const conversation: ChatMessage[] = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];

    this.controller = new AbortController();

    let response: Response;
    try {
      response = await this.fetchImpl(this.workerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: conversation }),
        signal: this.controller.signal,
      });
    } catch (err) {
      throw this.toNetworkError(err);
    }

    if (!response.ok) {
      throw new Error(await this.readErrorMessage(response));
    }

    if (!response.body) {
      throw new Error('O serviço online retornou uma resposta vazia. Tente novamente.');
    }

    return this.readStream(response.body, onToken);
  }

  async dispose(): Promise<void> {
    this.controller?.abort();
    this.controller = null;
  }

  private async readStream(
    body: ReadableStream<Uint8Array>,
    onToken: (token: string) => void
  ): Promise<string> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    for (;;) {
      let result: ReadableStreamReadResult<Uint8Array>;
      try {
        result = await reader.read();
      } catch (err) {
        throw this.toNetworkError(err);
      }

      if (result.done) {
        break;
      }

      buffer += decoder.decode(result.value, { stream: true });

      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const event of events) {
        const token = this.parseEvent(event);
        if (token === DONE_MARKER) {
          return fullText;
        }
        if (token !== null) {
          fullText += token;
          onToken(token);
        }
      }
    }

    return fullText;
  }

  private parseEvent(event: string): string | null {
    for (const line of event.split('\n')) {
      if (!line.startsWith('data:')) {
        continue;
      }

      const payload = line.slice(5).trim();
      if (payload === DONE_MARKER) {
        return DONE_MARKER;
      }
      if (!payload) {
        continue;
      }

      try {
        const parsed = JSON.parse(payload) as { token?: string };
        return typeof parsed.token === 'string' ? parsed.token : null;
      } catch {
        return null;
      }
    }

    return null;
  }

  private async readErrorMessage(response: Response): Promise<string> {
    try {
      const text = await response.text();
      const parsed = JSON.parse(text) as { error?: string };
      if (parsed.error) {
        return parsed.error;
      }
      return text || `O serviço online respondeu com status ${response.status}.`;
    } catch {
      return `O serviço online respondeu com status ${response.status}.`;
    }
  }

  private toNetworkError(err: unknown): Error {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return new Error('A solicitação foi cancelada.');
    }
    return new Error('Não foi possível conectar ao serviço online. Verifique sua conexão.');
  }
}
