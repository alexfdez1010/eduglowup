import React from 'react';
import PricingCard from '@/components/pricing/PricingCard';
import { LocalePageProps } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { formatPrice } from '@/components/utils';
import { testABService } from '@/lib/services/testab-service';

export default async function PricingPage({ params }: LocalePageProps) {
  const dictionary = getDictionary(params.locale)['pricing'];
  const locale = params.locale;

  const userAssignment = await testABService.getUserAssignment('pricing');

  let pricing: number;

  if (!userAssignment) {
    pricing = 5;
  } else {
    switch (userAssignment.variantName) {
      case '5€':
        pricing = 5;
        break;
      case '10€':
        pricing = 10;
        break;
      case '15€':
        pricing = 15;
        break;
      case '20€':
        pricing = 20;
        break;
    }
  }

  const plans = [
    {
      title: dictionary['free-plan'],
      description: dictionary['free-plan-description'],
      price: formatPrice(0, locale),
      priceSuffix: '',
      features: dictionary['free-plan-features']
        .split('\n')
        .filter((feature) => feature !== ''),
      buttonText: dictionary['free-plan-button'],
      buttonLink: '/app',
      isPrimary: false,
    },
    {
      title: dictionary['premium-plan'],
      description: dictionary['premium-plan-description'],
      price: formatPrice(2 * pricing - 0.01, locale),
      priceSuffix: dictionary['month'],
      features: dictionary['premium-plan-features']
        .split('\n')
        .filter((feature) => feature !== ''),
      discount: formatPrice(pricing - 0.01, locale),
      buttonText: dictionary['premium-plan-button'],
      buttonLink: '/app/pricing/premium',
      isPrimary: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-2">
        {dictionary['title']}
      </h1>
      <h2 className="text-2xl font-bold text-center mb-12 text-primary">
        {dictionary['subtitle']}
      </h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan, index) => (
          <PricingCard
            key={index}
            title={plan.title}
            description={plan.description}
            price={plan.price}
            priceSuffix={plan.priceSuffix}
            features={plan.features}
            discount={plan.discount}
            buttonText={plan.buttonText}
            buttonLink={plan.buttonLink}
            isPrimary={plan.isPrimary}
          />
        ))}
      </div>
    </div>
  );
}
