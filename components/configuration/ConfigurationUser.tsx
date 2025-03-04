import { Input } from '@nextui-org/input';
import { Divider } from '@nextui-org/divider';
import InputPassword from '@/components/general/InputPassword';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import { getUserId, updateName, updatePassword } from '@/lib/actions/user';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { Avatar, Button, Tab, Tabs } from '@nextui-org/react';
import { FileUpload } from '../content/FileUpload';
import GeneralCompetition from '@/components/competition/GeneralCompetition';
import {
  getProfile,
  updateProfile,
  updateImageOfUser,
} from '@/lib/actions/profile';
import { authProvider } from '@/lib/providers/auth-provider';
import { ProfileDto } from '@/lib/dto/profile.dto';
import { useState } from 'react';

interface ConfigurationUserProps {
  name: string;
  email: string;
  localeDictionary: Record<string, string>;
}

export default function ConfigurationUser({
  name,
  email,
  localeDictionary,
}: ConfigurationUserProps) {
  return (
    <div className="flex flex-col justify-evenly items-center gap-3 w-full">
      <FormWithFeedbackManagement
        action={updateName}
        className="flex flex-col justify-center items-center gap-3 w-full"
      >
        <Input
          type="email"
          isDisabled={true}
          variant="faded"
          defaultValue={email}
          color="primary"
          title={localeDictionary['email']}
          label={localeDictionary['email']}
        />
        <Input
          type="text"
          variant="faded"
          defaultValue={name}
          title={localeDictionary['name']}
          label={localeDictionary['name']}
          name="name"
          color="primary"
          data-cy="configuration-name-input"
        />
        <ButtonWithSpinner isActive={true} dataCy="submit-name-update-button">
          {localeDictionary['update-name']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
      <Divider />
      <FormWithFeedbackManagement
        action={updatePassword}
        className="flex flex-col justify-center items-center gap-5 w-full"
      >
        <InputPassword
          placeholder={localeDictionary['old-password']}
          label={localeDictionary['old-password']}
          name="oldPassword"
          dataCy="configuration-old-password-input"
        />
        <InputPassword
          placeholder={localeDictionary['new-password']}
          label={localeDictionary['new-password']}
          name="newPassword"
          dataCy="configuration-new-password-input"
        />
        <ButtonWithSpinner
          isActive={true}
          dataCy="submit-password-update-button"
        >
          {localeDictionary['update-password']}
        </ButtonWithSpinner>
      </FormWithFeedbackManagement>
    </div>
  );
}
