'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import { useFormStatus } from 'react-dom';

interface ButtonWithSpinnerProps {
  children: React.ReactNode;
  isActive: boolean;
  variant?:
    | 'solid'
    | 'bordered'
    | 'light'
    | 'flat'
    | 'faded'
    | 'shadow'
    | 'ghost';
  color?:
    | 'primary'
    | 'default'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isIconOnly?: boolean;
  className?: string;
  dataCy?: string;
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export default function ButtonWithSpinner({
  children,
  isActive,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  isIconOnly = false,
  className = '',
  dataCy = '',
  radius = 'md',
}: ButtonWithSpinnerProps) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      isDisabled={!isActive}
      isLoading={pending}
      variant={variant}
      color={color}
      size={size}
      isIconOnly={isIconOnly}
      className={className}
      data-cy={dataCy}
      radius={radius}
    >
      {children}
    </Button>
  );
}
