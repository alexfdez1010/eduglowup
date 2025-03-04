import './globals.css';
import { Link } from '@nextui-org/link';
import { getLocale } from '@/lib/actions/utils';
import { getDictionary } from '@/app/[locale]/dictionaries';

export default async function NotFound() {
  const locale = getLocale();

  const dictionary = getDictionary(locale)['not-found'];

  return (
    <html lang={locale}>
      <body>
        <div className="flex flex-col justify-center items-center h-screen gap-8">
          <h1 className="text-6xl">{dictionary['title']}</h1>
          <p>{dictionary['description']}</p>
          <Link href="/" underline="always">
            {dictionary['back-home']}
          </Link>
        </div>
      </body>
    </html>
  );
}
