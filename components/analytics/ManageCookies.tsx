import { Button } from '@nextui-org/button';
import { removeCookie } from '@/lib/actions/cookies';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';

interface ManageCookiesProps {
  textButton: string;
}

export default function ManageCookies({ textButton }: ManageCookiesProps) {
  return (
    <form action={removeCookie}>
      <ButtonWithSpinner isActive={true} variant="ghost" color="primary">
        {textButton}
      </ButtonWithSpinner>
    </form>
  );
}
