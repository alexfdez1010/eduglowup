import { getSession } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { urlWithLocale } from '@/lib/actions/utils';
import { revalidatePath } from 'next/cache';

export async function POST(): Promise<void> {
  const session = await getSession();
  session.destroy();

  revalidatePath('/app');
  redirect(urlWithLocale('/sign-in'));
}
