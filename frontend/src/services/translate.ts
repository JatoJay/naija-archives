import api from './api';
import type { TranslateResponse, SupportedLanguage } from '@/types';

export async function translateText(
  text: string | string[],
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslateResponse> {
  const response = await api.post<TranslateResponse>('/translate', {
    text,
    targetLanguage,
    sourceLanguage,
  });
  return response.data;
}

export async function detectLanguage(
  text: string
): Promise<{ languageCode: string; languageName: string }> {
  const response = await api.post<{ languageCode: string; languageName: string }>(
    '/translate/detect',
    { text }
  );
  return response.data;
}

export async function getSupportedLanguages(): Promise<SupportedLanguage[]> {
  const response = await api.get<SupportedLanguage[]>('/translate/languages');
  return response.data;
}
