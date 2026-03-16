import { Request, Response, NextFunction } from 'express';
import { translateText, detectLanguage } from '../services/translateService.js';
import { SUPPORTED_LANGUAGES } from '../config/translate.js';

export async function translate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { text, targetLanguage, sourceLanguage } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    if (!targetLanguage) {
      res.status(400).json({ error: 'Target language is required' });
      return;
    }

    const validLanguage = SUPPORTED_LANGUAGES.some((l) => l.code === targetLanguage);
    if (!validLanguage) {
      res.status(400).json({
        error: 'Unsupported target language',
        supportedLanguages: SUPPORTED_LANGUAGES,
      });
      return;
    }

    const result = await translateText(text, targetLanguage, sourceLanguage);

    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function detect(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { text } = req.body;

    if (!text) {
      res.status(400).json({ error: 'Text is required' });
      return;
    }

    const languageCode = await detectLanguage(text);

    const language = SUPPORTED_LANGUAGES.find((l) => l.code === languageCode);

    res.json({
      languageCode,
      languageName: language?.name || 'Unknown',
    });
  } catch (error) {
    next(error);
  }
}

export function getSupportedLanguages(
  _req: Request,
  res: Response
): void {
  res.json(SUPPORTED_LANGUAGES);
}
