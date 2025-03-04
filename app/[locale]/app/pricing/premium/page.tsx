import { Link } from '@nextui-org/link';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { LocalePageProps } from '@/app/[locale]/interfaces';
import { testABService } from '@/lib/services/testab-service';

export default async function Page({ params }: LocalePageProps) {
  const dictionary = getDictionary(params.locale)['pricing'];

  testABService.updateResult('pricing', 1).catch((e) => {
    console.error(e);
  });

  return (
    <div className="container mx-auto my-24 text-center flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-6">
        {dictionary['thanks-for-your-interest']}
      </h1>
      <p className="text-xl mb-6">{dictionary['working-on-it']}</p>
      <Link href="/app" underline="always">
        {dictionary['back-home']}
      </Link>
    </div>
  );
}
