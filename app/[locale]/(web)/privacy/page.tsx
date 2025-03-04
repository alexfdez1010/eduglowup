import { LocalePageProps } from '@/app/[locale]/interfaces';
import Markdown from 'react-markdown';
import fs from 'fs';

export default async function Page({ params }: LocalePageProps) {
  const content = fs.readFileSync(
    `./app/[locale]/(web)/privacy/${params.locale}.md`,
    'utf8',
  );

  return (
    <div className="w-10/12 md:w-[800px] flex flex-col gap-2 items-center mt-5">
      <div className="prose dark:prose-invert w-full">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
