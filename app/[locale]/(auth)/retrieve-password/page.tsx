import { LocalePageProps } from '@/app/[locale]/interfaces';
import ForgotPassword from '@/components/auth/ForgotPassword';

export default async function Page({ params }: LocalePageProps) {
  return <ForgotPassword />;
}
