import {
  InvitationService,
  invitationService,
} from '@/lib/services/invitation-service';
import { notFound } from 'next/navigation';
import Invitation from '@/components/configuration/Invitation';

interface InvitationPageProps {
  params: {
    locale: string;
    token: string;
  };
}

export default async function Page({ params }: InvitationPageProps) {
  const locale = params.locale;
  const token = params.token;

  if (!token) {
    return notFound();
  }

  const invitation = await invitationService.getInvitation(token);

  if (!invitation) {
    return notFound();
  }

  if (invitation.invitationCount >= InvitationService.maximumInvitations) {
    return notFound();
  }

  if (invitation.validUntil < new Date()) {
    return notFound();
  }

  return <Invitation invitation={invitation} />;
}
