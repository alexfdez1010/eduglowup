import { i18n } from '@/i18n-config';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { cookies } from 'next/headers';
import { en } from '@/dictionaries/en';

/**
 * This function returns the locale of the user from the cookies.
 * If the locale is not found, it returns the default locale.
 *
 * @returns locale
 */
export function getLocale(): string {
  const locale = cookies().get('NEXT_LOCALE');

  if (!locale) {
    return i18n.defaultLocale;
  }

  if (!i18n.locales.find((l) => l === locale.value)) {
    return i18n.defaultLocale;
  }

  return locale.value;
}

/**
 * This function returns the dictionary for a specific section
 * taking into account the locale. It should be used only in the
 * server actions.
 * @param key section key
 *
 * @returns dictionary
 */
export function getDictionaryInActions(
  key: keyof typeof en,
): Record<string, string> {
  const locale = getLocale();

  return getDictionary(locale)[key];
}

/**
 * This function returns the URL with the locale.
 * @param url URL
 *
 * @returns URL with locale
 */
export function urlWithLocale(url: string) {
  const locale = getLocale();

  return `/${locale}${url}`;
}
