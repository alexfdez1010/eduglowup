import FormWithFeedbackManagement from '@/components/general/FormWithFeedbackManagement';
import { Input } from '@nextui-org/react';
import { Divider } from '@nextui-org/divider';
import { createNewTestAB } from '@/lib/actions/dashboard';
import ButtonWithSpinner from '@/components/general/ButtonWithSpinner';
import React, { useState } from 'react';

export default function TestABFormCreation() {
  const [variations, setVariations] = useState<number>(2);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVariations(parseInt(event.target.value));
  };

  const numberToLetter = (number: number) => {
    if (number < 1 || number > 20) {
      return 'Out of range';
    }

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[number - 1] || 'Invalid number';
  };

  return (
    <FormWithFeedbackManagement action={createNewTestAB}>
      <div className="flex flex-col gap-2 p-2">
        <Input type="text" name="name" label="Name" required />
        <Input type="text" name="description" label="Description" required />
        <Input type="text" name="endDate" label="End Date" required />
        <Input type="text" name="metric" label="Metric" required />
      </div>
      <Divider />

      <div className="flex flex-col justify-between items-center">
        <div className="flex flex-col gap-2">
          <Input
            name="totalVariations"
            type="number"
            placeholder={`${variations}`}
            onChange={handleChange}
            className="w-full p-2 text-center"
          ></Input>
          {variations < 2 && (
            <p className="text-red-500">Variations must be greater than 1</p>
          )}
          {variations > 20 && (
            <p className="text-red-500">Variations must be less than 20</p>
          )}
        </div>
        <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
          {Array.from({ length: variations }, (_, index) => (
            <div className="flex flex-col gap-2" key={index}>
              <h3>Variant {numberToLetter(index + 1)}</h3>
              <Input
                type="text"
                name={`variant${index + 1}Name`}
                label="Name"
                required
              />
              <Input
                type="number"
                name={`variant${index + 1}Probability`}
                label="Probability"
                required
              />
            </div>
          ))}
        </div>
      </div>

      <ButtonWithSpinner className="w-full" isActive={true}>
        Create
      </ButtonWithSpinner>
    </FormWithFeedbackManagement>
  );
}
