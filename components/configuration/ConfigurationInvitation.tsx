import { InvitationDto } from '@/lib/dto/invitation.dto';
import { Snippet } from '@nextui-org/react';

interface ConfigurationInvitationProps {
  invitation: InvitationDto;
  localeDictionary: Record<string, string>;
}

const maxInvitations = 5;

export default function ConfigurationInvitation({
  invitation,
  localeDictionary,
}: ConfigurationInvitationProps) {
  const information = localeDictionary['invitation-information']
    .replace('{number}', invitation.invitationCount.toString())
    .replace('{diamonds}', (50 * invitation.invitationCount).toString());

  const until = localeDictionary['invitation-until'].replace(
    '{date}',
    invitation.validUntil.toLocaleDateString(),
  );

  const lengthWindow = window.innerWidth;
  const lengthLink = Math.min(Math.floor(lengthWindow / 12) + 1, 48);

  const linkShow = `${invitation.invitationLink.slice(0, lengthLink)}...`;

  return (
    <div className="flex flex-col justify-evenly items-center gap-8 my-5">
      <p className="text-sm font-bold text-center text-gray-500">
        {localeDictionary['invitation-description']}
      </p>
      <Snippet
        data-cy="invitation-link"
        variant="solid"
        color="primary"
        codeString={invitation.invitationLink}
        symbol=""
        className={'md:w-[500px] w-full text-[0.75rem]'}
        tooltipProps={{
          content: localeDictionary['invitation-link-copy'],
          showArrow: true,
        }}
      >
        {linkShow}
      </Snippet>
      <p className="text-sm text-center text-gray-500">{information}</p>
      {invitation.invitationCount < maxInvitations && (
        <p className="text-sm text-center text-gray-500">{until}</p>
      )}
    </div>
  );
}
