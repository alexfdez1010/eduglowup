import { PromptDefined } from './interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const typicalQuestionsPrompts: Record<string, PromptDefined> = {
  es: {
    system: teacherPrompts.es,
    user:
      'A partir del siguiente resumen, genera 15 preguntas típicas que un estudiante podría hacer. ' +
      'Las preguntas deben ser breves y cada una en una nueva línea. No incluyas ningún otro texto ni formato.\n\n' +
      'Por ejemplo, si el resumen es sobre el sistema solar:\n' +
      'Deberías dar una salida como esta:\n' +
      '1. ¿Qué es el Sol?\n' +
      '2. ¿Por qué el Sol es esencial para la vida en la Tierra?\n' +
      '3. ¿Cómo proporciona el Sol luz y calor?\n' +
      '...\n\n' +
      'Resumen:\n\n{partSummary}',
  },
  en: {
    system: teacherPrompts.en,
    user:
      'Based on the following summary, generate 15 typical questions that a student might ask. ' +
      'The questions should be brief and each on a new line. Do not include any other text or formatting.\n\n' +
      'For example, if the summary is about the solar system:\n' +
      'You should give an output like this:\n' +
      '1. What is the Sun?\n' +
      '2. Why is the Sun essential for life on Earth?\n' +
      '3. How does the Sun provide light and heat?\n' +
      '...\n\n' +
      'Summary:\n\n{partSummary}',
  },
};
