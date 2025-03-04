import { i18n } from '@/i18n-config';
import { es } from '@/dictionaries/es';
import { en } from '@/dictionaries/en';

export const dictionaries = {
  en: en,
  es: es,
};

export function getDictionary(
  locale: string,
): Record<string, Record<string, string>> {
  if (!locale) return dictionaries[i18n.defaultLocale];
  return dictionaries[locale];
}
