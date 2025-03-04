import { dateToString } from '@/lib/utils/date';
import { UUID } from '@/lib/uuid';

export function fakeString(
  minLength: number = 5,
  maxLength: number = 10000,
): string {
  const length =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  return Array(length)
    .fill('')
    .map(() => String.fromCharCode(Math.floor(Math.random() * 26) + 97))
    .join('');
}

export function fakeStringWithSpaces(
  minLength: number = 1,
  maxLength: number = 10000,
): string {
  return fakeArrayString(minLength, maxLength).join(' ');
}

export function fakeName(): string {
  return fakeString(1, 10);
}

export function fakeEmail(): string {
  return `${fakeName()}@${fakeName()}.com`;
}

export function fakePassword(maxLength: number = 10): string {
  return Array(maxLength)
    .fill('')
    .map(() => String.fromCharCode(Math.floor(Math.random() * 10) + 48))
    .join('');
}

export function fakeBoolean(): boolean {
  return Math.random() > 0.5;
}

export function fakeInt(min: number = 0, max: number = 100): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function fakeLanguage(): string {
  return Math.random() > 0.5 ? 'en' : 'es';
}

export function fakeArrayString(min: number = 1, max: number = 10): string[] {
  return Array(fakeInt(min, max))
    .fill('')
    .map(() => fakeName());
}

export function fakeUuid(): string {
  return UUID.generate();
}

export function fakeFromArray<T>(array: T[]): T {
  return array[fakeInt(0, array.length - 1)];
}

export function fakeUrl(): string {
  return `https://example.com/${fakeUuid()}`;
}

export function fakeRecordStrings(
  min: number = 1,
  max: number = 10,
): Record<string, string> {
  return Object.fromEntries(
    Array(fakeInt(min, max))
      .fill('')
      .map(() => [fakeName(), fakeName()]),
  );
}

export function fakeArray<T>(
  factory: () => T,
  min: number = 1,
  max: number = 10,
): T[] {
  return Array(fakeInt(min, max))
    .fill('')
    .map(() => factory());
}

export function fakeDate(
  min: Date = new Date(2023, 0, 1),
  max: Date = new Date(),
): Date {
  return new Date(fakeInt(min.getTime(), max.getTime()));
}

export function fakeDateString(
  min: Date = new Date(2023, 0, 1),
  max: Date = new Date(),
): string {
  return dateToString(fakeDate(min, max));
}

export function fakeOptionalArray<T>(
  factory: () => T,
  min: number = 1,
  max: number = 10,
): T[] {
  return fakeArray(factory, min, max).filter((_) => fakeBoolean());
}

export function fakeOptionalFromArray<T>(array: T[]) {
  return array.filter((_) => fakeBoolean());
}
