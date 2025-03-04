import { NavbarItem } from '@nextui-org/navbar';
import { Button } from '@nextui-org/button';
import { Link } from '@nextui-org/link';
import React from 'react';

interface HeaderSignInProps {
  signInText: string;
  signUpText: string;
}

export default function HeaderSignIn({
  signInText,
  signUpText,
}: HeaderSignInProps) {
  return (
    <>
      <NavbarItem className="hidden md:block">
        <Button as={Link} href="/sign-in/" color="primary" variant="ghost">
          {signInText}
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button as={Link} href="/sign-up/" color="primary">
          {signUpText}
        </Button>
      </NavbarItem>
    </>
  );
}
