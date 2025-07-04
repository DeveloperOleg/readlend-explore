
import { enTranslations } from './en';
import { ruTranslations } from './ru';

export type Language = 'ru' | 'en';

export const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  ru: ruTranslations
};
