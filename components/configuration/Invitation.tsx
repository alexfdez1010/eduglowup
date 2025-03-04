'use client';

import { setInvitationCookie } from '@/lib/actions/user';
import { InvitationDto } from '@/lib/dto/invitation.dto';
import ButtonWithSpinner from '../general/ButtonWithSpinner';
import { Link } from '@nextui-org/react';

import NextLink from 'next/link';
import { useDictionary, useUser } from '@/components/hooks';

interface InvitationProps {
  invitation: InvitationDto;
}

export default function Invitation({ invitation }: InvitationProps) {
  const dictionary = useDictionary('invitation');

  const user = useUser();

  if (user) {
    return (
      <div className="flex flex-col justify-center items-center h-full w-full my-56 gap-5">
        <p className="text-center text-gray-500">
          {dictionary['already-registered']}
        </p>
        <Link
          as={NextLink}
          underline="always"
          color="primary"
          href="/app"
          className="text-center"
        >
          {dictionary['return-app']}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-full w-full my-56">
      <form
        action={setInvitationCookie}
        className="flex flex-col justify-center items-center gap-12 w-96"
      >
        <input type="hidden" name="token" value={invitation.invitationToken} />
        <ButtonWithSpinner isActive={true} color="primary" size="lg">
          {dictionary['accept-invitation']}
        </ButtonWithSpinner>
        <p className="text-center text-gray-500">
          {dictionary['invitation-description']}
        </p>
      </form>
    </div>
  );
}
