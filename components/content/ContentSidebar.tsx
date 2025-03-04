import { ContentStatistics, ContentTypeComponent } from "@/components/content/Content";
import { cn } from "@/components/utils";
import { DocumentCompleteDto } from "@/lib/dto/document.dto";
import { Link } from "@nextui-org/react";
import NextLink from "next/link";

interface ContentSidebarProps {
  content: DocumentCompleteDto;
  courseId: string;
  isCurrent: boolean;
}

export default function ContentSidebar({
  content,
  courseId,
  isCurrent,
}: ContentSidebarProps) {
  return (
    <div className="flex items-center py-2 px-4 hover:bg-primary/10 transition-colors duration-100">
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ContentTypeComponent content={content} />
          <Link
            as={NextLink}
            href={`/app/courses/${courseId}/content/${content.id}`}
            color={isCurrent ? "primary" : "foreground"}
            className="text-[12px] font-medium"
          >
            {content.filename}
          </Link>
        </div>
        <ContentStatistics content={content} />
      </div>
      <div
        className={cn(
          "w-1 h-6 rounded-full ml-2",
          isCurrent && "opacity-100 bg-primary",
        )}
      />
    </div>
  );
}