import { useEffect, useState } from 'react';

export const useKeywords = () => {
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/keywords')
      .then((response) => response.json())
      .then((data) => {
        setKeywords(data.keywords);
      });
  }, []);

  return keywords;
};

export const useKeywordsInCourse = (keywordsCourse: string[]) => {
  const [keywords, setKeywords] = useState<string[]>(keywordsCourse);

  const addKeyword = (keyword: string) => {
    setKeywords([...keywords, keyword]);
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  return { keywordInCourse: keywords, addKeyword, removeKeyword };
};
