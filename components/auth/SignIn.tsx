'use client';

import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import { Input } from '@nextui-org/input';
import InputPassword from '@/components/general/InputPassword';
import { login } from '@/lib/actions/user';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import SignGoogle from '@/components/auth/SignGoogle';
import { DividerSign } from '@/components/auth/DividerSign';
import EduGlowUpIcon from '../headers/Logo';

interface SignInProps {
  localeDictionary: Record<string, string>;
}

export default function SignIn({ localeDictionary }: SignInProps) {
  return (
    <div className="flex flex-col justify-center items-center p-2 sm:w-[400px] w-10/12 gap-5">
      <div className="self-start ml-1">
        <EduGlowUpIcon className="size-12" />
      </div>
      <h2 className="text-2xl font-bold">{localeDictionary['title']}</h2>
      <SignGoogle text={localeDictionary['sign-in-google']} />
      <DividerSign or={localeDictionary['or']} />
      <FormWithFeedbackManagement
        action={login}
        className="flex flex-col justify-center items-center gap-4 w-full"
      >
        <Input
          type="email"
          name="email"
          label={localeDictionary['email']}
          color="secondary"
          variant="faded"
          placeholder={localeDictionary['email-placeholder']}
        />
        <InputPassword
          label={localeDictionary['password']}
          placeholder={localeDictionary['password-placeholder']}
        />
        <p className="text-sm text-center">
          {localeDictionary['not-registered']}{' '}
          <Link as={NextLink} className="text-sm" href={`/sign-up`}>
            {localeDictionary['register']}
          </Link>
        </p>
        <p className="text-sm text-center">
          {localeDictionary['forgot-password']}{' '}
          <Link as={NextLink} className="text-sm" href={`/retrieve-password`}>
            {localeDictionary['forgot-password-retrieve']}
          </Link>
        </p>
        <ButtonWithSpinner isActive={true} dataCy={'login-button'} size="lg">
          {localeDictionary['title']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
    </div>
  );
}
