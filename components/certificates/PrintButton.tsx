'use client';

import { Button } from '@nextui-org/react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  text: string;
}

export const PrintButton = ({ text }: PrintButtonProps) => {
  return (
    <Button
      color="primary"
      variant="ghost"
      startContent={<Printer />}
      onPress={() => window.print()}
    >
      {text}
    </Button>
  );
};
