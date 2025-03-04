'use client';

import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { Input } from '@nextui-org/react';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import { askPasswordResetEmail } from '@/lib/actions/user';
import { useDictionary } from '@/components/hooks';

export default function ForgotPassword() {
  const dictionary = useDictionary('retrieve-password');

  return (
    <div className="flex flex-col justify-between items-center p-2 sm:w-[400px] w-10/12 m-auto gap-5">
      <h2 className="text-2xl font-bold mb-5">{dictionary['title']}</h2>
      <p>{dictionary['description']}</p>
      <p>{dictionary['time-limit']}</p>

      <FormWithFeedbackManagement
        action={askPasswordResetEmail}
        className="w-full flex flex-col justify-center items-center gap-4"
      >
        <Input
          type="email"
          name="email"
          label={dictionary['email']}
          color="secondary"
          variant="faded"
          placeholder={dictionary['email-placeholder']}
          data-cy="email-retrieve-password"
        />
        <ButtonWithSpinner isActive={true} dataCy="submit-retrieve-password">
          {dictionary['title']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
    </div>
  );
}
