
import { enTranslations } from './en';
import { translations as ruTranslations } from './ru';

export type Language = 'ru' | 'en';

// Create a proper type for nested translation structure
export type TranslationStructure = Record<string, any>;

export const translations: Record<Language, TranslationStructure> = {
  en: enTranslations,
  ru: ruTranslations
};
