"use client";

import { Spinner } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface AppendToPathProps {
  append: string;
}

export default function AppendToPath({ append }: AppendToPathProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname) {
      const newPathname = pathname.concat(append);
      router.replace(newPathname);
    }
  }, [pathname, append, router]);

  return (
    <Spinner
      size="lg"
      color="primary"
      className="flex justify-center items-center h-full"
    />
  )
}

