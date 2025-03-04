import { LocalePageProps } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import Title from '@/components/general/Title';
import HeaderContent from '@/components/content/HeaderContents';
import { Divider } from '@nextui-org/react';
import { Suspense } from 'react';
import ContentsSkeleton from '@/components/content/ContentsSkeleton';
import AllContents from '@/components/content/AllContents';
import { contentService } from '@/lib/services/content-service';

export default async function Courses({ params: { locale } }: LocalePageProps) {
  const contents = await contentService.getContensOfUser();

  const dictionary = getDictionary(locale)['content'];

  return (
    <>
      <Title title={dictionary['contents']} />
      <HeaderContent
        localeDictionary={dictionary}
        courseId={null}
        isOwner={true}
      />
      <Divider className="w-full" />
      <Suspense fallback={<ContentsSkeleton />}>
        <AllContents contents={contents} />
      </Suspense>
    </>
  );
}
