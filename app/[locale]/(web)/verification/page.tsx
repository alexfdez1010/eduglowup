import { LocalePageProps } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { InputOTPEmail } from '@/components/verification/InputOTPEmail';
import ButtonResendEmail from '@/components/verification/ButtonResendEmail';

export default async function Page({ params }: LocalePageProps) {
  const dictionary = getDictionary(params.locale)['verification'];

  return (
    <div className="flex flex-col justify-center items-center h-full w-11/12 md:w-[600px] mt-12 gap-10">
      <h1 className="text-4xl font-bold text-center mb-6">
        {dictionary['title']}
      </h1>
      <p>{dictionary['we-have-sent-you-an-email']}</p>
      <InputOTPEmail />
      <p>{dictionary['if-you-have-not-received-an-email']}</p>
      <ButtonResendEmail />
    </div>
  );
}
