'use client';

import { Button } from '@nextui-org/button';
import { useDictionary } from '@/components/hooks';
import { useDisclosure } from '@nextui-org/react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import ModalConfiguration from '@/components/configuration/ModalConfiguration';
import FAQs from '@/components/landing-page/FAQs';
import { faqsFromText } from '@/components/landing-page/utils';
import { CircleHelp } from 'lucide-react';
import { useLaunchModal } from '@/components/modal/use-launch-modal';

export default function FAQsButton() {
  const dictionary = useDictionary('faqs');

  const launchModal = useLaunchModal();

  return (
    <>
      <Button
        color="primary"
        variant="light"
        size="lg"
        onPress={() => launchModal('faqs')}
        isIconOnly
        radius="full"
        aria-label={dictionary['title']}
      >
        <CircleHelp className="size-6" />
      </Button>
    </>
  );
}
