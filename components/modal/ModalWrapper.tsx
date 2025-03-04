'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ReactNode, useEffect, useRef } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import { useDisclosure } from '@nextui-org/react';
import { useIsMobile } from '@/components/hooks';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/general/Drawer';

export interface ModalProps {
  keyModal: string;
  title: string;
  content: ReactNode;
  notScrollToTop?: boolean;
  size?:
    | '2xl'
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | 'full';
}

export default function ModalWrapper({
  keyModal,
  title,
  content,
  notScrollToTop,
  size,
}: ModalProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modal = searchParams.get('modal');
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const ref = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  useEffect(() => {
    if (notScrollToTop) {
      return;
    }

    if (isOpen && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, notScrollToTop]);

  useEffect(() => {
    if (modal === keyModal) {
      onOpen();
    }
  }, [modal, keyModal, onOpen]);

  const handleClose = () => {
    onClose();
    router.back();
  };

  if (isMobile) {
    return (
      <Drawer
        open={isOpen}
        onOpenChange={onOpenChange}
        onClose={handleClose}
        repositionInputs={false}
      >
        <DrawerContent className="w-full max-h-[90dvh] h-fit py-0">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-center">
              {title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="w-11/12 mx-auto overflow-y-auto mb-5">
            <div ref={ref} />
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size={size || '2xl'}
      scrollBehavior="inside"
      onClose={handleClose}
      className="p-2"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-2xl font-bold text-center">{title}</h2>
        </ModalHeader>
        <ModalBody className="flex flex-col justify-center items-center">
          <div ref={ref} />
          {content}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
