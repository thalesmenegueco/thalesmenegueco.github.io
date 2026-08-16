import { ChatMessage } from '../types';

export type LlmBackendKind = 'webgpu' | 'wasm' | 'cloud';

export type LlmMode = 'local' | 'online';

export interface BackendProgress {
  progressPercent: number;
  status: string;
}

export type TokenCallback = (token: string) => void;

export interface LlmBackend {
  readonly kind: LlmBackendKind;
  readonly activeModelLabel: string;
  initialize(onProgress: (progress: BackendProgress) => void): Promise<void>;
  generate(messages: ChatMessage[], onToken: TokenCallback): Promise<string>;
  dispose(): Promise<void>;
}

export const SYSTEM_PROMPT =
  'Você é um assistente útil, educado e conciso. Responda sempre em português do Brasil.';
