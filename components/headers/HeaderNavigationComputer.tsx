'use client';

import { NavbarContent, NavbarItem } from '@nextui-org/navbar';
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

export default function HeaderNavigationComputer({
  links,
}: HeaderNavigationProps) {
  const [_isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pathname = `${usePathname()}`;
  const locale = useCurrentLocale(i18n);

  const isActive = (link: string) =>
    pathname === `/${locale}${link !== '/' ? link : ''}`;

  return (
    <NavbarContent className="hidden lg:flex flex-row" justify="center">
      {links.map((link) => (
        <NavbarItem key={link.link}>
          <Link
            as={NextLink}
            href={link.link}
            color={isActive(link.link) ? 'primary' : 'foreground'}
            underline={isActive(link.link) ? 'always' : 'none'}
          >
            <span className="text-base flex flex-row items-center gap-1">
              {link.icon}
              {link.text}
            </span>
          </Link>
        </NavbarItem>
      ))}
    </NavbarContent>
  );
}
