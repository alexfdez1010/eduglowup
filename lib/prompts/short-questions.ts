import { PromptDefined } from '@/lib/prompts/interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const shortQuestionsPrompts: Record<string, PromptDefined> = {
  es: {
    system: teacherPrompts.es,
    user:
      'Tu tarea es crear seis preguntas cortas basadas en un texto dado. El texto ' +
      'se proporcionará entre triples acentos graves. Concéntrate en generar ' +
      'preguntas que sean significativas y fomenten el pensamiento crítico. El usuario no tendrá ' +
      'acceso al texto utilizado para generar la pregunta. Por lo tanto, tenlo en cuenta ' +
      'al generar la pregunta. La pregunta debe ser respondida utilizando entre {minWords} y {maxWords}. ' +
      'La pregunta y la rúbrica deben estar en ESPAÑOL.\n' +
      'Debes proporcionar como salida la pregunta seguida de la rúbrica que se usará para corregirla, ' +
      'serán separadas por ":", ambas deben seguir el ejemplo y el FORMATO específicado sin añadir/quitar nada. ' +
      'Cada pregunta+rúbrica serán separadas por un salto de línea. \n' +
      'Ejemplo: \n' +
      '¿Cuáles son los planetas del sistema solar y en qué orden están desde el sol?:Debe enumerar los planetas del sistema solar (Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno) y explica brevemente el orden de los planetas desde el sol.' +
      '¿Cuál es el planeta más grande del sistema solar y por qué?: Debe mencionar específicamente Júpiter y explicar las razones por las que es el planeta más grande del sistema solar.' +
      '¿Por qué a Plutón no se le considera un planeta?:Debe explicar brevemente por qué Plutón no es un planeta y la polémica que ha habido respecto a este asunto' +
      '\n\n' +
      '```{text}```',
  },
  en: {
    system: teacherPrompts.en,
    user:
      'Your task is to create six short questions based on a given text. The text ' +
      'will be provided within triple backticks. Focus on generating ' +
      'questions that are meaningful and encourage critical thinking. The user will not ' +
      'have access to the text used to generate the question. So, take that into account ' +
      'when generating the question. The question should be answered using between {minWords} and {maxWords}. ' +
      'The question and the rubric must be in ENGLISH.' +
      'You must provide as an output the question followed by the rubric that will be used to correct it, ' +
      'they will be separated by ":", both must be ' +
      'a continuous line. First the question and after that the rubric. ' +
      'FOLLOW the example and the SPECIFIED FORMAT without adding/removing anything. ' +
      'IT IS COMPULSORY that the output is only two lines.\n\n' +
      'Each question+rubric will be separated by a line break.\n' +
      'Example: \n' +
      'What are the planets of the solar system and in which order are they from the sun?:Must list the planets of the solar system (Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune) and explain briefly the order of the planets from the sun.' +
      'What is the largest planet of the solar system and why?:Must mention specifically Jupiter and explain the reasons why it is the largest planet of the solar system.' +
      'Why is Pluto not considered a planet?:Must explain briefly why Pluto is not a planet and the politics that have occurred regarding this issue' +
      '\n\n' +
      '```{text}```',
  },
};
