'use client';

import { Card, CardBody, CardFooter, Button } from '@nextui-org/react';
import { CertificateDto } from '@/lib/dto/certificate.dto';
import Link from 'next/link';
import { useDictionary } from '@/components/hooks';

interface CertificateCardProps {
  certificate: CertificateDto;
}

export default function CertificateCard({ certificate }: CertificateCardProps) {
  const dictionary = useDictionary('certificate');

  return (
    <Card className="w-full max-w-sm bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 shadow-lg">
      <CardBody className="flex flex-col gap-4 p-6">
        <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200">
          {certificate.courseName}
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>
            {dictionary['completed-on']}:{' '}
            {certificate.dateOfCompletion.toLocaleDateString()}
          </p>
          <p>
            {dictionary['imparted-by']}: {certificate.instructorName}
          </p>
        </div>
      </CardBody>
      <CardFooter className="justify-end px-6 pb-6">
        <Button
          as={Link}
          href={`/certificate/${certificate.id}`}
          color="primary"
          variant="flat"
          className="font-semibold"
        >
          {dictionary['view-certificate']}
        </Button>
      </CardFooter>
    </Card>
  );
}
