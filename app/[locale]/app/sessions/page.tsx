import React from 'react';

import { LocalePageProps } from '@/app/[locale]/interfaces';
import { getDictionary } from '@/app/[locale]/dictionaries';
import { repositories } from '@/lib/repositories/repositories';
import Sessions from '@/components/session/Sessions';
import { authProvider } from '@/lib/providers/auth-provider';

export default async function SessionsPage({ params }: LocalePageProps) {
  const userId = await authProvider.getUserId();

  const sessions = await repositories.studySession.getSessionsOfUser(userId);

  const dictionary = getDictionary(params.locale)['sessions'];

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold my-8 text-center">
        {dictionary['title']}
      </h1>
      <p className="text-primary text-center mx-2">
        {dictionary['description']}
      </p>
      <Sessions sessions={sessions}></Sessions>
    </div>
  );
}
