import SignUp from '@/components/auth/SignUp';
import { LocalePageProps } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';

export async function generateStaticParams() {
  return [{ params: { locale: 'en' } }, { params: { locale: 'es' } }];
}

export default function Page({ params }: LocalePageProps) {
  return <SignUp localeDictionary={getDictionary(params.locale)['sign-up']} />;
}
