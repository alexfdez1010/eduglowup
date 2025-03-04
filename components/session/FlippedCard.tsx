import { CardBody } from '@nextui-org/react';
import { Card } from '@nextui-org/card';
import MarkdownComplete from '@/components/general/MarkdownComplete';

interface FlippedCardProps {
  isFlipped: boolean;
  front: string;
  back: string;
  flip: () => void;
}

export default function FlippedCard({
  isFlipped,
  front,
  back,
  flip,
}: FlippedCardProps) {
  const content = isFlipped ? back : front;

  return (
    <Card
      isPressable
      disableAnimation
      onPress={flip}
      className="flex flex-col gap-5 justify-center items-start sm:w-[600px] h-48 sm:h-64 md:h-72 w-full p-4"
    >
      <CardBody className="flex flex-col justify-center items-center w-full">
        <MarkdownComplete
          text={content}
          className="sm:prose-base prose-sm prose-zinc"
        />
      </CardBody>
    </Card>
  );
}
