import { cookies } from 'next/headers';
import { i18n } from '@/i18n-config';
import { en } from '@/dictionaries/en';
import { getDictionary } from '@/app/[locale]/dictionaries';

export class TranslationProvider {
  getDictionaryInServer(key: keyof typeof en): Record<string, string> {
    const locale = this.getLocale();

    return getDictionary(locale)[key];
  }

  getLocale(): string {
    const locale = cookies().get('NEXT_LOCALE');

    if (!locale) {
      return i18n.defaultLocale;
    }

    if (!i18n.locales.find((l) => l === locale.value)) {
      return i18n.defaultLocale;
    }

    return locale.value;
  }
}

export const translationProvider = new TranslationProvider();
