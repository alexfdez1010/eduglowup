import { PromptDefined } from '@/lib/prompts/interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const askPrompts: Record<string, PromptDefined> = {
  es: {
    system: teacherPrompts.es,
    user:
      'Debes responder a la siguiente pregunta realizada por el usuario: {question}.\n\n' +
      'Para ayudarte a responder, se te proporcionarán las secciones más relacionadas con la pregunta y los últimos mensajes intercambiados en la sesión entre el usuario y tú.\n\n' +
      'Puedes responder usando **Markdown**, incluyendo tablas y mapas mentales de **Mermaid** si lo consideras adecuado.\n' +
      'Asegúrate de siempre responder a la pregunta del usuario de la manera más útil posible.\n\n' +
      'Por ejemplo, si la pregunta es:\n\n' +
      '"¿Puedes explicarme cómo funciona la fotosíntesis?"\n\n' +
      'Y las secciones relacionadas son:\n\n' +
      '- La fotosíntesis es el proceso por el cual las plantas convierten la luz solar en energía química.\n' +
      '- Ocurre en los cloroplastos de las células vegetales.\n' +
      '- Involucra la conversión de dióxido de carbono y agua en glucosa y oxígeno.\n\n' +
      'Podrías responder:\n\n' +
      '## Proceso de Fotosíntesis\n\n' +
      'La fotosíntesis es un proceso esencial que permite a las plantas producir su propio alimento. Aquí tienes un esquema del proceso:\n\n' +
      '```mermaid\n' +
      'mindmap\n' +
      '  root((Planta))\n' +
      '    Estructura\n' +
      '      Células\n' +
      '      Transportes\n' +
      '      Sistema\n' +
      '```\n\n' +
      '| Reactivos              | Productos            |\n' +
      '|------------------------|----------------------|\n' +
      '| Dióxido de carbono (CO₂) | Glucosa (C₆H₁₂O₆)   |\n' +
      '| Agua (H₂O)             | Oxígeno (O₂)         |\n\n' +
      '{sections}\n\n' +
      'Últimos mensajes:\n{lastMessages}' +
      'Recuerda responder claramente a la pregunta realizada por el usuario. La pregunta es: {question}',
  },
  en: {
    system: teacherPrompts.en,
    user:
      'You should answer the following question asked by the user: {question}.\n\n' +
      'To help you answer, you will be provided with the sections most related to the question and the last messages exchanged in the session between you and the user.\n\n' +
      'You can respond using **Markdown**, including tables and **Mermaid** mind maps if you consider it appropriate.\n' +
      "Ensure that you always answer the user's question in the most helpful way possible.\n\n" +
      'For example, if the question is:\n\n' +
      '"Can you explain how photosynthesis works?"\n\n' +
      'And the related sections are:\n\n' +
      '- Photosynthesis is the process by which plants convert sunlight into chemical energy.\n' +
      '- It occurs in the chloroplasts of plant cells.\n' +
      '- Involves converting carbon dioxide and water into glucose and oxygen.\n\n' +
      'You could respond:\n\n' +
      '## Photosynthesis Process\n\n' +
      'Photosynthesis is an essential process that allows plants to produce their own food. Here is a diagram of the process:\n\n' +
      '```mermaid\n' +
      'mindmap\n' +
      '  root((Plant))\n' +
      '    Structure\n' +
      '      Cells\n' +
      '      Transports\n' +
      '      System\n' +
      '```\n\n' +
      '| Reactants             | Products            |\n' +
      '|-----------------------|---------------------|\n' +
      '| Carbon Dioxide (CO₂)  | Glucose (C₆H₁₂O₆)   |\n' +
      '| Water (H₂O)           | Oxygen (O₂)         |\n\n' +
      '{sections}\n\n' +
      'Last messages:\n{lastMessages}' +
      'Remember to answer clearly to the question posed by the user. The question is: {question}',
  },
};
