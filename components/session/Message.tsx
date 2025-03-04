import Markdown from 'react-markdown';
import { Card } from '@nextui-org/card';
import { Avatar } from '@nextui-org/avatar';
import NextImage from 'next/image';

interface MessageProps {
  name: string;
  message: string;
  profileImage: string;
}

export default function Message({ name, profileImage, message }: MessageProps) {
  return (
    <Card className="flex flex-col p-8 gap-4">
      <div className="flex flex-row justify-start items-center gap-4 text-xl">
        <Avatar
          ImgComponent={NextImage}
          imgProps={{ width: 40, height: 40 }}
          size="lg"
          src={profileImage}
          showFallback
          alt={name}
          name={name}
        />
        <p className="font-bold">{name}</p>
      </div>
      <div className="prose dark:prose-invert">
        <Markdown>{message}</Markdown>
      </div>
    </Card>
  );
}
