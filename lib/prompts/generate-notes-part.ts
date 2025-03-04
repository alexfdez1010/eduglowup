import { PromptDefined } from '@/lib/prompts/interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const generateNotesPartPrompts: Record<string, PromptDefined> = {
  en: {
    system: teacherPrompts.en,
    user:
      'Your task is to generate notes for a specific topic' +
      +'You will output only the name of the parts and a brief description of each part, separated by a new line. ' +
      'The name of the part and the description should be separated by ":". ' +
      'You will given the topic and a description given by the user to focus on' +
      'some specific aspects of the topic. You will provide at maximum 5 parts. ' +
      'The parts must be in ENGLISH, although the original text is in another language. ' +
      'Example:\n' +
      'You have been asked to generate notes for the topic "Solar System". ' +
      'and the user has given the description "general knowledge about the solar system". ' +
      'Your output should be like this:\n' +
      '1. What is the solar system?: Explain the solar system in general and on what planets it is composed.\n' +
      '2. Which planets are in the solar system?: List the planets in the solar system and explain briefly their characteristics.\n' +
      '3. How do the planets orbit the sun?: Explain the orbit of the planets around the sun.\n' +
      '4. What is the sun?: Explain the sun in general and its characteristics.\n' +
      '5. Size of the planets: Order the planets by size and explain their sizes. Make comparisons between the sizes of the planets and the sun.\n' +
      '6. Is Pluto a planet?: Explain the controversy around whether Pluto is a planet or not.\n' +
      '7. Asteroids and comets in the solar system: Explain the differences between asteroids and comets. Also, which are the most common types of asteroids and comets in the solar system.' +
      '\n\n' +
      'Topic: {topic}\n\nDescription: {description}',
  },
  es: {
    system: teacherPrompts.es,
    user:
      'Tu tarea es generar apuntes para un tema específico. Solo te ocuparás de dividir el tema en partes. ' +
      'Tu salida solo tendrá en cuenta los nombres de las partes y una breve descripción de cada parte, separados por una nueva línea. ' +
      'Los nombres de las partes y la descripción deben estar separados por ":". ' +
      'Te darás el tema y una descripción dada por el usuario para enfocarse en algún aspecto específico del tema. ' +
      'Proporcionarás como máximo 5 partes. ' +
      'Las partes deben estar en ESPAÑOL, aunque el texto original esté en otro idioma. ' +
      'Ejemplo:\n' +
      'Se ha sido solicitado generar apuntes para el tema "Sistema Solar". ' +
      'y el usuario ha dado la descripción "conocimiento general del sistema solar". ' +
      'Tu salida debería ser similar a esto:\n' +
      '1. ¿Qué es el sistema solar?: Explica el sistema solar en general y por los planetas que está compuesto.\n' +
      '2. ¿Qué planetas están en el sistema solar?: Enumera los planetas en el sistema solar y explica brevemente sus características.\n' +
      '3. ¿Cómo orbitan los planetas alrededor del sol?: Explica el órbita de los planetas alrededor del sol.\n' +
      '4. ¿Qué es el Sol?: Explica el sol en general y sus características.\n' +
      '5. El tamaño de los planetas: Ordena los planetas por tamaño y explica sus tamaños. Hacer comparaciones entre los tamaños de los planetas y el sol.\n' +
      '6. ¿Es Plutón un planeta?: Explica la controversia alrededor de si Plutón es un planeta o no.\n' +
      '7. Asteroides y cometas en el sistema solar: Explica las diferencias entre asteroides y cometas. Además, cuáles son los tipos de asteroides y cometas más comunes en el sistema solar.' +
      '\n\n' +
      'Tema: {topic}\n\nDescripción: {description}',
  },
};
