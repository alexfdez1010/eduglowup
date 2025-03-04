import { PromptDefined } from '@/lib/prompts/interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const quizPrompts: Record<string, PromptDefined> = {
  es: {
    system: teacherPrompts.es,
    user:
      'Tu tarea es crear 15 preguntas de opción múltiple basadas en el texto proporcionado. ' +
      'El texto estará encerrado entre tres comillas invertidas. Genera preguntas que sean significativas ' +
      'y fomenten el pensamiento crítico. Presenta la pregunta y sus opciones en el formato especificado, ' +
      'asegurando que la respuesta correcta tiene un + y las otras tienen un -. Solo puede haber UNA RESPUESTA CORRECTA. ' +
      'Proporciona un total de 4 opciones por pregunta. Incluye toda la información necesaria dentro de la pregunta ' +
      'misma, ya que el estudiante no tendrá acceso al texto original. Evita expresiones como "Según el texto", ' +
      '"Según la figura", en la "página del texto", etc. La pregunta y las opciones deben estar en ESPAÑOL, ' +
      'aunque el texto original esté en otro idioma. Así que traduce las preguntas al ESPAÑOL. ' +
      'SOLO debes proporcionar la pregunta y las opciones, no explicar en ningún caso por qué una opción ' +
      'es correcta o incorrecta. Separa cada pregunta con dos líneas y la pregunta y las opciones por una línea. ' +
      'Sigue el siguiente formato sin quitar ni añadir nada:\n\n' +
      '1. ¿Cuál es el capital de Francia?\n' +
      '+ Paris\n' +
      '- Londres\n' +
      '- Madrid\n' +
      '- Berlín\n\n' +
      '2. ¿Cuál es el capital de España?\n' +
      '- Barcelona\n' +
      '+ Madrid\n' +
      '- Valencia\n' +
      '- Sevilla\n\n' +
      '...\n\n' +
      '```{text}```',
  },
  en: {
    system: teacherPrompts.en,
    user:
      'Your task is to create 15 multiple choice questions based on the provided text. ' +
      'The text will be enclosed within triple backticks. Generate questions that are both meaningful and encourage critical thinking. ' +
      'Present the question and its options in the specified format, ensuring the correct answer has a + mark and the others have a -. ' +
      'There can be ONLY ONE correct answer. Provide 4 choices for each question. Include all necessary information within the question itself, ' +
      'as the student will not have access to the original text. Avoid phrases like "According to the text", "According to the figure", ' +
      '"In the page of the text", etc. The question and choices must be in ENGLISH, although the text is in another language, ' +
      "so translate the questions into ENGLISH. DON'T explain in any case why an option is right or wrong. Separate each question by two " +
      'lines and the question and options by one line. FOLLOW this format without removing or adding anything:\n\n' +
      '1. What is the capital of France?\n' +
      '+ Paris\n' +
      '- London\n' +
      '- Madrid\n' +
      '- Berlin\n\n' +
      '2. What is the capital of Spain?\n' +
      '- Barcelona\n' +
      '+ Madrid\n' +
      '- Valencia\n' +
      '- Sevilla\n\n' +
      '...\n\n' +
      '```{text}```',
  },
};
