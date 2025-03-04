import { Button } from '@nextui-org/react';
import { Card, CardFooter, CardHeader, CardBody } from '@nextui-org/card';
import React from 'react';
import FeatureItem from '@/components/pricing/FeatureItem';
import NextLink from 'next/link';

interface PricingCardProps {
  title: string;
  description: string;
  price: string;
  priceSuffix: string;
  features: string[];
  discount?: string;
  buttonText: string;
  buttonLink: string;
  isPrimary?: boolean;
}

export default function PricingCard({
  title,
  description,
  price,
  priceSuffix,
  features,
  discount,
  buttonText,
  buttonLink,
  isPrimary = false,
}: PricingCardProps) {
  return (
    <Card className="p-3">
      <CardHeader className="flex flex-col items-start justify-center">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {description}
        </p>
      </CardHeader>
      <CardBody className="flex-grow">
        {discount ? (
          <div className="flex flex-row items-start justify-start gap-2 mb-6">
            <p className="text-xl line-through">{price}€ </p>
            <p className="text-xl font-bold">
              {discount}€{' '}
              <span className="text-sm font-normal">{priceSuffix}</span>
            </p>
          </div>
        ) : (
          <p className="text-xl font-bold mb-6">
            {price}€ <span className="text-sm font-normal">{priceSuffix}</span>
          </p>
        )}
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <FeatureItem key={index}>{feature}</FeatureItem>
          ))}
        </ul>
      </CardBody>
      <CardFooter>
        <Button
          className="w-full"
          color="primary"
          variant={isPrimary ? 'solid' : 'ghost'}
          as={NextLink}
          href={buttonLink}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
