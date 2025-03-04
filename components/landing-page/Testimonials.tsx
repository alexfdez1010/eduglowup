import TestimonialCard, {
  TestimonialCardInterface,
} from '@/components/landing-page/TestimonialCard';
import { Marquee } from '@/components/landing-page/Marquee';

interface Testimonials {
  localeDictionary: Record<string, string>;
}

export default function Testimonials({ localeDictionary }: Testimonials) {
  const testimonials: TestimonialCardInterface[] = [
    {
      name: 'Arturo',
      occupation: localeDictionary['arturo-occupation'],
      image: '/images/testimonials/arturo.webp',
      testimonial: localeDictionary['arturo-testimonial'],
    },
    {
      name: 'Lorena',
      occupation: localeDictionary['lorena-occupation'],
      image: '/images/testimonials/lorena.webp',
      testimonial: localeDictionary['lorena-testimonial'],
    },
    {
      name: 'Andrés',
      occupation: localeDictionary['andres-occupation'],
      image: '/images/testimonials/andres.webp',
      testimonial: localeDictionary['andres-testimonial'],
    },
    {
      name: 'Rafa',
      occupation: localeDictionary['rafa-occupation'],
      image: '/images/testimonials/rafa.webp',
      testimonial: localeDictionary['rafa-testimonial'],
    },
    {
      name: 'Javi',
      occupation: localeDictionary['javi-occupation'],
      image: '/images/testimonials/javi.webp',
      testimonial: localeDictionary['javi-testimonial'],
    },
    {
      name: 'Mario',
      occupation: localeDictionary['mario-occupation'],
      image: '/images/testimonials/mario.webp',
      testimonial: localeDictionary['mario-testimonial'],
    },
  ];

  return (
    <>
      <h2 className="text-4xl font-bold text-center my-5 w-11/12">
        {localeDictionary['testimonials-title']}
      </h2>
      <div className="relative flex w-screen flex-col items-center justify-center overflow-hidden">
        <Marquee className="sm:[--duration:20s] [--duration:30s]">
          {testimonials.map((testimonial, indexTestimonial) => (
            <TestimonialCard
              key={`${indexTestimonial}`}
              name={testimonial.name}
              occupation={testimonial.occupation}
              image={testimonial.image}
              testimonial={testimonial.testimonial}
            />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 sm:w-1/3 w-1/6 bg-gradient-to-r from-white dark:from-background"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 sm:w-1/3 w-1/6 bg-gradient-to-l from-white dark:from-background"></div>
      </div>
    </>
  );
}
