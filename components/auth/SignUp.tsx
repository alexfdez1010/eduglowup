'use client';

import { Input, Link } from '@nextui-org/react';
import { register } from '@/lib/actions/user';
import InputPassword from '@/components/general/InputPassword';
import NextLink from 'next/link';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import SignGoogle from '@/components/auth/SignGoogle';
import { useState } from 'react';
import { Button } from '@nextui-org/button';
import { DividerSign } from '@/components/auth/DividerSign';
import EduGlowUpIcon from '@/components/headers/Logo';
import { useSearchParams } from 'next/navigation';

interface SignUpProps {
  localeDictionary: Record<string, string>;
}

const LinksSection = ({
  localeDictionary,
}: {
  localeDictionary: Record<string, string>;
}) => (
  <>
    <p className="text-sm text-center">
      {localeDictionary['already-registered']}{' '}
      <Link as={NextLink} className="text-sm" href={'/sign-in'}>
        {localeDictionary['sign-in']}
      </Link>
    </p>
    <p className="text-sm text-center">
      {localeDictionary['accept-terms']}{' '}
      <Link as={NextLink} className="text-sm" href={'/terms'}>
        {localeDictionary['terms']}
      </Link>
    </p>
  </>
);

export default function SignUp({ localeDictionary }: SignUpProps) {
  const [index, setIndex] = useState(0);

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  return (
    <div className="flex flex-col justify-between items-center p-2 sm:w-[400px] w-10/12 m-auto gap-5">
      <div className="self-start ml-1">
        <EduGlowUpIcon className="size-12" />
      </div>
      <h2 className="text-2xl font-bold">{localeDictionary['title']}</h2>
      {index === 0 && (
        <>
          <SignGoogle
            text={localeDictionary['sign-up-google']}
            redirectTo={redirectTo}
          />
          <DividerSign or={localeDictionary['or']} />
        </>
      )}
      <FormWithFeedbackManagement
        action={register}
        className="w-full flex flex-col justify-center items-center gap-4"
      >
        <input type="hidden" name="redirect" value={redirectTo} />
        <Input
          className="w-full"
          type="email"
          name="email"
          label={localeDictionary['email']}
          color="secondary"
          variant="faded"
          placeholder={localeDictionary['email-placeholder']}
        />
        {index === 0 ? (
          <>
            <LinksSection localeDictionary={localeDictionary} />
            <Button color="primary" onPress={() => setIndex(index + 1)}>
              {localeDictionary['title']}
            </Button>
          </>
        ) : (
          <>
            <Input
              type="text"
              name="name"
              label={localeDictionary['name']}
              color="secondary"
              variant="faded"
              placeholder={localeDictionary['name-placeholder']}
            />
            <InputPassword
              label={localeDictionary['password']}
              placeholder={localeDictionary['password-placeholder']}
            />
            <InputPassword
              name="passwordConfirmation"
              label={localeDictionary['password']}
              placeholder={localeDictionary['password-repeat']}
            />
            <LinksSection localeDictionary={localeDictionary} />
            <div className="w-full flex flex-row justify-center items-center gap-10">
              <Button
                color="primary"
                variant="ghost"
                onPress={() => setIndex(index - 1)}
              >
                {localeDictionary['return']}
              </Button>
              <ButtonWithSpinner isActive={true}>
                {localeDictionary['title']}
              </ButtonWithSpinner>
            </div>
          </>
        )}
      </FormWithFeedbackManagement>
    </div>
  );
}
