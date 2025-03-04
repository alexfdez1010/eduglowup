'use client';

import { Input } from '@nextui-org/input';
import { EyeFilledIcon } from '../auth/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../auth/EyeSlashFilledIcon';
import { useState } from 'react';

interface Props {
  placeholder: string;
  name?: string;
  label?: string;
  description?: string;
  dataCy?: string;
}

export default function InputPassword({
  placeholder,
  name = 'password',
  label = 'Password',
  description = '',
  dataCy = '',
}: Props) {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Input
      label={label}
      name={name}
      color="secondary"
      variant="faded"
      placeholder={placeholder}
      data-cy={dataCy}
      endContent={
        <button
          className="focus:outline-none"
          type="button"
          onClick={toggleVisibility}
        >
          {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
          )}
        </button>
      }
      type={isVisible ? 'text' : 'password'}
      {...(description && { description })}
    />
  );
}
