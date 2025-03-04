import Content from '@/components/content/Content';
import { contentService } from '@/lib/services/content-service';

export interface ContentsProps {
  courseId: string;
}

export default async function Contents({ courseId }: ContentsProps) {
  const contents = await contentService.getContentsOfCourse(courseId);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-3">
      {contents.map((content) => (
        <Content key={content.id} content={content} courseId={courseId} />
      ))}
    </div>
  );
}
