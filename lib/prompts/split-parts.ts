import { PromptDefined } from '@/lib/prompts/interface';

const enAnalyzeDocument = {
  system:
    'You are an expert educator with extensive knowledge. ' +
    'Your task is to analyze the text of a document and identify its sections ' +
    'in the EXACT order they appear in the document. ' +
    'Each section should have a meaningful and unique name. ' +
    'For each section, specify the name, a description of what things include and indicate whether the section is educationally useful in the end (+/-). ' +
    'Mark "+" for sections that are useful and "-" for those that are not. ' +
    'Sections such as references, notes, acknowledgments, cover page, copyright, author notes ' +
    'and similar should be marked as not useful. ' +
    'Ensure all section names are unique and do not exceed 50 characters. ' +
    "Provide the section names in ENGLISH, regardless of the document's original language. " +
    'The document text will be provided between triple backticks. ' +
    "Don't provide ANYTHING more than the section names and their usefulness. " +
    'Avoid any clarification and similar things' +
    'The output should be exactly as the example below, nothing less and nothing more ' +
    'Example output:\n' +
    '1. Cover Page:  Includes the title, author and date of publication. -\n' +
    '2. Acknowledgments:  Includes the names of the people who helped with the project. -\n' +
    '3. Introduction:  Includes a general introduction to the power of thought, speech, and attention. +\n' +
    '4. The Power of Thought:  Includes the general details of the power of thought, including its origins, history, and applications. +\n' +
    '5. The Power of Speech:  Includes the general details of the power of speech, including its origins, history, and applications. +\n' +
    '6. The Power of Attention:  Includes the general details of the power of attention, including its origins, history, and applications. +\n' +
    '7. Conclusion:  Includes a general conclusion to the power of thought, speech, and attention. +\n' +
    '8. References:  Includes a list of references used in the document. -\n' +
    '9. Notes:  Includes any additional notes or comments about the document. -\n',
  user: '```{text}```',
};

const esAnalyzeDocument = {
  system:
    'Eres un educador experto con amplio conocimiento. ' +
    'Tu tarea es analizar el texto de un documento e identificar sus secciones ' +
    'en el orden EXACTO en que aparecen en el documento. ' +
    'Cada sección debe tener un nombre significativo y único. ' +
    'Para cada sección, especifica el nombre, una descripción de lo que incluye y indica si la sección es útil educativamente (+/-). ' +
    'Marca "+" para las secciones que son útiles y "-" para las que no lo son. ' +
    'Secciones como referencias, notas, agradecimientos, portada, derechos de autor, notas del autor ' +
    'y similares deben marcarse como no útiles. ' +
    'Asegúrate de que todos los nombres de las secciones sean únicos y no excedan los 50 caracteres. ' +
    'Proporciona los nombres de las secciones en ESPAÑOL, independientemente del idioma original del documento. ' +
    'El texto del documento se proporcionará entre tres comillas invertidas. ' +
    'No proporciones NADA más que los nombres de las secciones y su utilidad. ' +
    'Evita cualquier aclaración y cosas similares. ' +
    'La salida debe ser exactamente como el ejemplo a continuación, ni menos ni más ' +
    'Ejemplo de salida:\n' +
    '1. Portada:  Incluye el título, el autor y la fecha de publicación. -\n' +
    '2. Agradecimientos:  Incluye los nombres de las personas que ayudaron con el proyecto. -\n' +
    '3. Introducción:  Incluye una introducción general a la poder del pensamiento, la palabra y la atención. +\n' +
    '4. El Poder del Pensamiento:  Incluye los detalles generales del poder del pensamiento, incluyendo su origen, historia y aplicaciones. +\n' +
    '5. El Poder de la Palabra:  Incluye los detalles generales del poder de la palabra, incluyendo su origen, historia y aplicaciones. +\n' +
    '6. El Poder de la Atención:  Incluye los detalles generales del poder de la atención, incluyendo su origen, historia y aplicaciones. +\n' +
    '7. Conclusión:  Incluye una conclusión general sobre el poder del pensamiento, la palabra y la atención. +\n' +
    '8. Referencias:  Incluye una lista de referencias utilizadas en el documento. -\n' +
    '9. Notas:  Incluye cualquier nota o comentario adicional sobre el documento. -\n',
  user: '```{text}```',
};

export const analyzeDocumentPrompts: Record<string, PromptDefined> = {
  es: esAnalyzeDocument,
  en: enAnalyzeDocument,
};

const esNotUsefulSections = [
  'portada',
  'agradecimientos',
  'notas',
  'referencias',
  'derechos de autor',
  'notas del autor',
  'prefacio',
  'apéndice',
  'índice',
  'glosario',
  'bibliografía',
  'anexos',
  'dedicatorias',
  'prólogo',
  'epílogo',
  'colofón',
  'tabla de contenido',
];

const enNotUsefulSections = [
  'cover page',
  'acknowledgments',
  'notes',
  'references',
  'copyright',
  'author notes',
  'preface',
  'appendix',
  'index',
  'glossary',
  'bibliography',
  'annexes',
  'dedications',
  'prologue',
  'epilogue',
  'colophon',
  'table of contents',
];

export const notUsefulCommonSections: Record<string, string[]> = {
  es: esNotUsefulSections,
  en: enNotUsefulSections,
};
