import { HeaderBrand } from '@/components/headers/HeaderCommon';
import React from 'react';
import { Navbar, NavbarContent } from '@nextui-org/navbar';
import ConfigButtonServerWrapper from '@/components/configuration/ConfigButtonServerWrapper';
import HeaderNavigationMobile from '@/components/headers/HeaderNavigationMobile';
import HeaderNavigationComputer from '@/components/headers/HeaderNavigationComputer';
import { getDictionary } from '@/app/[locale]/dictionaries';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import { LinkHeader } from '@/components/headers/link-header.interface';
import { authProvider } from '@/lib/providers/auth-provider';
import { redirect } from 'next/navigation';
import TimeTracker from '@/components/general/TimeTracker';
import BackButton from '@/components/headers/BackButton';
import FAQsButton from '@/components/headers/FAQsButton';
import { MermaidProvider } from '@/components/mermaid/MermaidProvider';
import { FileText, GraduationCap, PenTool, Trophy } from 'lucide-react';

interface HeaderProps {
  localeDictionary: Record<string, Record<string, string>>;
}

async function Header({ localeDictionary }: HeaderProps) {
  const links: LinkHeader[] = [
    {
      link: '/app',
      text: localeDictionary['header-app']['courses'],
      icon: <GraduationCap className="size-6" />,
    },
    {
      link: '/app/contents',
      text: localeDictionary['header-app']['contents'],
      icon: <FileText className="size-6" />,
    },
    {
      link: '/app/create',
      text: localeDictionary['header-app']['create'],
      icon: <PenTool className="size-6" />,
    },
    {
      link: '/app/competition',
      text: localeDictionary['header-app']['competition'],
      icon: <Trophy className="size-6" />,
    },
  ];

  return (
    <Navbar maxWidth="full" isBordered={true}>
      <NavbarContent justify="start">
        <HeaderNavigationMobile links={links} />
        <HeaderBrand />
      </NavbarContent>
      <HeaderNavigationComputer links={links} />
      <NavbarContent justify="end">
        <ThemeSwitcher />
        <FAQsButton />
        <ConfigButtonServerWrapper />
      </NavbarContent>
    </Navbar>
  );
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const user = await authProvider.getUser();

  if (user && !user.isVerified) {
    redirect('/verification');
  }

  return (
    <>
      <Header localeDictionary={getDictionary(params.locale)} />
      <BackButton />
      <main className="flex flex-col items-center justify-start min-h-[80%] w-11/12 max-w-6xl mx-auto sm:mt-24 mt-12 gap-6">
        {children}
      </main>
      <TimeTracker />
      <MermaidProvider />
    </>
  );
}
