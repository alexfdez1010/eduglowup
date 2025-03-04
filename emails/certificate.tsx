import { getDictionary } from '@/app/[locale]/dictionaries';
import { colors } from '@/common/colors';
import LayoutBase from '@/emails/layout/LayoutBase';
import { Button, Heading, Link, Text } from '@react-email/components';
import * as React from 'react';

interface CertificateEmailProps {
  courseName: string;
  link: string;
  locale: string;
  dictionary: Record<string, string>;
}

export default function CertificateEmail({
  courseName = '7 técnicas de comunicación efectivas',
  link = 'https://eduglowup.com',
  locale = 'es',
  dictionary = getDictionary('es')['email'],
}: CertificateEmailProps) {
  return (
    <LayoutBase
      preview={dictionary['certificate-subject'] + ' ' + courseName}
      locale={locale}
    >
      <Heading>
        {dictionary['congratulations']} {courseName}!
      </Heading>
      <Text>{dictionary['certificate-explanation']}</Text>
      <Button
        href={link}
        style={{
          background: colors['500'],
          color: 'white',
          fontWeight: 'semibold',
          padding: '12px 28px',
          display: 'block',
          alignSelf: 'center',
          width: 'fit-content',
          margin: '20px auto',
        }}
      >
        {dictionary['go-to-certificate']}
      </Button>
      <Link href={link} style={{ color: colors['500'], display: 'block' }}>
        {link}
      </Link>
    </LayoutBase>
  );
}
