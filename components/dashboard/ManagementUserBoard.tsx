import { useEffect } from 'react';
import { ModalHeader, useDisclosure } from '@nextui-org/modal';
import { Input, Modal, ModalBody, ModalContent } from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import { GearIcon } from '@radix-ui/react-icons';
import { UserDto } from '@/lib/dto/user.dto';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import { updateMoney } from '@/lib/actions/user';

interface ManagementUserBoardProps {
  user: UserDto;
}

export default function ManagementUserBoard({
  user,
}: ManagementUserBoardProps) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {}, []);

  return (
    <>
      <Button onPress={onOpen} variant="ghost" color="primary" isIconOnly>
        <GearIcon className="size-5" />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          <ModalHeader>
            <h2 className="text-2xl font-bold text-center mb-2">
              Management user
            </h2>
          </ModalHeader>
          <ModalBody className="flex flex-col justify-center items-center gap-5 w-full">
            <h3 className="text-xl font-bold mb-4">User data</h3>
            <Input
              type="text"
              label="Username"
              readOnly
              value={user?.name}
              color="secondary"
              variant="faded"
            />
            <Input
              type="email"
              readOnly
              label="Email"
              value={user?.email}
              color="secondary"
              variant="faded"
            />

            <FormWithFeedbackManagement
              action={updateMoney}
              className="flex flex-col justify-center items-center gap-4 w-full"
            >
              <input type="hidden" name="userId" value={user?.id} />
              <Input
                type="number"
                name="money"
                label="Diamonds"
                color="secondary"
                variant="faded"
                defaultValue={user?.money.toString() || '0'}
              />
              <ButtonWithSpinner isActive={true}>
                Update diamonds
              </ButtonWithSpinner>
            </FormWithFeedbackManagement>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
