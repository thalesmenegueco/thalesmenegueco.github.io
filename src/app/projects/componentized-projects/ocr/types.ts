export interface OcrProgress {
  status: 'loading' | 'recognizing';
  progress: number;
}

export interface TranslateProgress {
  status: 'downloading' | 'translating';
  progress: number;
  modelSize?: string;
}

export interface LanguagePair {
  src: string;
  tgt: string;
  label: string;
}
