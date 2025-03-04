import { PulsatingButton } from '@/components/landing-page/PulsatingButton';
import Link from 'next/link';
import EduGlowUp from '@/components/headers/EduGlowUp';
import Image from 'next/image';
import { Button } from '@nextui-org/react';
import { ArrowRight, Play } from 'lucide-react';

import NextLink from 'next/link';

interface HeroProps {
  localeDictionary: Record<string, string>;
}

export default function Hero({ localeDictionary }: HeroProps) {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center w-full gap-5 mt-12">
      <div className="z-10 flex flex-col items-center md:items-start gap-8 px-4 max-w-2xl w-full md:w-1/2 md:pr-8">
        <h1 className="text-4xl font-bold text-primary text-center">
          {localeDictionary['hero-title']}
        </h1>
        <h2 className="md:text-left text-center text-foreground font-semibold text-xl">
          <EduGlowUp /> {localeDictionary['hero-subtitle']}
        </h2>
        <div className="flex flex-row justify-center items-center w-full gap-5">
          <Button
            variant="ghost"
            color="primary"
            className="mr-2"
            as={NextLink}
            href="/sign-up"
            radius="full"
          >
            {localeDictionary['hero-button-register']}
          </Button>
          <Button
            as={NextLink}
            variant="solid"
            color="primary"
            endContent={<ArrowRight className="size-5" />}
            href="/courses"
            radius="full"
          >
            {localeDictionary['hero-button-learn']}
          </Button>
        </div>
      </div>
      <Image
        src="/images/landing/hero.webp"
        alt="Hero"
        height={600}
        width={600}
        objectFit="cover"
        quality={100}
        priority
      />
    </div>
  );
}
