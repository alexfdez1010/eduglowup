import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
} from '@nextui-org/react';

interface ModalConfigurationProps {
  title: string;
  tabs: { name: string; content: React.ReactNode }[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function ModalConfiguration({
  title,
  tabs,
  isOpen,
  onOpenChange,
}: ModalConfigurationProps) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      scrollBehavior="inside"
    >
      <ModalContent className="md:h-[600px] h-screen p-1">
        <ModalHeader>
          <h1 className="text-2xl font-bold text-center">{title}</h1>
        </ModalHeader>

        <ModalBody className="flex justify-center items-center w-full">
          {tabs.length === 1 ? (
            tabs[0].content
          ) : (
            <Tabs
              color="primary"
              className="flex flex-col justify-start items-center"
              items={tabs}
              data-cy="configuration-tabs"
            >
              {tabs.map((tab) => (
                <Tab key={tab.name} title={tab.name} className="w-full">
                  {tab.content}
                </Tab>
              ))}
            </Tabs>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
