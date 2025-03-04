import { Input, Snippet } from '@nextui-org/react';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { useDictionary } from '@/components/hooks';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import { addFriend } from '@/lib/actions/competition';

interface FriendManagementProps {
  friendCode: string;
}

export default function FriendManagement({
  friendCode,
}: FriendManagementProps) {
  const dictionary = useDictionary('competition');

  return (
    <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center w-11/12 max-w-2xl gap-3">
      <Snippet variant="solid" color="primary" symbol="">
        {friendCode}
      </Snippet>
      <FormWithFeedbackManagement
        action={addFriend}
        className="flex flex-row justify-center items-center gap-4"
        errorAsToast
      >
        <Input
          type="text"
          size="sm"
          name="friendCode"
          label={dictionary['friend-code']}
          color="primary"
          variant="bordered"
          placeholder={dictionary['friend-code-placeholder']}
        />
        <ButtonWithSpinner isActive={true}>
          {dictionary['add-friend']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
    </div>
  );
}
