import { usePathname, useRouter } from 'next/navigation';

export const useLaunchModal = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (key: string) => {
    const newPathname = pathname
      .replace(/\?modal=\w+/, '')
      .concat(`?modal=${key}`);

    router.push(newPathname);
  };
};
