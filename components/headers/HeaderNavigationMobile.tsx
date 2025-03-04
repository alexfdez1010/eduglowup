'use client';

import {
  NavbarMenuItem,
  NavbarMenu,
  NavbarMenuToggle,
} from '@nextui-org/navbar';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useCurrentLocale } from 'next-i18n-router/client';
import { i18n } from '@/i18n-config';
import { LinkHeader } from '@/components/headers/link-header.interface';

interface HeaderNavigationProps {
  links: LinkHeader[];
}

export default function HeaderNavigationMobile({
  links,
}: HeaderNavigationProps) {
  const [_isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pathname = `${usePathname()}`;
  const locale = useCurrentLocale(i18n);

  const isActive = (link: string) =>
    pathname === `/${locale}${link !== '/' ? link : ''}`;

  return (
    <>
      <NavbarMenuToggle onChange={setIsMenuOpen} className="lg:hidden" />
      <NavbarMenu>
        {links.map((link) => (
          <NavbarMenuItem key={link.link}>
            <Link
              as={NextLink}
              href={link.link}
              color={isActive(link.link) ? 'primary' : 'foreground'}
              underline={isActive(link.link) ? 'always' : 'none'}
            >
              <span className="text-xl flex flex-row items-center gap-2">
                {link.icon} {link.text}
              </span>
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </>
  );
}
