import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import { signOutUser } from '@/lib/actions/user';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';

interface DangerZoneProps {
  localeDictionary: Record<string, string>;
}

export default function DangerZone({ localeDictionary }: DangerZoneProps) {
  return (
    <div className="py-5 flex flex-col justify-center items-center gap-5">
      <FormWithFeedbackManagement
        action={signOutUser}
        className="flex flex-col justify-center items-center gap-5 w-full"
      >
        <p className="text-sm text-center">
          {localeDictionary['sign-out-description']}
        </p>
        <ButtonWithSpinner color="warning" isActive={true}>
          {localeDictionary['sign-out']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
      {/*
        <Divider />
      <FormWithFeedbackManagement
        action={deleteAccount}
        className="flex flex-col justify-center items-center gap-5 w-full"
      >
        <InputPassword
          placeholder={localeDictionary['password']}
          label={localeDictionary['password']}
          name="password"
          description={localeDictionary['delete-description']}
        ></InputPassword>
        <ButtonWithSpinner color="danger" isActive={true}>
          {localeDictionary['delete']}
        </ButtonWithSpinner>
        <p className="text-sm text-center">
          {localeDictionary['delete-warning']}
        </p>
        </FormWithFeedbackManagement>
         */}
    </div>
  );
}
