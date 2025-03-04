import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import { Button } from '@nextui-org/button';
import { useDictionary, useUrl } from '@/components/hooks';
import { useRouter } from 'next/navigation';
import ModalWrapper from '@/components/modal/ModalWrapper';

export default function NotLoggedDialog() {
  const redirectTo = useUrl();
  const url = `/sign-up?redirect=${redirectTo}`;

  const dictionary = useDictionary('not-logged');

  const router = useRouter();

  const handleSignUp = () => {
    router.push(url);
  };

  return (
    <ModalWrapper
      keyModal="not-logged"
      title={dictionary['title']}
      content={
        <div className="flex flex-col justify-center items-center gap-5 min-h-200 h-full w-full">
          <p className="text-center">{dictionary['description']}</p>
          <Button color="primary" variant="solid" onPress={handleSignUp}>
            {dictionary['sign-up']}
          </Button>
        </div>
      }
    />
  );
}
