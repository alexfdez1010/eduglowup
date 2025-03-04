import EduGlowUp from '@/components/headers/EduGlowUp';
import Logo from '@/components/headers/Logo';
import Link from 'next/link';

export default function Brand() {
  return (
    <div className="flex flex-row items-center gap-2">
      <Link href="/" aria-label="EduGlowUp">
        <Logo className="size-16 rounded-full p-1" />
      </Link>
      <Link className="text-3xl font-bold" href="/" aria-label="EduGlowUp">
        <EduGlowUp />
      </Link>
    </div>
  );
}
