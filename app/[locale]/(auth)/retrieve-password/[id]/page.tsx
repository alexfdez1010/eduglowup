'use server';

import { LocalePagePropsWithId } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import { Input } from '@nextui-org/react';
import { resetPassword } from '@/lib/actions/user';
import { passwordRecoveryService } from '@/lib/services/password-recovery';
import { notFound } from 'next/navigation';

export default async function RetrievePassword({
  params,
}: LocalePagePropsWithId) {
  const tokenFromLink = params.id;
  const user =
    await passwordRecoveryService.getUserByPasswordToken(tokenFromLink);

  if (user === null) {
    notFound();
  }

  const dictionary = getDictionary(params.locale)['retrieve-password'];

  return (
    <FormWithFeedbackManagement
      action={resetPassword}
      className="w-11/12 md:w-96 flex flex-col justify-center items-center gap-4"
    >
      <Input
        type="email"
        label={dictionary['email']}
        color="secondary"
        variant="faded"
        value={user.email}
        readOnly
      />
      <input type="hidden" name="token" value={tokenFromLink} />
      <Input
        type="password"
        name="newPassword"
        label={dictionary['new-password']}
        color="secondary"
        variant="faded"
        placeholder={dictionary['new-password-placeholder']}
      />
      <Input
        type="password"
        name="newPasswordConfirmation"
        label={dictionary['repeat-new-password']}
        color="secondary"
        variant="faded"
        placeholder={dictionary['repeat-new-password-placeholder']}
      />
      <ButtonWithSpinner isActive={true}>
        {dictionary['update-password']}
      </ButtonWithSpinner>
    </FormWithFeedbackManagement>
  );
}
