'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function removeCookie(_formData: FormData) {
  cookies().delete('analytics_consent');
  revalidatePath('/');
}
