import Process, { ProcessItem } from '@/components/landing-page/Process';

interface ProcessProps {
  localeDictionary: Record<string, string>;
}

export default function Processes({ localeDictionary }: ProcessProps) {
  const processes: ProcessItem[] = [
    {
      title: localeDictionary['process-courses'],
      description: localeDictionary['process-courses-description'],
      mobileImage: '/images/landing/courses-mobile.webp',
      cta: localeDictionary['hero-button-register'],
    },
    {
      title: localeDictionary['process-exercises'],
      description: localeDictionary['process-exercises-description'],
      mobileImage: '/images/landing/exercises-mobile.webp',
      cta: localeDictionary['hero-button-register'],
      reverse: true,
    },
    {
      title: localeDictionary['process-rewards'],
      description: localeDictionary['process-rewards-description'],
      mobileImage: '/images/landing/rewards-mobile.webp',
      cta: localeDictionary['hero-button-register'],
    },
    {
      title: localeDictionary['process-summary'],
      description: localeDictionary['process-summary-description'],
      mobileImage: '/images/landing/summary-mobile.webp',
      cta: localeDictionary['hero-button-register'],
      reverse: true,
    },
    {
      title: localeDictionary['process-statistics'],
      description: localeDictionary['process-statistics-description'],
      mobileImage: '/images/landing/statistics-mobile.webp',
      cta: localeDictionary['hero-button-register'],
    },
    {
      title: localeDictionary['process-feedback'],
      description: localeDictionary['process-feedback-description'],
      mobileImage: '/images/landing/feedback-mobile.webp',
      cta: localeDictionary['hero-button-register'],
      reverse: true,
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center items-center gap-24">
      {processes.map((process, index) => (
        <Process {...process} key={index} />
      ))}
    </div>
  );
}
