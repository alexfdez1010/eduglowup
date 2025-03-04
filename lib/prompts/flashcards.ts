import { PromptDefined } from '@/lib/prompts/interface';
import { teacherPrompts } from '@/lib/prompts/system-prompts';

export const flashcardPrompts: Record<string, PromptDefined> = {
  es: {
    system: teacherPrompts.es,
    user:
      'Tu tarea es crear flashcards a partir de un texto. Debes proporcionar 15 flashcards en formato JSON. ' +
      'La **salida debe ser ÚNICAMENTE el JSON y absolutamente nada más**. ' +
      'Cada flashcard debe ser un objeto dentro de un array, y cada objeto debe tener dos campos: "front" y "back". ' +
      'El campo "front" debe contener una pregunta o concepto breve, y el campo "back" debe incluir una explicación detallada, respuesta o contexto. ' +
      'El contenido del campo "back" puede usar Markdown para mejorar la presentación, incluyendo listas, **tablas** o **mapas mentales en Mermaid**. ' +
      'También puedes usar emojis donde tengan sentido para hacer el contenido más atractivo. ' +
      'Puedes utilizar listas, tablas y mapas mentales en Mermaid, y puedes ser más flexible en la estructura de los mapas mentales, incluyendo subtemas mediante indentación. ' +
      'Mantén los mapas mentales breves (no más de 5 o 6 elementos). ' +
      '**Solo se admiten mapas mentales en Mermaid; otros tipos de diagramas no funcionarán en Mermaid**. ' +
      'Incluye variedad en los tipos de flashcards, como conceptos, preguntas, relaciones causa-efecto y ejemplos prácticos. ' +
      'Asegúrate de que todas sean útiles e informativas para el estudiante. ' +
      'Todo el contenido generado debe estar en ESPAÑOL.\n' +
      'Ejemplo de salida:\n' +
      '[\n' +
      '  {\n' +
      '    "front": "¿Qué es una célula? 🔬",\n' +
      '    "back": "La unidad básica de la vida en todos los organismos vivos. 🔬\\n\\n- Procariotas\\n- Eucariotas"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "Los estados del agua 💧",\n' +
      '    "back": "```mermaid\\nmindmap\\n  Agua 💧\\n    Estados\\n      Sólido ❄️\\n      Líquido 💧\\n      Gas ☁️\\n```"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "Capas de la Tierra 🌍",\n' +
      '    "back": "```mermaid\\nmindmap\\n  Tierra 🌍\\n    Corteza\\n    Manto\\n    Núcleo\\n      Externo\\n      Interno\\n```"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "Funciones principales de las proteínas 🍗",\n' +
      '    "back": "- Estructural\\n- Enzimática ⚙️\\n- Transporte 🚚\\n- Defensa 🛡️"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "Los planetas del sistema solar 🪐",\n' +
      '    "back": "```mermaid\\nmindmap\\n  Sistema Solar 🪐\\n    Planetas\\n      Terrestres\\n        Mercurio 🌑\\n        Venus 🌕\\n        Tierra 🌍\\n        Marte 🔴\\n      Gigantes Gaseosos\\n        Júpiter 🟠\\n        Saturno 🪐\\n```"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "Elementos químicos en el cuerpo humano 🧪",\n' +
      '    "back": "| Elemento | Símbolo |\n|----------|---------|\n| Oxígeno  | O      |\n| Carbono  | C      |\n| Hidrógeno| H      |\n| Nitrógeno| N      |"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "Etapas del ciclo celular 🔄",\n' +
      '    "back": "| Etapa      | Descripción                      |\n|------------|---------------------------------|\n| Interfase  | Crecimiento y replicación del ADN|\n| Mitosis    | División del núcleo celular      |\n| Citocinesis| División del citoplasma          |"\n' +
      '  }\n' +
      ']\n' +
      'Texto: {text}\n\n' +
      'Esto no es parte del texto. Recuerda que la **salida debe ser ÚNICAMENTE el JSON y absolutamente nada más**, y debe estar ENTERAMENTE en ESPAÑOL. ' +
      '**Nota:** Solo se admiten mapas mentales en Mermaid; otros tipos de diagramas no funcionarán en MemMind. Puedes ser flexible con la estructura de los mapas mentales, incluyendo subtemas mediante indentación, pero manténlos breves (no más de 5 o 6 elementos). ' +
      'También puedes usar emojis donde tengan sentido para hacer el contenido más atractivo. Asegúrate de usar el siguiente formato para los mapas mentales en Mermaid:\n' +
      '```mermaid\\nmindmap\\n  Título\\n    Subtema1\\n      Subtema1.1\\n    Subtema2\\n```\n',
  },
  en: {
    system: teacherPrompts.en,
    user:
      'Your task is to create flashcards from a text. You must provide 15 flashcards in JSON format. ' +
      'The **output must be ONLY the JSON and absolutely nothing else**. ' +
      'Each flashcard should be an object within an array, and each object should have two fields: "front" and "back". ' +
      'The "front" field should contain a brief question or concept, and the "back" field should include a detailed explanation, answer, or context. ' +
      'The content of the "back" field can use Markdown to enhance the presentation, including lists, **tables**, or **mind maps in Mermaid**. ' +
      'You can also use emojis where they make sense to make the content more engaging. ' +
      'You can use lists, tables, and mind maps in Mermaid, and you can be more flexible with the structure of the mind maps by including subtopics through indentation. ' +
      'Keep the mind maps brief (no more than 5 or 6 elements). ' +
      '**Only mind maps in Mermaid are supported; other types of diagrams will not work in Mermaid**. ' +
      'Include variety in flashcard types, such as concepts, questions, cause-effect relationships, and practical examples. ' +
      'Make sure all of them are helpful and informative for the student. ' +
      'All generated content must be in ENGLISH.\n' +
      'Example output:\n' +
      '[\n' +
      '  {\n' +
      '    "front": "What is a cell? 🔬",\n' +
      '    "back": "The basic unit of life in all living organisms. 🔬\\n\\n- Prokaryotes\\n- Eukaryotes"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "States of water 💧",\n' +
      '    "back": "```mermaid\\nmindmap\\n  Water 💧\\n    States\\n      Solid ❄️\\n      Liquid 💧\\n      Gas ☁️\\n```"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "Earth\'s layers 🌍",\n' +
      '    "back": "```mermaid\\nmindmap\\n  Earth 🌍\\n    Crust\\n    Mantle\\n    Core\\n      Outer Core\\n      Inner Core\\n```"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "Main functions of proteins 🍗",\n' +
      '    "back": "- Structural\\n- Enzymatic ⚙️\\n- Transport 🚚\\n- Defense 🛡️"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "The planets of the solar system 🪐",\n' +
      '    "back": "```mermaid\\nmindmap\\n  Solar System 🪐\\n    Planets\\n      Terrestrial\\n        Mercury 🌑\\n        Venus 🌕\\n        Earth 🌍\\n        Mars 🔴\\n      Gas Giants\\n        Jupiter 🟠\\n        Saturn 🪐\\n```"\n' +
      '  },\n' +
      '    {\n' +
      '    "front": "Main chemical elements in the human body 🧪",\n' +
      '    "back": "| Element  | Symbol |\n|----------|--------|\n| Oxygen   | O      |\n| Carbon   | C      |\n| Hydrogen | H      |\n| Nitrogen | N      |"\n' +
      '  },\n' +
      '  {\n' +
      '    "front": "Stages of the cell cycle 🔄",\n' +
      '    "back": "| Stage      | Description                   |\n|------------|-------------------------------|\n| Interphase | Growth and DNA replication    |\n| Mitosis    | Division of the cell nucleus  |\n| Cytokinesis| Division of the cytoplasm     |"\n' +
      '  }\n' +
      ']\n' +
      'Text: {text}\n\n' +
      'This is not part of the text. Remember that the **output must be ONLY the JSON and absolutely nothing else**, and should be ENTIRELY in ENGLISH. ' +
      '**Note:** Only mind maps in Mermaid are supported; other types of diagrams will not work in MemMind. You can be flexible with the structure of the mind maps by including subtopics through indentation, but keep them brief (no more than 5 or 6 elements). ' +
      'You can also use emojis where they make sense to make the content more engaging. Make sure to use the following format for mind maps in Mermaid:\n' +
      '```mermaid\\nmindmap\\n  Title\\n    Subtopic1\\n      Sub-subtopic1.1\\n    Subtopic2\\n```\n',
  },
};
