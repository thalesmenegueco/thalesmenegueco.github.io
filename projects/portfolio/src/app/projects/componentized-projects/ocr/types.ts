export interface OcrProgress {
  status: 'loading' | 'recognizing';
  progress: number;
}

export interface LanguageOption {
  code: string;
  label: string;
}

export interface TranslateRequest {
  source: string;
  target: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'pt', label: 'Português' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'de', label: 'Deutsch' },
];
