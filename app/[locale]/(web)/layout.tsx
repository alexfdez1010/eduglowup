import { getDictionary } from '@/app/[locale]/dictionaries';
import React from 'react';
import { i18n } from '@/i18n-config';
import { LinkHeader } from '@/components/headers/link-header.interface';
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Header from '@/components/landing-page/Header';
import { Footer } from '@/components/landing-page/Footer';

import { GraduationCap, Home, Users } from 'lucide-react';
import BackButton from '@/components/headers/BackButton';

export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ params: { locale } }));
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const headerDictionary = getDictionary(params.locale)['header'];
  const footerDictionary = getDictionary(params.locale)['footer'];

  const links: LinkHeader[] = [
    {
      link: '/',
      text: headerDictionary['home'],
      icon: <Home className="size-6" />,
    },
    {
      link: '/courses',
      text: headerDictionary['courses'],
      icon: <GraduationCap className="size-6" />,
    },
    {
      link: '/about',
      text: headerDictionary['about'],
      icon: <Users className="size-6" />,
    },
  ];

  return (
    <>
      <Header localeDictionary={headerDictionary} links={links} />
      <BackButton />
      <main className="flex flex-col items-center justify-start">
        {children}
      </main>
      <Footer localeDictionary={footerDictionary} />
    </>
  );
}
