import { Button } from '@nextui-org/react';
import LinkedIn from '@/components/icons/LinkedIn';
import { useDictionary } from '@/components/hooks';

export default function LinkedinVerification() {
  const link = '/api/auth/linkedin';

  const dictionary = useDictionary('configuration');

  return (
    <Button
      as="a"
      href={link}
      color="primary"
      size="lg"
      startContent={<LinkedIn link={link} color="white" />}
    >
      <h2>{dictionary['linkedin-verification']}</h2>
    </Button>
  );
}
