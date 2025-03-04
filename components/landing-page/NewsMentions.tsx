import { Marquee } from '@/components/landing-page/Marquee';
import Image from 'next/image';
import Title from '../general/Title';

interface NewsLogo {
  name: string;
  logo: string;
  url: string;
}

interface NewsMentionsProps {
  localeDictionary: Record<string, string>;
}

export default function NewsMentions({ localeDictionary }: NewsMentionsProps) {
  const newsLogos: NewsLogo[] = [
    {
      name: 'El Economista',
      logo: '/images/news/economista.svg',
      url: 'https://www.eleconomista.es/telecomunicaciones/noticias/13094994/11/24/eduglowup-la-apuesta-educativa-de-un-grupo-de-antiguos-estudios-estudiantes-de-la-universidad-de-extremadura-que-revolucionara-el-estudio.html',
    },
    {
      name: 'El Periódico Extremadura',
      logo: '/images/news/periodico.png',
      url: 'https://www.elperiodicoextremadura.com/comunicaciones-empresas/2024/11/21/eduglowup-nueva-herramienta-educativa-revoluciona-111894601.html',
    },
    {
      name: 'Region Digital',
      logo: '/images/news/region-digital.svg',
      url: 'https://www.regiondigital.com/noticias/juventud/403165-antiguos-estudiantes-uex-lanzan-eduglowup-una-aplicacion-para-revolucionar-el-estudio.html',
    },
    {
      name: 'UEX - Cultura científica',
      logo: '/images/news/uex.png',
      url: 'https://cultura-cientifica.unex.es/2024/11/14/antiguos-estudiantes-de-la-uex-lanzan-eduglowup-una-aplicacion-para-revolucionar-el-estudio/',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-8 py-10">
      <Title title={localeDictionary['news-mentions-title']} />
      <div className="relative flex w-screen flex-col items-center justify-center overflow-hidden">
        <Marquee className="gap-32 sm:[--duration:20s] [--duration:30s]">
          {newsLogos.map((news, index) => (
            <a
              key={index}
              href={news.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-64 h-24 opacity-70 hover:opacity-100 transition-opacity mx-12 bg-white p-2 flex flex-col justify-center items-center rounded-2xl"
            >
              <Image
                src={news.logo}
                alt={news.name}
                width={256}
                height={96}
                className="object-contain"
              />
            </a>
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 sm:w-1/3 w-1/8 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 sm:w-1/3 w-1/8 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </div>
  );
}
