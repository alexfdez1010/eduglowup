import { PulsatingButton } from '@/components/landing-page/PulsatingButton';
import AccordionScience from '@/components/science/AccordionScience';
import Link from 'next/link';

interface ScienceBehindProps {
  localeDictionary: Record<string, string>;
}

export default function ScienceBehind({
  localeDictionary,
}: ScienceBehindProps) {
  const scienceFacts = [
    {
      title: localeDictionary['active-recall'],
      explanation: localeDictionary['active-recall-explanation'],
    },
    {
      title: localeDictionary['gamification'],
      explanation: localeDictionary['gamification-explanation'],
    },
    {
      title: localeDictionary['pomodoro'],
      explanation: localeDictionary['pomodoro-explanation'],
    },
    {
      title: localeDictionary['spaced-learning'],
      explanation: localeDictionary['spaced-learning-explanation'],
    },
    {
      title: localeDictionary['dunning-kruger'],
      explanation: localeDictionary['dunning-kruger-explanation'],
    },
    {
      title: localeDictionary['practice-exams'],
      explanation: localeDictionary['practice-exams-explanation'],
    },
    {
      title: localeDictionary['distraction-elimination'],
      explanation: localeDictionary['distraction-elimination-explanation'],
    },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full md:w-[800px] mt-12 gap-10">
      <h2 className="text-4xl font-bold text-center my-5 w-11/12">
        {localeDictionary['title']}
      </h2>
      <div className="flex flex-wrap justify-center items-start gap-12 w-full">
        <AccordionScience scienceFacts={scienceFacts} />
      </div>
      <PulsatingButton className="max-w-lg">
        <Link href="/sign-up">{localeDictionary['cta']}</Link>
      </PulsatingButton>
    </div>
  );
}
