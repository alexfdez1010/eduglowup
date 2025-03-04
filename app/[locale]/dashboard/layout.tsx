import React from 'react';
import { Navbar, NavbarContent } from '@nextui-org/navbar';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import ConfigButtonServerWrapper from '@/components/configuration/ConfigButtonServerWrapper';
import HeaderNavigationMobile from '@/components/headers/HeaderNavigationMobile';
import { HeaderBrand } from '@/components/headers/HeaderCommon';
import { notFound } from 'next/navigation';
import { guardService } from '@/lib/services/guard-service';
import { GraduationCap, Home, TestTubes, Users } from 'lucide-react';
import { LinkHeader } from '@/components/headers/link-header.interface';
import HeaderNavigationComputer from '@/components/headers/HeaderNavigationComputer';

async function Header() {
  const links: LinkHeader[] = [
    {
      link: '/dashboard',
      text: 'Overview',
      icon: <Home className="size-6" />,
    },
    {
      link: '/dashboard/users',
      text: 'Users',
      icon: <Users className="size-6" />,
    },
    {
      link: '/dashboard/test-ab',
      text: 'Test AB',
      icon: <TestTubes className="size-6" />,
    }
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
      </NavbarContent>
    </Navbar>
  );
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const isAdmin = await guardService.isAdminUser();

  if (!isAdmin) {
    notFound();
  }

  return (
    <>
      <Header />
      <main className="h-full w-full max-w-4xl flex flex-col justify-center items-start my-12 gap-12 mx-auto">
        {children}
      </main>
    </>
  );
}
