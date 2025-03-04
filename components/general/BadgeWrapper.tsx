import { ReactNode } from 'react';
import { Badge } from '@nextui-org/badge';

interface BadgeWrapperProps {
  children: ReactNode;
  content: number;
}

export default function BadgeWrapper({ children, content }: BadgeWrapperProps) {
  if (content === 0) {
    return children;
  }

  return (
    <Badge
      content={content.toString()}
      color="danger"
      size="md"
      placement="top-left"
    >
      {children}
    </Badge>
  );
}
