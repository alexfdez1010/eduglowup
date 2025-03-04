'use client';

import { Card } from '@nextui-org/card';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { Input } from '@nextui-org/react';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';

interface NewsletterProps {
  cardsStyles: string;
  dictionary: Record<string, string>;
}

export default function Newsletter({
  cardsStyles,
  dictionary,
}: NewsletterProps) {
  return (
    <Card className={`${cardsStyles} items-center`}>
      <p className="text-pretty">{dictionary['newsletter']}</p>
      <FormWithFeedbackManagement
        className="flex flex-col gap-8 w-full items-center mt-10"
        action={async () => {}}
      >
        <div className="flex flex-row w-full gap-5">
          <Input
            variant="faded"
            color="primary"
            label={dictionary['newsletter-name']}
            name={'name'}
          />
          <Input
            variant="faded"
            color="primary"
            label={dictionary['newsletter-email']}
            name={'email'}
          />
        </div>
        <ButtonWithSpinner isActive={true} color={'primary'} size="lg">
          {dictionary['newsletter-button']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
    </Card>
  );
}
