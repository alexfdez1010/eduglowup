import { useEffect, useState } from 'react';

const localStorageKey = 'exercises';
const eventUpdatedExercises = 'updated-exercises';

export const useExercises = () => {
  const [exercises, setExercises] = useState<Set<string>>(
    new Set([
      'quiz',
      'true-false',
      'concepts',
      'short-questions',
      'flashcards',
    ]),
  );

  useEffect(() => {
    const loadStoredExercises = () => {
      const storedExercises = localStorage.getItem(localStorageKey);
      if (storedExercises) {
        try {
          setExercises(JSON.parse(storedExercises));
        } catch (error) {
          console.error('Failed to parse exercises from localStorage', error);
          setExercises(new Set());
        }
      }
    };

    loadStoredExercises();

    window.addEventListener(eventUpdatedExercises, loadStoredExercises);

    return () =>
      window.removeEventListener(eventUpdatedExercises, loadStoredExercises);
  }, []);

  const updateExercises = (newExercises: Set<string>) => {
    setExercises(newExercises);
    localStorage.setItem(
      localStorageKey,
      JSON.stringify(Array.from(newExercises)),
    );

    const event = new Event(eventUpdatedExercises);
    window.dispatchEvent(event);
  };

  return { exercises, updateExercises };
};
