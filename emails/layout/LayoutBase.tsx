import { colors } from '@/common/colors';
import { getImageUrl, getUrl } from '@/emails/utils';
import {
  Html,
  Head,
  Font,
  Body,
  Preview,
  Img,
  Container,
  Link,
  Text,
  Section,
} from '@react-email/components';

export default function LayoutBase({
  locale,
  preview,
  children,
}: {
  locale: string;
  preview: string;
  children: React.ReactNode;
}) {
  const logoUrl = getImageUrl('logo-with-name.png');

  return (
    <Html lang={locale}>
      <Head>
        <Font
          fontFamily="Montserrat"
          fallbackFontFamily="serif"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ textAlign: 'center', marginTop: '50px' }}>
        <Container
          style={{
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
          }}
        >
          <Link
            href={getUrl()}
            style={{
              display: 'flex',
              width: '100%',
              margin: '20px auto',
            }}
          >
            <Img
              src={logoUrl}
              width={200}
              style={{
                alignSelf: 'center',
              }}
            />
          </Link>
          <Section>{children}</Section>
          <Text
            style={{
              textAlign: 'center',
              width: '100%',
              backgroundColor: colors['500'],
              color: 'white',
              padding: '10px 0',
              fontWeight: 'bold',
            }}
          >
            © 2024 EduGlowUp
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
