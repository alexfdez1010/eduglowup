import { LinkHeader } from '@/components/headers/link-header.interface';
import { HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { Navbar, NavbarContent } from '@nextui-org/navbar';
import HeaderNavigationMobile from '@/components/headers/HeaderNavigationMobile';
import { HeaderBrand } from '@/components/headers/HeaderCommon';
import HeaderNavigationComputer from '@/components/headers/HeaderNavigationComputer';
import ThemeSwitcher from '@/components/theme/ThemeSwitcher';
import HeaderRight from '@/components/headers/HeaderRight';
import React from 'react';

interface HeaderProps {
  localeDictionary: Record<string, string>;
  links: LinkHeader[];
}

export default async function Header({ localeDictionary, links }: HeaderProps) {
  return (
    <Navbar maxWidth="full" isBordered={true} className="print:hidden">
      <NavbarContent justify="start">
        <HeaderNavigationMobile links={links} />
        <HeaderBrand />
      </NavbarContent>
      <HeaderNavigationComputer links={links} />
      <NavbarContent justify="end">
        <ThemeSwitcher />
        <HeaderRight
          signInText={localeDictionary['sign-in']}
          signUpText={localeDictionary['sign-up']}
        />
      </NavbarContent>
    </Navbar>
  );
}
