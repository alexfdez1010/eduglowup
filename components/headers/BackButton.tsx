'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';
import { ArrowLeft } from 'lucide-react';
import { useDictionary, useLocale } from '@/components/hooks';
import { Tooltip } from '@nextui-org/react';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const dictionary = useDictionary('header-app');

  const handlePress = () => {
    router.back();
  };

  if (pathname === `/${locale}/app` || pathname === `/${locale}`) {
    return null;
  }

  return (
    <Tooltip
      content={dictionary['back']}
      showArrow
      placement="right"
      className="print:hidden"
    >
      <Button
        variant="light"
        color="default"
        radius="full"
        onPress={handlePress}
        isIconOnly
        className="fixed top-20 sm:left-4 left-1 z-[10] print:hidden"
        aria-label={dictionary['back']}
      >
        <ArrowLeft className="size-6 self-center" />
      </Button>
    </Tooltip>
  );
}
