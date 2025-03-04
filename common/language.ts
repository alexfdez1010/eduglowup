export const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
] as const;

export const languageCodes = languages.map((lang) => lang.value);
export type LanguageCode = (typeof languageCodes)[number];

export function getLanguageLabel(code: string): string {
  return languages.find((lang) => lang.value === code)?.label || code;
}

export function getAllLanguagesLabels(): string[] {
  return languages.map((lang) => lang.label);
}
