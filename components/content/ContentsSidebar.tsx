"use client";

import ContentSidebar from "@/components/content/ContentSidebar";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/general/Drawer";
import { useScreenSize } from "@/components/hooks";
import { CompleteCourseDto } from "@/lib/dto/course.dto";
import { DocumentCompleteDto } from "@/lib/dto/document.dto";
import { Button, useDisclosure } from "@nextui-org/react";
import { Menu } from "lucide-react";
import { useState } from "react";

interface ContentsSidebarProps {
  course: CompleteCourseDto;
  currentContentId: string;
  contents: DocumentCompleteDto[];
}

export default function ContentsSidebar({
  course,
  currentContentId,
  contents,
}: ContentsSidebarProps) {
  const screenSize = useScreenSize();

  if (screenSize === "xs" || screenSize === "sm" || screenSize === "md") {
    return (
      <ContentsSidebarMobile course={course} currentContentId={currentContentId} contents={contents} />
    );
  }

  return (
    <div className="fixed left-0 w-1/5 h-full overflow-y-auto p-4">
      <h2 className="text-lg font-bold mb-6">{course.title}</h2>
      <div className="flex flex-col gap-2">
        {contents.map((content) => (
          <ContentSidebar
            key={content.id}
            content={content}
            courseId={course.id}
            isCurrent={content.id === currentContentId}
          />
        ))}
      </div>
    </div>
  );
}

const ContentsSidebarMobile = ({ course, currentContentId, contents }: ContentsSidebarProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button className="mb-6" color="primary" size="lg" onPress={onOpen}>
        <Menu className="h-6 w-6" /> Menu
      </Button>
      <Drawer open={isOpen} onOpenChange={onOpenChange} repositionInputs={false}>
        <DrawerContent className="w-full max-h-[90dvh] h-fit py-0">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-bold text-center">
              {course.title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="w-11/12 mx-auto overflow-y-auto mb-5">
            {contents.map((content) => (
              <ContentSidebar
                key={content.id}
                content={content}
                courseId={course.id}
                isCurrent={content.id === currentContentId}
              />
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};