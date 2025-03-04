import { Card, CardBody, CardHeader } from '@nextui-org/card';
import {
  ExperimentDto,
  ExperimentWithIdDto,
  UserAssignmentWithResultDto,
  VariantDto,
  VariantWithFullDataDto,
} from '@/lib/dto/experiment.dto';
import { Button } from '@nextui-org/button';
import ModalWrapper from '@/components/modal/ModalWrapper';
import { ModalHeader } from '@nextui-org/react';
import {
  Modal,
  ModalBody,
  ModalContent,
  useDisclosure,
} from '@nextui-org/modal';
import Ask from '@/components/chat/Ask';
import { useState } from 'react';
import { getTestsAB, getVariantsTestsAB } from '@/lib/actions/dashboard';
import { useLaunchModal } from '@/components/modal/use-launch-modal';

interface TestABStatCardProps {
  test: ExperimentWithIdDto;
}

export default function TestABStatCard({ test }: TestABStatCardProps) {
  const launchModal = useLaunchModal();

  const [variantData, setVariantData] = useState<VariantWithFullDataDto[]>([]);

  const getVariants = async () => {
    //Get data from the server
    getVariantsTestsAB(test.id).then((results) => {
      if (results.isError) {
        return;
      }
      setVariantData(results.variants);
    });

    launchModal(`test-${test.id}`);
  };

  return (
    <Card className="w-full h-fit p-4 md:w-[300px] md:h-[400px]">
      <CardHeader>
        <h3 className="text-xl font-bold">{test.name}</h3>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 justify-center items-center">
        <p>Description: {test.description}</p>
        <p>Start date: {test.startDate?.toLocaleDateString()}</p>
        <p>End date: {test.endDate?.toLocaleDateString()}</p>
        <p>Metric: {test.metric}</p>
        <Button onPress={getVariants} color="primary">
          Details
        </Button>
        <ModalWrapper
          keyModal={`test-${test.id}`}
          title={test.name}
          content={
            <div className="">
              <div className="flex flex-wrap gap-2 justify-center items-center pb-4">
                {variantData.map((variant, index) => (
                  <Card key={index} className="h-fit p-4 w-58">
                    <CardHeader>
                      <h3 className="text-xl font-bold">{variant.name}</h3>
                    </CardHeader>
                    <CardBody>
                      <p className="text-medium">
                        {variant.probability * 100} %
                      </p>
                      <p className="text-medium">Results: {variant.results}</p>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
          }
        />
      </CardBody>
    </Card>
  );
}
