import { languageCodes } from '@/common/language';

type LanguageCode = (typeof languageCodes)[number];

const languageRecords: Record<LanguageCode, string[]> = {
  en: [
    'the',
    'be',
    'to',
    'of',
    'and',
    'a',
    'in',
    'that',
    'have',
    'i',
    'it',
    'for',
    'not',
    'on',
    'with',
    'he',
    'as',
    'you',
    'do',
    'at',
    'this',
    'but',
    'his',
    'by',
    'from',
    'they',
    'we',
    'say',
    'her',
    'she',
  ],
  es: [
    'de',
    'la',
    'que',
    'el',
    'en',
    'y',
    'a',
    'los',
    'del',
    'se',
    'las',
    'por',
    'un',
    'para',
    'con',
    'no',
    'una',
    'su',
    'al',
    'lo',
    'como',
    'más',
    'pero',
    'sus',
    'le',
    'ya',
    'o',
    'este',
    'sí',
    'porque',
  ],
};

export function predictLanguageFromText(text: string): LanguageCode {
  const words = text.toLowerCase().split(/\W+/);

  const languageCounts: Record<LanguageCode, number> = {
    es: 0,
    en: 0,
  };

  for (const [language, commonWords] of Object.entries(languageRecords)) {
    languageCounts[language] = words.reduce((count, word) => {
      return count + (commonWords.includes(word) ? 1 : 0);
    }, 0);
  }

  let detectedLanguage: LanguageCode = 'en';
  let maxCount = 0;

  for (const [language, count] of Object.entries(languageCounts)) {
    if (count > maxCount) {
      maxCount = count;
      detectedLanguage = language as LanguageCode;
    }
  }

  return detectedLanguage;
}
