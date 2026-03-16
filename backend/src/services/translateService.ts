import { translationClient, parentPath } from '../config/translate.js';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const CACHE_TTL = 86400;

interface TranslationResult {
  translated: string | string[];
  detectedSourceLanguage?: string;
}

function getCacheKey(text: string, targetLanguage: string): string {
  const hash = Buffer.from(text).toString('base64').substring(0, 32);
  return `translate:${targetLanguage}:${hash}`;
}

export async function translateText(
  text: string | string[],
  targetLanguage: string,
  sourceLanguage?: string
): Promise<TranslationResult> {
  const texts = Array.isArray(text) ? text : [text];
  const translatedTexts: string[] = [];
  let detectedSourceLanguage: string | undefined;

  for (const t of texts) {
    const cacheKey = getCacheKey(t, targetLanguage);
    const cached = await redis.get(cacheKey);

    if (cached) {
      translatedTexts.push(cached);
      continue;
    }

    const [response] = await translationClient.translateText({
      parent: parentPath,
      contents: [t],
      mimeType: 'text/plain',
      sourceLanguageCode: sourceLanguage,
      targetLanguageCode: targetLanguage,
    });

    const translation = response.translations?.[0];
    const translatedText = translation?.translatedText || t;
    detectedSourceLanguage =
      detectedSourceLanguage || translation?.detectedLanguageCode || undefined;

    await redis.setex(cacheKey, CACHE_TTL, translatedText);
    translatedTexts.push(translatedText);
  }

  return {
    translated: Array.isArray(text) ? translatedTexts : translatedTexts[0] || '',
    detectedSourceLanguage,
  };
}

export async function detectLanguage(text: string): Promise<string> {
  const [response] = await translationClient.detectLanguage({
    parent: parentPath,
    content: text,
  });

  const detection = response.languages?.[0];
  return detection?.languageCode || 'en';
}

export async function clearTranslationCache(): Promise<void> {
  const keys = await redis.keys('translate:*');
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
