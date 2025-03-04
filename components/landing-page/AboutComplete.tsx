import AboutUs from '@/components/landing-page/AboutUs';
import Story from '@/components/landing-page/Story';

interface AboutCompleteProps {
  localeDictionary: Record<string, string>;
}

export default function AboutComplete({
  localeDictionary,
}: AboutCompleteProps) {
  return (
    <div className="flex flex-col gap-8 mt-8 w-11/12 items-center">
      <h1 className="text-4xl font-bold text-center my-5">
        {localeDictionary['about-title']}
      </h1>
      <AboutUs localeDictionary={localeDictionary} />
      <Story localeDictionary={localeDictionary} />
    </div>
  );
}
