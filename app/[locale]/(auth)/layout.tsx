import { Navbar, NavbarContent, NavbarItem } from '@nextui-org/navbar';
import React from 'react';
import { getDictionary } from '@/app/[locale]/dictionaries';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import HeaderNavigationMobile from '@/components/headers/HeaderNavigationMobile';
import { HeaderBrand } from '@/components/headers/HeaderCommon';
import HeaderNavigationComputer from '@/components/headers/HeaderNavigationComputer';
import HeaderSignIn from '@/components/headers/HeaderSignIn';
import { i18n } from '@/i18n-config';
import { LinkHeader } from '@/components/headers/link-header.interface';
import { GraduationCap, Home, Users } from 'lucide-react';
import ChangeUrlWebView from '@/components/general/ChangeUrlWebView';

export function generateStaticParams() {
  return i18n.locales.map((locale) => ({ params: { locale } }));
}

interface HeaderProps {
  localeDictionary: Record<string, string>;
}

export const dynamic = 'force-static';

async function Header({ localeDictionary }: HeaderProps) {
  const links: LinkHeader[] = [
    {
      link: '/',
      text: localeDictionary['home'],
      icon: <Home className="size-6" />,
    },
    {
      link: '/courses',
      text: localeDictionary['courses'],
      icon: <GraduationCap className="size-6" />,
    },
    {
      link: '/about',
      text: localeDictionary['about'],
      icon: <Users className="size-6" />,
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
        <NavbarItem>
          <ThemeSwitcher />
        </NavbarItem>
        <HeaderSignIn
          signInText={localeDictionary['sign-in']}
          signUpText={localeDictionary['sign-up']}
        />
      </NavbarContent>
    </Navbar>
  );
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <>
      <Header localeDictionary={getDictionary(params.locale)['header']} />
      <main className="flex flex-col justify-center items-center h-[80vh]">
        {children}
      </main>
      <ChangeUrlWebView />
    </>
  );
}
