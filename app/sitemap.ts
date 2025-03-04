import { MetadataRoute } from 'next';
import { i18n } from '@/i18n-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eduglowup.com';

  const pages = [
    '',
    'about',
    'opositores',
    'opositores/about',
    'sign-in',
    'sign-up',
    'privacy',
    'terms',
    'cookies',
  ];

  const locales = i18n.locales;
  const defaultLocale = i18n.defaultLocale;

  return pages.map((page) => {
    const pagePath = page ? `/${page}` : '';
    const pageUrl = `${baseUrl}/${defaultLocale}${pagePath}`;

    const alternatesLanguages = locales.reduce<Record<string, string>>(
      (acc, locale) => {
        const localePath = page ? `/${locale}${pagePath}` : `/${locale}`;
        acc[locale] = `${baseUrl}${localePath}`;
        return acc;
      },
      {},
    );

    return {
      url: pageUrl,
      lastModified: new Date(),
      priority: 0.7,
      alternates: {
        languages: alternatesLanguages,
      },
    };
  });
}
