'use client';

import { usePathname } from 'next/navigation';

export default function HiddenInputCourseId() {
  const pathname = usePathname();
  const pathParts = pathname?.split('/') || [];
  const courseIndex = pathParts.findIndex((part) => part === 'courses') + 1;

  if (courseIndex === -1) {
    return null;
  }

  const courseId = courseIndex < pathParts.length ? pathParts[courseIndex] : '';

  if (!courseId) {
    return null;
  }

  return <input type="hidden" name="courseId" value={courseId} />;
}
