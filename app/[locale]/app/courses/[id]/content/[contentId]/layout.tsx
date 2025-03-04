import ContentsSidebar from "@/components/content/ContentsSidebar";
import { contentService } from "@/lib/services/content-service";
import { courseService } from "@/lib/services/course-service";
import { guardService } from "@/lib/services/guard-service";
import { notFound } from "next/navigation";

export default async function ContentLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string; id: string, contentId: string };
}) {
  const courseId = params.id;

  if (!courseId) {
    notFound();
  }

  const [contents, userHasAccess, course] = await Promise.all([
    contentService.getContentsOfCourse(courseId),
    guardService.userHasAccessToCourse(courseId),
    courseService.getCourse(courseId),
  ]);

  if (!userHasAccess) {
    notFound();
  }

  return (
    <>
      <ContentsSidebar
        course={course}
        currentContentId={params.contentId}
        contents={contents}
      />
      {children}
    </>
  );
}