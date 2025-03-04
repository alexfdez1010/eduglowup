import { PromptDefined } from '@/lib/prompts/interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const trueFalsePrompts: Record<string, PromptDefined> = {
  es: {
    system: teacherPrompts.es,
    user:
      'Tu tarea es crear 20 preguntas de verdadero o falso basadas en el texto dado. No repitas las mismas preguntas. ' +
      'El texto se proporcionará entre triples acentos graves. Cada pregunta debe ser verdadera o falsa. ' +
      'La primera pregunta debe ser verdadera, la segunda falsa, la tercera verdadera, etc. ' +
      'En otras palabras, las preguntas impares deben ser verdaderas y las pares deben ser falsas. ' +
      'Separa cada pregunta con una nueva línea. Las preguntas deben estar en ESPAÑOL. ' +
      'Aunque el texto original está en otro idioma, las preguntas deben estar en ESPAÑOL. ' +
      'Proporciona solo las preguntas. No menciones NADA que no sean las preguntas. ' +
      'Ten en cuenta que el estudiante no tendrá acceso al texto original, por lo que no puedes ' +
      'usar expresiones como "Según el texto", "Según la figura", en la "página del texto", etc. ' +
      'Ejemplo: \n' +
      '1. ¿Es España un país?\n' +
      '2. ¿Es Madrid un país?\n' +
      '...\n\n' +
      '```{text}```',
  },
  en: {
    system: teacherPrompts.en,
    user:
      'Your task is to create 20 true/false questions based on the given text. Do not repeat the same questions. ' +
      'The text will be provided within triple backticks. Generate questions that are meaningful and encourage critical thinking. ' +
      'Ensure the questions can be answered with either "true" or "false". ' +
      'You must intercalate true and false questions. The first will be true, the second one false, ' +
      'the third true, and so on. ' +
      'In other words, odd questions must be true and even questions must be false. ' +
      'Separate each question with a new line. The questions must be in ENGLISH, ' +
      'although the original text is in another language, must be in ENGLISH, so translate the questions into ENGLISH. ' +
      'Output only the questions. Do not mention ANYTHING other than the questions. ' +
      'Take into account that the student will not have access to the original text, so you cannot ' +
      'use expressions like "According to the text", "According to the figure", in the "page of the text", etc. ' +
      'Example: \n' +
      '1. Is Spain a country?\n' +
      '2. Is Madrid a country?\n' +
      '...\n\n' +
      '```{text}```',
  },
};
