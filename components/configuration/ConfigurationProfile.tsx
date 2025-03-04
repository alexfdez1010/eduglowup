import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { updateImageOfUser, updateProfile } from '@/lib/actions/profile';
import { FileUpload } from '@/components/content/FileUpload';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import { Divider } from '@nextui-org/divider';
import { Textarea } from '@nextui-org/input';
import { Input } from '@nextui-org/react';
import { ProfileDto } from '@/lib/dto/profile.dto';

interface ConfigurationProfileProps {
  localeDictionary: Record<string, string>;
  profile: ProfileDto | null;
}

export default function ConfigurationProfile({
  localeDictionary,
  profile,
}: ConfigurationProfileProps) {
  return (
    <div className="w-full">
      <FormWithFeedbackManagement
        action={updateImageOfUser}
        className="flex flex-col justify-center items-center gap-3 w-full"
      >
        <FileUpload
          name="image"
          accept="image/*"
          text={localeDictionary['upload-profile-image']}
        />
        <ButtonWithSpinner isActive={true} color="primary">
          {localeDictionary['update-profile-image']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
      <Divider />
      <FormWithFeedbackManagement
        action={updateProfile}
        className="flex flex-col justify-center items-center gap-3 w-full"
      >
        <Textarea
          name="description"
          description={localeDictionary['profile-description-description']}
          variant="faded"
          color="primary"
          minRows={5}
          maxRows={10}
          defaultValue={profile?.description}
          label={localeDictionary['description']}
        />

        <Input
          type="text"
          name="linkedinUrl"
          color="primary"
          variant="faded"
          defaultValue={profile?.linkedinUrl}
          label={localeDictionary['linkedin-url']}
        />

        <Input
          type="text"
          name="anotherUrl"
          color="primary"
          variant="faded"
          defaultValue={profile?.anotherUrl}
          label={localeDictionary['another-url']}
        />

        <ButtonWithSpinner isActive={true} color="primary">
          {localeDictionary['update-profile']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
    </div>
  );
}
