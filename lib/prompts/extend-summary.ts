import { PromptDefined } from '@/lib/prompts/interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const extendSummaryPrompts: Record<string, PromptDefined> = {
  es: {
    system: teacherPrompts.es,
    user:
      'Tienes el objetivo de extender una parte de un resumen. Crearás los nuevos apuntes usando Markdown con una clara división utilizando encabezados, ' +
      'subencabezados, viñetas, tablas y mapas mentales con Mermaid cuando sea apropiado. Solo puedes usar los mapas mentales de Mermaid. ' +
      'El resumen no debe exceder las 300 palabras ' +
      'y debe capturar los puntos principales del texto y las partes en las que está dividido. ' +
      'Debe utilizar viñetas, subencabezados, tablas y mapas mentales para organizar el resumen. Para conceptos muy importantes, ' +
      'utiliza un bloque de citas (con un > al comienzo de la línea). ' +
      'Evita incluir información o detalles innecesarios. ' +
      'Proporciona el resumen de manera clara y concisa. ' +
      'No incluyas información o contexto adicional. ' +
      'El resumen debe estar en español. Se te proporcionará el texto para extender y las secciones más relacionadas. ' +
      'Incluye solo el resumen, no otra información. Concéntrate solo en el texto a extender.\n\n' +
      'Por ejemplo, dado el texto:\n' +
      '## El Sol\n' +
      '\n' +
      '- Estrella central del Sistema Solar\n' +
      '- Proporciona luz y calor\n' +
      '- Compuesto principalmente de hidrógeno y helio\n' +
      '- Fuente de viento solar y clima espacial\n' +
      '- Genera energía a través de la fusión nuclear\n' +
      '\n' +
      'Debes generar algo como esto:\n' +
      '# El Sol\n' +
      '\n' +
      '## Estrella Central del Sistema Solar\n' +
      '\n' +
      '- **Masivo y Dominante**:\n' +
      '  - El Sol contiene el 99.86% de la masa total del Sistema Solar. Su inmensa fuerza gravitatoria mantiene a todos los planetas, lunas, asteroides y cometas en órbita.\n' +
      '- **Estructura**:\n' +
      '  - Compuesto por varias capas: núcleo, zona radiativa, zona convectiva, fotosfera, cromosfera y corona.\n' +
      '\n' +
      '```mermaid\n' +
      'mindmap\n' +
      '  root((El Sol))\n' +
      '    Estructura\n' +
      '      Núcleo\n' +
      '      Zona Radiativa\n' +
      '      Zona Convectiva\n' +
      '      Fotosfera\n' +
      '      Cromosfera\n' +
      '      Corona\n' +
      '```\n' +
      '\n' +
      '## Proporciona Luz y Calor\n' +
      '\n' +
      '- **Fotosíntesis**:\n' +
      '  - Fuente principal de energía para la fotosíntesis, esencial para la vida en la Tierra.\n' +
      '- **Clima y Tiempo**:\n' +
      '  - Impulsa la circulación atmosférica y los patrones meteorológicos.\n' +
      '\n' +
      '## Composición del Sol\n' +
      '\n' +
      '| Elemento   | Porcentaje |\n' +
      '|------------|------------|\n' +
      '| Hidrógeno  | 73%        |\n' +
      '| Helio      | 25%        |\n' +
      '| Otros      | 2%         |\n' +
      '\n' +
      '## > Conceptos Importantes\n' +
      '\n' +
      '> La fusión nuclear en el núcleo del Sol es la fuente de su energía, esencial para la vida en la Tierra.\n' +
      '\n' +
      '## Genera Energía a través de la Fusión Nuclear\n' +
      '\n' +
      '- **Proceso de Fusión**:\n' +
      '  - Convierte aproximadamente 600 millones de toneladas de hidrógeno en helio cada segundo.\n' +
      '- **Transferencia de Energía**:\n' +
      '  - La energía tarda unos 170,000 años en llegar a la superficie y ser emitida como luz solar.\n\n' +
      'Texto previo:\n\n{summary}\n\nSecciones: {sections}',
  },
  en: {
    system: teacherPrompts.en,
    user:
      'You have the task of extending a part of a summary. You will create the new notes using Markdown with a clear division using headings, ' +
      'subheadings, bullet points, tables, and mind maps with Mermaid where appropriate. You can only use mind maps from Mermaid. ' +
      'The summary should be no more than 300 words ' +
      'and should capture the main points of the text and the parts into which it is divided. ' +
      'You should use bullet points, subheadings, tables, and mind maps to organize the summary. For very important concepts, ' +
      'use a quote block (with a > at the beginning of the line). ' +
      'Avoid including unnecessary information or details. ' +
      'Provide the summary in a clear and concise manner. ' +
      'Do not include any additional information or context. ' +
      'The summary should be in English. You will be provided the text to extend and the most related sections. ' +
      'Only include the summary, no other information. Focus only on the text to extend.\n\n' +
      'For example, given the text:\n' +
      '## The Sun\n' +
      '\n' +
      '- Central star of the Solar System\n' +
      '- Provides light and heat\n' +
      '- Composed mainly of hydrogen and helium\n' +
      '- Source of solar wind and space weather\n' +
      '- Generates energy through nuclear fusion\n' +
      '\n' +
      'You should output something like this:\n' +
      '# The Sun\n' +
      '\n' +
      '## Central Star of the Solar System\n' +
      '\n' +
      '- **Massive and Dominant**:\n' +
      '  - Contains 99.86% of the total mass of the Solar System; its gravity keeps planets in orbit.\n' +
      '- **Structure**:\n' +
      '  - Composed of core, radiative zone, convective zone, photosphere, chromosphere, and corona.\n' +
      '\n' +
      '```mermaid\n' +
      'mindmap\n' +
      '  root((The Sun))\n' +
      '    Structure\n' +
      '      Core\n' +
      '      Radiative Zone\n' +
      '      Convective Zone\n' +
      '      Photosphere\n' +
      '      Chromosphere\n' +
      '      Corona\n' +
      '```\n' +
      '\n' +
      '## Provides Light and Heat\n' +
      '\n' +
      '- **Photosynthesis**:\n' +
      '  - Primary energy source for photosynthesis, crucial for life on Earth.\n' +
      '- **Climate and Weather**:\n' +
      '  - Drives atmospheric circulation and weather patterns.\n' +
      '\n' +
      '## Solar Composition\n' +
      '\n' +
      '| Element   | Percentage |\n' +
      '|-----------|------------|\n' +
      '| Hydrogen  | 73%        |\n' +
      '| Helium    | 25%        |\n' +
      '| Others    | 2%         |\n' +
      '\n' +
      '## > Important Concepts\n' +
      '\n' +
      "> Nuclear fusion in the Sun's core is the source of its energy, essential for life on Earth.\n" +
      '\n' +
      '## Generates Energy Through Nuclear Fusion\n' +
      '\n' +
      '- **Fusion Processes**:\n' +
      '  - Converts about 600 million tons of hydrogen into helium every second.\n' +
      '- **Energy Transfer**:\n' +
      '  - Energy takes about 170,000 years to reach the surface and be emitted as sunlight.\n\n' +
      'Previous text:\n\n{summary}\n\nSections: {sections}',
  },
};
