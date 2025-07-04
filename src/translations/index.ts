
import { enTranslations } from './en';
import { translations as ruTranslations } from './ru';

export type Language = 'ru' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  ru: ruTranslations
};
