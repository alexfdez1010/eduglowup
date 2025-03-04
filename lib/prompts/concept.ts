import { PromptDefined } from '@/lib/prompts/interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const conceptPrompts: Record<string, PromptDefined> = {
  es: {
    system: teacherPrompts.es,
    user:
      'Debes proporcionar 12 conceptos sacados del texto dado. ' +
      'Para cada concepto, proporciona el concepto y su definición. ' +
      'La definición no debe exceder las 50 palabras. ' +
      'No incluyas el nombre del concepto en la definición bajo ninguna circunstancia. ' +
      'El contenido estará encerrado en triple comillas invertidas (```). ' +
      'DEBES TRADUCIR los CONCEPTOS y definiciones al ESPAÑOL OBLIGATORIAMENTE, aunque el texto esté en otro idioma. ' +
      'Cada concepto debe estar en el siguiente formato:\n' +
      'Concepto: Definición\n' +
      'Separa cada concepto con una nueva línea. Bajo ninguna circunstancia debes colocar ' +
      'los conceptos en la misma línea, añadir texto que no sean los propios conceptos ' +
      'o introducir nuevas líneas dentro de la definición.\n\n' +
      'Ejemplo:\n' +
      '1. Mercurio: Es el planeta más pequeño de nuestro sistema solar y el más cercano al Sol. ' +
      'Tiene una superficie rocosa y variaciones extremas de temperatura.\n' +
      '2. Venus: Es el segundo planeta desde el Sol, conocido por su atmósfera densa y tóxica ' +
      'y temperaturas superficiales lo suficientemente altas como para derretir plomo, lo que lo convierte en el planeta más caliente.\n' +
      '3. Tierra: Es el tercer planeta desde el Sol, que apoya la vida de manera única con ' +
      'su atmósfera respirable, agua líquida y ecosistemas diversos.\n\n' +
      '```{text}```\n\n' +
      'Esto no es parte del texto. Recuerda que la salida debe ser ENTERAMENTE en ESPAÑOL.',
  },
  en: {
    system: teacherPrompts.en,
    user:
      'You must provide 12 concepts taken from the given text. ' +
      'For each concept, provide the concept and its definition. ' +
      'The definition should not exceed 50 words. ' +
      'Do not include the name of the concept in the definition under any circumstances. ' +
      'The content will be enclosed in triple backticks (```). ' +
      'You MUST translate the CONCEPTS and definitions into ENGLISH COMPULSORILY, even if the text is in another language. ' +
      'Each concept should be formatted as follows:\n' +
      'Concept: Definition\n' +
      'Separate each concept with a new line. Under no circumstances should you place concepts on the same line, ' +
      'add text that is not the concepts themselves, or introduce new lines within the definition.\n\n' +
      'Example:\n' +
      '1. Mercury: It is the smallest planet in our solar system and the closest to the Sun. ' +
      'It has a rocky surface and extreme temperature variations.\n' +
      '2. Venus: It is the second planet from the Sun, known for its thick, toxic atmosphere ' +
      'and surface temperatures hot enough to melt lead, making it the hottest planet.\n' +
      '3. Earth: It is the third planet from the Sun, uniquely supporting life with ' +
      'its breathable atmosphere, liquid water, and diverse ecosystems.\n\n' +
      '```{text}```\n\n' +
      'This is not part of the text. Remember that the output should be ENTIRELY in ENGLISH.',
  },
};
