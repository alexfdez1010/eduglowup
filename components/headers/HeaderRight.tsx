'use client';

import { NavbarItem } from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import React from 'react';
import HeaderSignIn from '@/components/headers/HeaderSignIn';
import { useUser } from '@/components/hooks';

interface HeaderLeftProps {
  signInText: string;
  signUpText: string;
}

export default function HeaderRight({
  signInText,
  signUpText,
}: HeaderLeftProps) {
  const user = useUser();

  if (user) {
    return (
      <NavbarItem>
        <Button as={Link} href="/app" color="primary">
          App
        </Button>
      </NavbarItem>
    );
  }

  return <HeaderSignIn signInText={signInText} signUpText={signUpText} />;
}
