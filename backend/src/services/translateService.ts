import { SUPPORTED_LANGUAGES } from '../config/translate.js';

const TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY;
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2';

interface TranslationResult {
  translated: string | string[];
  detectedSourceLanguage?: string;
}

interface GoogleTranslateResponse {
  data: {
    translations: Array<{
      translatedText: string;
      detectedSourceLanguage?: string;
    }>;
  };
}

export async function translateText(
  text: string | string[],
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResult> {
  if (!TRANSLATE_API_KEY) {
    console.warn('GOOGLE_TRANSLATE_API_KEY not set, translation disabled');
    return {
      translated: text,
      detectedSourceLanguage: sourceLanguage,
    };
  }

  const texts = Array.isArray(text) ? text : [text];
  const translatedTexts: string[] = [];
  let detectedSourceLanguage: string | undefined;

  for (const t of texts) {
    try {
      const params = new URLSearchParams({
        key: TRANSLATE_API_KEY,
        q: t,
        target: targetLanguage,
        format: 'text',
      });

      if (sourceLanguage) {
        params.append('source', sourceLanguage);
      }

      const response = await fetch(`${TRANSLATE_API_URL}?${params.toString()}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Translation API error:', errorData);
        translatedTexts.push(t);
        continue;
      }

      const data: GoogleTranslateResponse = await response.json();
      const translation = data.data.translations[0];

      if (translation) {
        translatedTexts.push(translation.translatedText);
        detectedSourceLanguage = detectedSourceLanguage || translation.detectedSourceLanguage;
      } else {
        translatedTexts.push(t);
      }
    } catch (error) {
      console.error('Translation error:', error);
      translatedTexts.push(t);
    }
  }

  return {
    translated: Array.isArray(text) ? translatedTexts : translatedTexts[0] || '',
    detectedSourceLanguage,
  };
}

export async function detectLanguage(text: string): Promise<string> {
  if (!TRANSLATE_API_KEY) {
    return 'en';
  }

  try {
    const params = new URLSearchParams({
      key: TRANSLATE_API_KEY,
      q: text,
    });

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?${params.toString()}`,
      { method: 'POST' }
    );

    if (!response.ok) {
      return 'en';
    }

    const data = await response.json();
    return data.data.detections?.[0]?.[0]?.language || 'en';
  } catch {
    return 'en';
  }
}

export function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}
