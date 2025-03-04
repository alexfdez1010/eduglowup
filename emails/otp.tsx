import { getDictionary } from '@/app/[locale]/dictionaries';
import LayoutBase from '@/emails/layout/LayoutBase';
import { colors } from '@/common/colors';
import { Heading, Text, Link } from '@react-email/components';
import * as React from 'react';

interface OtpEmailProps {
  otp: string;
  dictionary: Record<string, string>;
  locale: string;
}

export default function OtpEmail({
  otp = '074356',
  dictionary = getDictionary('es')['email'],
  locale = 'es',
}: OtpEmailProps) {
  return (
    <LayoutBase preview={dictionary['otp-subject']} locale={locale}>
      <Heading as="h1" style={{ fontSize: '20px', color: '#333333' }}>
        <strong>{dictionary['otp']}</strong>
      </Heading>

      <Text style={{ fontSize: '16px', color: '#333333' }}>
        {dictionary['otp-explain']}
      </Text>
      <Text
        style={{
          fontSize: '28px',
          color: colors['500'],
          fontWeight: 'bold',
          alignSelf: 'center',
          width: '100%',
          textAlign: 'center',
        }}
      >
        {otp}
      </Text>

      <Text style={{ fontSize: '16px', color: '#333333' }}>
        {dictionary['otp-ignore']}
      </Text>

      <Text
        style={{
          fontSize: '14px',
          color: '#666666',
          marginBottom: '4px',
        }}
      >
        {dictionary['thanks']}
      </Text>
    </LayoutBase>
  );
}
