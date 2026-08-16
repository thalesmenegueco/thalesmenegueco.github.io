import { ChatMessage } from '../types';

export type LlmBackendKind = 'webgpu' | 'wasm';

export interface BackendProgress {
  progressPercent: number;
  status: string;
}

export interface LlmBackend {
  readonly kind: LlmBackendKind;
  initialize(onProgress: (progress: BackendProgress) => void): Promise<void>;
  generate(messages: ChatMessage[]): Promise<string>;
  dispose(): Promise<void>;
}

export const SYSTEM_PROMPT =
  'Você é um assistente útil, educado e conciso. Responda sempre em português do Brasil.';
