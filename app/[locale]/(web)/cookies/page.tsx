import { LocalePageProps } from '@/app/[locale]/interfaces';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDictionary } from '@/app/[locale]/dictionaries';
import ManageCookies from '@/components/analytics/ManageCookies';
import fs from 'fs';

export default async function Page({ params }: LocalePageProps) {
  const dictionary = getDictionary(params.locale)['cookies'];
  const content = fs.readFileSync(
    `./app/[locale]/(web)/cookies/${params.locale}.md`,
    'utf8',
  );

  return (
    <div className="w-10/12 md:w-[800px] flex flex-col gap-5 items-center mt-5">
      <div className="prose dark:prose-invert">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </div>
      <ManageCookies textButton={dictionary['manage-cookies']} />
    </div>
  );
}
