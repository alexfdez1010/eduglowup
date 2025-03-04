import React from 'react';
import { Link } from '@nextui-org/link';

interface SocialMediaIconProps {
  link: string;
  label: string;
  color?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'foreground';
  children: React.ReactNode;
}

const SocialMediaIcon = ({
  link,
  label,
  color = 'primary',
  children,
}: SocialMediaIconProps) => {
  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      color={color}
      aria-label={label}
    >
      {children}
    </Link>
  );
};

export default SocialMediaIcon;
