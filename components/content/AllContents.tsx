import Content from '@/components/content/Content';
import { contentService } from '@/lib/services/content-service';
import { DocumentCompleteDto } from '@/lib/dto/document.dto';

interface AllContentsProps {
  contents: DocumentCompleteDto[];
}

export default async function AllContents({ contents }: AllContentsProps) {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center gap-3">
      {contents.map((content) => (
        <Content key={content.id} content={content} />
      ))}
    </div>
  );
}
