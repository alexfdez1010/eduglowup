import { PromptDefined } from '@/lib/prompts/interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const summaryPrompts: Record<string, PromptDefined> = {
  es: {
    system: teacherPrompts.es,
    user:
      'Tu tarea es crear un resumen de un texto proporcionado. ' +
      'Crearás el resumen usando Markdown con una clara división utilizando encabezados, subencabezados, viñetas, tablas y mapas mentales con Mermaid cuando sea apropiado. Solo puedes usar los mapas mentales de Mermaid. ' +
      'El resumen no debe exceder las 400 palabras. ' +
      'Debes capturar los puntos principales del texto y las partes en las que están divididas. ' +
      'Debes usar viñetas, subencabezados, tablas y mapas mentales (Mermaid) para organizar el resumen y darle variedad. Para los conceptos más importantes, ' +
      'utiliza un bloque de citas (con un > al comienzo de la línea) solo si es absolutamente necesario para explicar conceptos súper importantes. ' +
      'Evita incluir información o detalles innecesarios. ' +
      'Proporciona el resumen de manera clara y concisa. ' +
      'No incluyas información o contexto adicional. ' +
      'El resumen debe estar en español. Solo incluye el resumen, ninguna otra información. ' +
      'Ejemplo de salida:\n' +
      '# El Sistema Solar\n' +
      '\n' +
      '## Introducción\n' +
      '\n' +
      '  - Componentes: Sol, planetas, lunas, asteroides, cometas\n' +
      '  - Los planetas orbitan alrededor del Sol\n' +
      '  - Las lunas orbitan alrededor de los planetas\n' +
      '  - Asteroides y cometas son cuerpos más pequeños que vagan por el Sistema Solar\n' +
      '> Los componentes ordenados por tamaño son: Sol, planetas, lunas, asteroides, cometas\n' +
      '\n' +
      '## El Sol\n' +
      '\n' +
      '  - Estrella central del Sistema Solar\n' +
      '  - Proporciona luz y calor\n' +
      '  - Compuesto principalmente de hidrógeno y helio\n' +
      '  - Fuente de viento solar y clima espacial\n' +
      '  - Genera energía a través de la fusión nuclear\n' +
      '  - Contiene el 99.86% de la masa del Sistema Solar\n' +
      '  - Controla la dinámica gravitacional del sistema\n' +
      '> El Sol es esencial para la existencia y mantenimiento de la vida en la Tierra.\n' +
      '\n' +
      '## Planetas\n' +
      '\n' +
      '  - Ocho planetas: Mercurio, Venus, Tierra, Marte, Júpiter, Saturno, Urano, Neptuno\n' +
      '  - Divididos en terrestres (rocosos) y gigantes gaseosos\n' +
      '\n' +
      '### Tabla de Planetas\n' +
      '\n' +
      '| Planeta    | Tipo            | Características                      |\n' +
      '|------------|-----------------|--------------------------------------|\n' +
      '| Mercurio   | Terrestre       | Más cercano al Sol, muy caliente     |\n' +
      '| Venus      | Terrestre       | Atmósfera densa, muy caliente        |\n' +
      '| Tierra     | Terrestre       | Soporta vida, tiene agua             |\n' +
      '| Marte      | Terrestre       | Conocido como el Planeta Rojo        |\n' +
      '| Júpiter    | Gigante Gaseoso | El más grande, Gran Mancha Roja      |\n' +
      '| Saturno    | Gigante Gaseoso | Famoso por su sistema de anillos     |\n' +
      '| Urano      | Gigante Gaseoso | Rota de lado                         |\n' +
      '| Neptuno    | Gigante Gaseoso | Fuertes vientos                      |\n' +
      '\n' +
      '### Características Destacadas\n' +
      '\n' +
      '  - **Mercurio**: Sin lunas, grandes variaciones de temperatura\n' +
      '  - **Venus**: Efecto invernadero extremo, atmósfera de dióxido de carbono\n' +
      '  - **Tierra**: Único planeta conocido con vida\n' +
      '  - **Marte**: Posibilidad de agua en estado líquido en el pasado\n' +
      '> Marte es un objetivo principal en la búsqueda de vida extraterrestre debido a su similitud con la Tierra.\n' +
      '  - **Júpiter**: Mayor número de lunas, campo magnético fuerte\n' +
      '  - **Saturno**: Anillos compuestos de hielo y roca\n' +
      '  - **Urano**: Atmósfera de metano que le da color azul verdoso\n' +
      '  - **Neptuno**: Vientos más fuertes del Sistema Solar\n' +
      '\n' +
      '```mermaid\n' +
      'mindmap\n' +
      '  root((Planetas))\n' +
      '    Terrestres\n' +
      '      Mercurio\n' +
      '      Venus\n' +
      '      Tierra\n' +
      '      Marte\n' +
      '    Gigantes Gaseosos\n' +
      '      Júpiter\n' +
      '      Saturno\n' +
      '      Urano\n' +
      '      Neptuno\n' +
      '```\n' +
      '\n' +
      '## Conclusión\n' +
      '\n' +
      '  - El Sistema Solar es un conjunto diverso y dinámico de cuerpos celestes\n' +
      '  - Comprender sus componentes nos ayuda a entender nuestro lugar en el universo\n' +
      '\n\n\n' +
      'Título: {title}\n\n{text}',
  },
  en: {
    system: teacherPrompts.en,
    user:
      'Your task is to create a summary of a provided text. ' +
      'You will create the summary using Markdown with a clear division using headings, subheadings, bullet points, tables, and mind maps with Mermaid where appropriate. You can only use mind maps from Mermaid. ' +
      'The summary should be no more than 400 words. ' +
      'You should capture the main points of the text and how it is divided into parts. ' +
      'You should use bullet points, subheadings, tables, and mind maps to organize the summary and add variety. For the most important concepts, ' +
      'use a quote block (with a > at the beginning of the line) only if it is absolutely necessary to explain super important concepts. ' +
      'Avoid including unnecessary information or details. ' +
      'Provide the summary in a clear and concise manner. ' +
      'Do not include any additional information or context. ' +
      'The summary should be in English. Only include the summary, no other information. ' +
      'Example output:\n' +
      '# The Solar System\n' +
      '\n' +
      '## Introduction\n' +
      '\n' +
      '  - Components: Sun, planets, moons, asteroids, comets\n' +
      '  - Planets orbit around the Sun\n' +
      '  - Moons orbit around the planets\n' +
      '  - Asteroids and comets are smaller bodies wandering the Solar System\n' +
      '> The components ordered by size are: Sun, planets, moons, asteroids, comets\n' +
      '\n' +
      '## The Sun\n' +
      '\n' +
      '  - Central star of the Solar System\n' +
      '  - Provides light and heat\n' +
      '  - Composed mainly of hydrogen and helium\n' +
      '  - Source of solar wind and space weather\n' +
      '  - Generates energy through nuclear fusion\n' +
      "  - Contains 99.86% of the Solar System's mass\n" +
      '  - Controls the gravitational dynamics of the system\n' +
      '> The Sun is essential for the existence and maintenance of life on Earth.\n' +
      '\n' +
      '## Planets\n' +
      '\n' +
      '  - Eight planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune\n' +
      '  - Divided into terrestrial (rocky) and gas giants\n' +
      '\n' +
      '### Planet Table\n' +
      '\n' +
      '| Planet   | Type          | Characteristics                     |\n' +
      '|----------|---------------|-------------------------------------|\n' +
      '| Mercury  | Terrestrial   | Closest to the Sun, very hot        |\n' +
      '| Venus    | Terrestrial   | Dense atmosphere, very hot          |\n' +
      '| Earth    | Terrestrial   | Supports life, has water            |\n' +
      '| Mars     | Terrestrial   | Known as the Red Planet             |\n' +
      '| Jupiter  | Gas Giant     | Largest, Great Red Spot             |\n' +
      '| Saturn   | Gas Giant     | Famous for its ring system          |\n' +
      '| Uranus   | Gas Giant     | Rotates on its side                 |\n' +
      '| Neptune  | Gas Giant     | Strong winds                        |\n' +
      '\n' +
      '### Notable Features\n' +
      '\n' +
      '  - **Mercury**: No moons, extreme temperature variations\n' +
      '  - **Venus**: Extreme greenhouse effect, carbon dioxide atmosphere\n' +
      '  - **Earth**: Only known planet with life\n' +
      '  - **Mars**: Potential for past liquid water\n' +
      '> Mars is a primary target in the search for extraterrestrial life due to its similarities with Earth.\n' +
      '  - **Jupiter**: Most moons, strong magnetic field\n' +
      '  - **Saturn**: Rings made of ice and rock\n' +
      '  - **Uranus**: Methane atmosphere gives blue-green color\n' +
      '  - **Neptune**: Strongest winds in the Solar System\n' +
      '\n' +
      '```mermaid\n' +
      'mindmap\n' +
      '  root((Planets))\n' +
      '    Terrestrial\n' +
      '      Mercury\n' +
      '      Venus\n' +
      '      Earth\n' +
      '      Mars\n' +
      '    Gas Giants\n' +
      '      Jupiter\n' +
      '      Saturn\n' +
      '      Uranus\n' +
      '      Neptune\n' +
      '```\n' +
      '\n' +
      '## Conclusion\n' +
      '\n' +
      '  - The Solar System is a diverse and dynamic collection of celestial bodies\n' +
      '  - Understanding its components helps us comprehend our place in the universe\n' +
      '\n\n\n' +
      'Title: {title}\n\n{text}',
  },
};
