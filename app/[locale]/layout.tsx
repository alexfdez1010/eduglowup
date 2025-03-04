import '../globals.css';

import React from 'react';
import { ToastContainerWrapper } from '@/components/ToastContainerWrapper';
import { i18n, Locale } from '@/i18n-config';
import { notFound } from 'next/navigation';
import { ProvidersClient } from '@/app/[locale]/providers-client';
import Analytics from '@/components/analytics/Analytics';
import Banner from '@/components/analytics/Banner';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { Montserrat } from 'next/font/google';
import { cn } from '@/components/utils';
import { ViewportLayout } from 'next/dist/lib/metadata/types/extra-types';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
});

export function generateMetadata({ params }) {
  const dictionary = getDictionary(params.locale)['home'];

  return {
    title: `EduGlowUp - ${dictionary['hero-title']}`,
    description: dictionary['hero-subtitle'],
    openGraph: {
      type: 'website',
      url: `https://eduglowup.com/${params.locale}`,
    },
  };
}

export const viewport: ViewportLayout = {
  width: 'device-width',
  initialScale: 1,
  interactiveWidget: 'resizes-content',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale as string;

  if (!i18n.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      className={cn(
        'text-foreground bg-background h-full antialiased',
        montserrat.className,
      )}
      suppressHydrationWarning
    >
      <body className="h-full">
        {process.env.DOMAIN !== 'http://localhost:3000' && <Analytics />}
        <ProvidersClient locale={locale}>
          {children}
          <ToastContainerWrapper />
          <Banner />
        </ProvidersClient>
      </body>
    </html>
  );
}
