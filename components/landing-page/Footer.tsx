import Instagram from '@/components/icons/Instagram';
import TikTok from '@/components/icons/TikTok';
import Twitter from '@/components/icons/Twitter';
import GitHub from '@/components/icons/GitHub';
import LinkedIn from '@/components/icons/LinkedIn';
import { Link } from '@nextui-org/link';
import NextLink from 'next/link';
import EduGlowUp from '@/components/headers/EduGlowUp';
import React from 'react';

interface FooterProps {
  localeDictionary: Record<string, string>;
}

export async function Footer({ localeDictionary }: FooterProps) {
  const today = new Date();

  const linksLeft = [
    {
      href: '/about',
      text: localeDictionary['about'],
    },
    {
      href: '/privacy',
      text: localeDictionary['privacy'],
    },
  ];

  const linksRight = [
    {
      href: '/terms',
      text: localeDictionary['terms'],
    },
    {
      href: '/cookies',
      text: localeDictionary['cookies'],
    },
  ];

  const socialIconColor = 'foreground';

  return (
    <footer className="flex flex-col justify-center items-center mt-10 print:hidden">
      <div className="flex flex-row justify-center items-center gap-5 mt-2">
        <Instagram
          link="https://www.instagram.com/eduglowup/"
          color={socialIconColor}
        />
        <TikTok
          link="https://www.tiktok.com/@eduglowup"
          color={socialIconColor}
        />
        <Twitter link="https://twitter.com/eduglowup" color={socialIconColor} />
        <GitHub link="https://github.com/eduglowup" color={socialIconColor} />
        <LinkedIn
          link="https://www.linkedin.com/company/eduglowup/"
          color={socialIconColor}
        />
      </div>
      <div className="flex flex-row justify-center items-center mt-4">
        <div className="flex flex-col justify-center items-center gap-2 flex-1 text-center">
          {linksLeft.map(({ href, text }) => (
            <Link
              as={NextLink}
              key={href}
              href={href}
              color="foreground"
              underline="always"
            >
              {text}
            </Link>
          ))}
        </div>
        <div className="flex flex-col justify-center items-center gap-2 flex-1 text-center">
          {linksRight.map(({ href, text }) => (
            <Link
              as={NextLink}
              key={href}
              href={href}
              color="foreground"
              underline="always"
            >
              {text}
            </Link>
          ))}
        </div>
      </div>
      <div className="my-3 text-center flex flex-col gap-2">
        <p>
          &copy; {today.getFullYear()} <EduGlowUp />.{' '}
          {localeDictionary['copyright']}
        </p>
        <p>{localeDictionary['made-in']}</p>
      </div>
    </footer>
  );
}
