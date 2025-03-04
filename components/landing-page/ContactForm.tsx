'use client';

import { Input } from '@nextui-org/react';
import { Textarea } from '@nextui-org/input';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';

interface ContactFormProps {
  name: string;
  email: string;
  message: string;
  send: string;
}

export default function ContactForm({
  name,
  email,
  message,
  send,
}: ContactFormProps) {
  return (
    <FormWithFeedbackManagement
      action={async () => {}}
      className="flex flex-col justify-center items-center gap-5 my-10 md:w-[600px] w-10/12"
    >
      <Input
        label={name}
        name="name"
        isRequired
        color="primary"
        variant="faded"
      />
      <Input
        label={email}
        type="email"
        name="email"
        isRequired
        color="primary"
        variant="faded"
      />

      <Textarea
        label={message}
        name="message"
        isRequired
        color="primary"
        variant="faded"
        minRows={6}
        maxRows={10}
        maxLength={500}
      />

      <ButtonWithSpinner isActive={true}>{send}</ButtonWithSpinner>
    </FormWithFeedbackManagement>
  );
}
