'use client';

import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider } from 'next-themes';
import React from 'react';
import { useRouter } from 'next/navigation';

interface ProvidersClientProps {
  children: React.ReactNode;
  locale: string;
}

export function ProvidersClient({ children, locale }: ProvidersClientProps) {
  const countryCodes = {
    en: 'en-US',
    es: 'es-ES',
  };

  const router = useRouter();

  return (
    <NextUIProvider locale={countryCodes[locale]} navigate={router.push}>
      <ThemeProvider attribute="class">{children}</ThemeProvider>
    </NextUIProvider>
  );
}
