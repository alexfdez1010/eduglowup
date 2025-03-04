import { Button } from '@nextui-org/button';
import { Card } from '@nextui-org/card';
import { CardBody } from '@nextui-org/react';

interface AskTypicalQuestionsProps {
  typicalQuestions: string[];
  setText: (text: string) => void;
}

export default function AskTypicalQuestions({
  typicalQuestions,
  setText,
}: AskTypicalQuestionsProps) {
  return (
    <div className="flex flex-row flex-wrap justify-center items-center w-full gap-2">
      {typicalQuestions.map((question, index) => (
        <Card
          key={index}
          isPressable
          onPress={() => setText(question)}
          className="text-[0.5rem] max-w-72 h-fit w-fit bg-primary text-white"
        >
          <CardBody>
            <p className="text-center">{question}</p>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}
