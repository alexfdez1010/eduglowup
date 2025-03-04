'use server';

import { repositories } from '@/lib/repositories/repositories';
import { State } from '@/lib/interfaces';
import z from 'zod';
import { getDictionaryInActions } from '@/lib/actions/utils';
import { dashboardService } from '@/lib/services/dashboardService';
import {
  ExperimentDto,
  ExperimentWithIdDto,
  VariantDto,
  VariantWithFullDataDto,
} from '@/lib/dto/experiment.dto';
import { isValidStringDate } from '@/lib/utils/date';

export async function getRegistrationByWeek(_formData: FormData) {
  try {
    const value = await repositories.dashboard.getAllDailyRegistrations();
    return { isError: false, data: value };
  } catch (error) {
    return { isError: true, message: 'Error getting registrations' };
  }
}

export async function getPageOfUsers(page: number, amount: number) {
  try {
    const users = await repositories.dashboard.getPageOfUsers(page, amount);
    return { isError: false, users: users };
  } catch (error) {
    return { isError: true, message: 'Error getting users' };
  }
}

export async function getPageOfUsersByEmail(
  page: number,
  amount: number,
  emailPattern: string,
) {
  try {
    const users = await repositories.dashboard.getPageOfUsersByEmail(
      page,
      amount,
      emailPattern,
    );
    return { isError: false, users: users };
  } catch (error) {
    return { isError: true, message: 'Error getting users' };
  }
}

export async function getAmountOfUsersByEmail(emailPattern: string) {
  try {
    const users =
      await repositories.dashboard.getAmountOfUsersByEmail(emailPattern);
    return { isError: false, users: users };
  } catch (error) {
    return { isError: true, message: 'Error getting users' };
  }
}

export async function createNewTestAB(
  _prevState: State | undefined,
  formData: FormData,
) {
  const basicParsedFormData = z
    .object({
      name: z.string(),
      description: z.string(),
      endDate: z.string(),
      metric: z.string(),
      totalVariations: z.coerce.number(),
    })
    .safeParse(Object.fromEntries(formData.entries()));

  const dictionary = getDictionaryInActions('dashboard');

  if (!basicParsedFormData.success) {
    return { isError: true, message: dictionary['error-credentials'] };
  }

  const { name, description, endDate, metric, totalVariations } =
    basicParsedFormData.data;

  if (totalVariations < 2) {
    return { isError: true, message: dictionary['error-low-variations'] };
  }
  if (totalVariations > 20) {
    return { isError: true, message: dictionary['error-high-variations'] };
  }

  const dynamicFields = {};
  for (let i = 1; i <= totalVariations; i++) {
    dynamicFields[`variant${i}Name`] = z.string();
    dynamicFields[`variant${i}Probability`] = z.coerce.number();
  }

  const dynamicFormData = z
    .object(dynamicFields)
    .safeParse(Object.fromEntries(formData.entries()));

  if (!dynamicFormData.success) {
    console.error(dynamicFormData.error);
    return { isError: true, message: dictionary['error-form-data'] };
  }

  const variationFields = dynamicFormData.data;

  let totalProbability = 0;

  try {
    const testDate = isValidStringDate(endDate);
    if (!testDate) {
      return { isError: true, message: 'Invalid date' };
    }

    const testAb: ExperimentDto = {
      name: name,
      description: description,
      startDate: new Date(),
      endDate: new Date(testDate),
      metric: metric,
    };

    const variants: VariantDto[] = [];
    for (let i = 1; i <= totalVariations; i++) {
      const nameKey = `variant${i}Name`;
      const probabilityKey = `variant${i}Probability`;

      const variation = {
        name: variationFields[nameKey],
        probability: variationFields[probabilityKey],
      };

      if (variation.probability < 0 || variation.probability > 1) {
        return {
          isError: true,
          message: dictionary['error-out-of-range-probability'],
        };
      }

      totalProbability += variation.probability;

      const variant: VariantDto = {
        name: variation.name,
        experimentName: testAb.name,
        probability: variation.probability,
      };

      variants.push(variant);
    }

    if (totalProbability < 0.95 || totalProbability > 1.05) {
      return { isError: true, message: dictionary['error-probability'] };
    }

    const newTestAB = await dashboardService.createNewTestAB(testAb, variants);
    return {
      isError: false,
      message: newTestAB
        ? 'Test AB created successfully'
        : 'Error creating test AB',
    };
  } catch (error) {
    console.log(error);
    return { isError: true, message: dictionary['error-credentials'] };
  }
}

export async function getTestsAB() {
  try {
    const tests: ExperimentWithIdDto[] = await dashboardService.getAllTestsAB();
    return { isError: false, tests: tests };
  } catch (error) {
    return { isError: true, message: 'Error getting tests AB' };
  }
}

export async function getVariantsTestsAB(testId: string) {
  try {
    const variants: VariantWithFullDataDto[] =
      await dashboardService.getVariantFullData(testId);
    return { isError: false, variants: variants };
  } catch (error) {
    return {
      isError: true,
      message: 'Error getting variants of test with specific id ',
    };
  }
}

export async function getAmountOfUsers() {
  try {
    const users = await repositories.user.getNumberOfUsers();
    return { isError: false, users: users };
  } catch (error) {
    return { isError: true, message: 'Error getting users' };
  }
}
