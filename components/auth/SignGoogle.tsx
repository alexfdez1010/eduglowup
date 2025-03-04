import { Button } from '@nextui-org/button';
import GoogleIcon from '@/components/icons/GoogleIcon';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@nextui-org/link';

interface SignGoogleProps {
  text: string;
  redirectTo?: string;
}

export default function SignGoogle({ text, redirectTo }: SignGoogleProps) {
  const link = redirectTo
    ? `/api/auth/google?redirect=${redirectTo}`
    : '/api/auth/google';

  return (
    <Button
      as={Link}
      href={link}
      fullWidth
      color="default"
      variant="ghost"
      startContent={<GoogleIcon />}
      endContent={<ArrowRightIcon className="size-4" />}
    >
      {text}
    </Button>
  );
}
