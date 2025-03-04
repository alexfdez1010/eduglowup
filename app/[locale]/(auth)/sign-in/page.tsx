import SignIn from '@/components/auth/SignIn';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { LocalePageProps } from '@/app/[locale]/interfaces';

export async function generateStaticParams() {
  return [{ params: { locale: 'en' } }, { params: { locale: 'es' } }];
}

export default async function Page({ params }: LocalePageProps) {
  return <SignIn localeDictionary={getDictionary(params.locale)['sign-in']} />;
}
