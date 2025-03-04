import Link from 'next/link';
import { NavbarBrand } from '@nextui-org/navbar';
import Logo from '@/components/headers/Logo';
import EduGlowUp from '@/components/headers/EduGlowUp';

export function HeaderBrand() {
  return (
    <NavbarBrand>
      <Link href="/" className="mr-4" aria-label="EduGlowUp">
        <Logo className="size-12 rounded-full p-1" />
      </Link>
      <Link
        className="md:block hidden text-2xl font-bold"
        href="/"
        aria-label="EduGlowUp"
      >
        <EduGlowUp />
      </Link>
    </NavbarBrand>
  );
}
