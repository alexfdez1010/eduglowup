'use client';

import { Modal, ModalBody, ModalContent } from '@nextui-org/modal';
import { ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Button } from '@nextui-org/button';
import TestABFormCreation from '@/components/dashboard/test-ab/TestABFormCreation';
import { useEffect, useState } from 'react';
import { ExperimentDto, ExperimentWithIdDto } from '@/lib/dto/experiment.dto';
import { getTestsAB } from '@/lib/actions/dashboard';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import TestABStatCard from '@/components/dashboard/test-ab/TestABStatCard';
import Title from '@/components/general/Title';

export default function TestAB() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [tests, setTests] = useState<ExperimentWithIdDto[]>([]);

  useEffect(() => {
    getTestsAB().then((result) => {
      if (result.isError) return;
      setTests(result.tests);
    });
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-12">
      <Title title="Test AB" />
      <Button onPress={onOpen} color="primary" size="lg">
        New test
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>Test AB</ModalHeader>
          <ModalBody>
            <TestABFormCreation />
          </ModalBody>
          <ModalFooter>
            <Button onPress={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
        {tests.map((test, index) => (
          <TestABStatCard key={index} test={test} />
        ))}
      </div>
    </div>
  );
}
