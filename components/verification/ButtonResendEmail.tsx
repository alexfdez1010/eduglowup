'use client';

import { useDictionary } from '@/components/hooks';
import { Button } from '@nextui-org/button';
import { useState } from 'react';
import { cn } from '@/components/utils';

export default function ButtonResendEmail() {
  const dictionary = useDictionary('verification');

  const [message, setMessage] = useState({ isError: false, message: '' });
  const [loading, setLoading] = useState(false);

  const handleResendEmail = async () => {
    setLoading(true);
    await fetch('/api/verification/resend', {
      method: 'POST',
    }).then((response) => {
      if (response.ok) {
        setMessage({ isError: false, message: dictionary['email-resent'] });
      } else {
        setMessage({ isError: true, message: dictionary['wait-otp'] });
      }
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 w-full">
      <Button
        color="primary"
        variant="ghost"
        onPress={handleResendEmail}
        isLoading={loading}
      >
        {dictionary['resend-email']}
      </Button>
      {message.message !== '' && (
        <div
          className={cn(
            'text-sm text-center',
            message.isError ? 'text-danger' : 'text-success',
          )}
        >
          {message.message}
        </div>
      )}
    </div>
  );
}
