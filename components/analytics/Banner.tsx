'use client';

import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import { Button } from '@nextui-org/button';
import { analyticsConsent, ConsentValue } from '@/components/analytics/consent';
import { Checkbox } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import { useDictionary } from '@/components/hooks';

export const COOKIE_CONSENT_NAME = 'analytics_consent';

export default function Banner() {
  const cookie = getCookie(COOKIE_CONSENT_NAME);

  const [isOpen, setIsOpen] = useState(false);

  const [analyticsCheckbox, setAnalyticsCheckbox] = useState(
    cookie ? cookie === 'granted' : false,
  );

  useEffect(() => {
    if (!cookie) {
      setIsOpen(true);
    } else {
      analyticsConsent(cookie as ConsentValue);
    }
  }, [cookie]);

  const handleSelection = (consentValue: ConsentValue) => {
    analyticsConsent(consentValue);
    setCookie(COOKIE_CONSENT_NAME, consentValue, {
      maxAge: 365 * 24 * 60 * 60,
    });
    setIsOpen(false);
  };

  const acceptCookies = () => {
    handleSelection('granted');
  };

  const saveCookies = () => {
    const consentValue = analyticsCheckbox ? 'granted' : 'denied';
    handleSelection(consentValue);
  };

  const dictionary = useDictionary('cookie-banner');

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed sm:bottom-2 sm:right-2 bottom-0 right-0 z-50 flex flex-row justify-center
                  items-center bg-background sm:w-[500px] w-full h-48 p-6 rounded-xl shadow-2xl"
    >
      <div className="flex flex-col justify-center items-center gap-2 w-full">
        <p className="text-pretty text-sm">
          {dictionary['description']}{' '}
          <Link href="/privacy" as={NextLink} size="sm">
            {dictionary['privacy-policy']}
          </Link>{' '}
          &{' '}
          <Link href="/cookies" as={NextLink} size="sm">
            {dictionary['cookie-policy']}
          </Link>{' '}
          {dictionary['more-information']}
        </p>
        <div className="flex flex-row justify-center items-start gap-5 self-start">
          <Checkbox radius="full" isDisabled size="sm" defaultSelected>
            {dictionary['necessary']}
          </Checkbox>
          <Checkbox
            radius="full"
            size="sm"
            isSelected={analyticsCheckbox}
            onValueChange={(value) => setAnalyticsCheckbox(value)}
          >
            {dictionary['analytics']}
          </Checkbox>
        </div>
        <div className="flex flex-row justify-center items-center gap-5">
          <Button
            onPress={saveCookies}
            variant="ghost"
            color="primary"
            size="sm"
          >
            {dictionary['save-current-settings']}
          </Button>
          <Button
            onPress={acceptCookies}
            variant="solid"
            color="primary"
            size="sm"
          >
            {dictionary['accept-all']}
          </Button>
        </div>
      </div>
    </div>
  );
}
