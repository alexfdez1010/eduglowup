import { getDictionary } from '@/app/[locale]/dictionaries';
import { i18n } from '@/i18n-config';
import { useCurrentLocale } from 'next-i18n-router/client';
import { en } from '@/dictionaries/en';
import { useEffect, useState } from 'react';
import { UserDto } from '@/lib/dto/user.dto';

export function useDictionary(key: keyof typeof en): Record<string, string> {
  const locale = useCurrentLocale(i18n);
  return getDictionary(locale)[key];
}

export function useUser() {
  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    fetch('/api/auth/user')
      .then((response) => response.json())
      .then((data) => {
        setUser(data.user);
      });
  }, []);

  return user;
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
}

export function useLocale() {
  return useCurrentLocale(i18n);
}

export function useUrl() {
  const [href, setHref] = useState<string>('');
  useEffect(() => {
    setHref(window?.location.href);
  }, []);

  return href;
}

type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export function useScreenSize(): ScreenSize {
  const getScreenSize = (width: number): ScreenSize => {
    if (width < 640) return 'xs';
    if (width < 768) return 'sm';
    if (width < 1024) return 'md';
    if (width < 1280) return 'lg';
    if (width < 1536) return 'xl';
    return '2xl';
  };

  const [screenSize, setScreenSize] = useState<ScreenSize>(() => 'xs');

  useEffect(() => {
    const handleResize = () => {
      const newSize = getScreenSize(window.innerWidth);
      setScreenSize(newSize);
    };

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
}
