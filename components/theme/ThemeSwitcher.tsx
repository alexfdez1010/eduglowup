'use client';

import React, { useEffect } from 'react';
import { MoonIcon } from './MoonIcon';
import { SunIcon } from './SunIcon';
import { Button } from '@nextui-org/button';
import { useTheme } from 'next-themes';

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const changeTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      isIconOnly
      variant="light"
      type="submit"
      color="default"
      aria-label="Change theme"
      onPress={changeTheme}
    >
      {resolvedTheme === 'light' ? (
        <MoonIcon className="size-6" />
      ) : (
        <SunIcon className="size-6" />
      )}
    </Button>
  );
}
