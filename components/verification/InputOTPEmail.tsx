'use client';

import * as React from 'react';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/general/InputOTP';
import { useRouter } from 'next/navigation';
import { useDictionary } from '@/components/hooks';

export function InputOTPEmail() {
  const maxLength = 6;

  const dictionary = useDictionary('verification');

  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState('');

  const router = useRouter();

  const handleChange = async (value: string) => {
    setValue(value);

    if (value.length === maxLength) {
      await fetch('/api/verification', {
        method: 'POST',
        body: JSON.stringify({ code: value }),
      }).then((response) => {
        if (response.ok) {
          router.push('app');
        } else {
          setError(dictionary['error-otp']);
        }
      });
    }
  };

  return (
    <div className="space-y-2">
      <InputOTP
        maxLength={maxLength}
        value={value}
        onChange={handleChange}
        name="code"
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      {error !== '' && (
        <div className="text-center text-sm text-danger">{error}</div>
      )}
    </div>
  );
}
