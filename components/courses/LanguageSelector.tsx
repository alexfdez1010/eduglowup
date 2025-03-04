'use client';

import { languages } from '@/common/language';
import { Select, SelectItem } from '@nextui-org/select';
import React from 'react';
import { useDictionary } from '@/components/hooks';
import { useCurrentLocale } from 'next-i18n-router/client';
import { i18n } from '@/i18n-config';

export default function LanguageSelector() {
  const dictionary = useDictionary('courses');

  const locale = useCurrentLocale(i18n);

  return (
    <Select
      items={languages}
      name="language"
      label={dictionary['language']}
      defaultSelectedKeys={[locale]}
      color="primary"
      className="max-w-96"
      variant="bordered"
      description={dictionary['language-description']}
      data-cy="create-course-language"
    >
      {(language) => (
        <SelectItem key={language.value} value={language.value}>
          {language.label}
        </SelectItem>
      )}
    </Select>
  );
}
