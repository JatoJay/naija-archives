import { TranslationServiceClient } from '@google-cloud/translate';

const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = 'global';

export const translationClient = new TranslationServiceClient();

export const parentPath = `projects/${projectId}/locations/${location}`;

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'yo', name: 'Yoruba', native: 'Yorùbá' },
  { code: 'ig', name: 'Igbo', native: 'Igbo' },
  { code: 'ha', name: 'Hausa', native: 'Hausa' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
] as const;

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];
