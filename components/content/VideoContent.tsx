import React from 'react';

interface VideoContentProps {
  url: string;
}

export default function VideoContent({ url }: VideoContentProps) {
  return (
    <div className="w-full flex justify-center p-4">
      <video controls className="max-w-4xl w-full rounded-lg shadow-lg">
        <source src={url} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
