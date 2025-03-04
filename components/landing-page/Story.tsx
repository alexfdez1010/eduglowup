interface StoryProps {
  localeDictionary: Record<string, string>;
}

export default function Story({ localeDictionary }: StoryProps) {
  const storyParagraphs = localeDictionary['story'].split('\n');

  return (
    <div className="flex flex-col justify-center items-center gap-5 md:w-[800px]">
      <h2 className="text-center font-bold text-xl">
        {localeDictionary['story-title']}
      </h2>
      <div className="flex flex-col gap-3">
        {storyParagraphs.map((paragraph: string, index: number) => (
          <p key={index} className="text-pretty">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
