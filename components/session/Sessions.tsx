'use client';

import { StudySessionWithDocumentsNameDto } from '@/lib/dto/study-session.dto';

import React from 'react';
import { Card } from '@nextui-org/card';
import Session from '@/components/session/Session';
import { useDictionary } from '@/components/hooks';

interface SessionProps {
  sessions: StudySessionWithDocumentsNameDto[];
}

export default function Sessions({ sessions }: SessionProps) {
  const dictionary = useDictionary('sessions');

  return (
    <div className="flex-col items-center justify-center mt-10 sm:w-[500px] w-11/12">
      {sessions.length === 0 && (
        <Card className="text-xl p-10" fullWidth={true}>
          <p className="text-center ">{dictionary['no-sessions']}</p>
        </Card>
      )}
      {sessions.map((session) => (
        <Session key={session.id} session={session} />
      ))}
    </div>
  );
}
