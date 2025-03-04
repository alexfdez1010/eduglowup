import { PromptDefined } from '@/lib/prompts/interface';
import { journalistPrompts } from '@/lib/prompts/system-prompts';

export const interviewContentPrompts: Record<string, PromptDefined> = {
  es: {
    system: journalistPrompts.es,
    user: `Tu tarea es analizar las respuestas de la entrevista y extraer las partes clave y sus descripciones.
Cada parte debe representar una sección o componente principal del tema discutido en la entrevista.
Formatea la salida como una lista numerada donde cada línea sigue el formato: "Parte: Descripción"

Basado en las siguientes preguntas y respuestas de la entrevista sobre "Inteligencia Artificial en la Educación", identifica las partes principales y sus descripciones.
Cada parte debe ser un componente o sección clave del tema. Sé específico en las descripciones para guiar a la siguiente IA en generar el contenido.

Preguntas y Respuestas:
{qa}

Formatea cada línea como "Parte: Descripción".
Cada parte debe estar en una nueva línea.

La salida debe ser como esta, sin nada más antes o despues:
1. Tecnologías de IA en Educación: Análisis detallado de las aplicaciones de Machine Learning, Procesamiento de Lenguaje Natural y Sistemas de Tutoría Inteligente en entornos educativos actuales. Incluye ejemplos específicos de cómo estas tecnologías se están implementando en aulas y plataformas de aprendizaje en línea, asi como sus beneficios y desafíos observados.
2. Aprendizaje Adaptativo: Explicación profunda de como los algoritmos de IA analizan el rendimiento del estudiante para ajustar la dificultad y el ritmo de las lecciones en tiempo real. Describe los diferentes tipos de datos utilizados, como se procesan y como se traducen en ajustes personalizados del plan de estudios.
3. Privacidad y Seguridad de Datos: Análisis exhaustivo de las medidas de protección de datos estudiantiles, incluyendo protocolos de anonimización, procesos de consentimiento informado y estrategias para el cumplimiento de regulaciones como GDPR en el uso de IA educativa. Discute casos de estudio de implementaciones exitosas y lecciones aprendidas.
4. Metodologías Híbridas: Guía detallada para implementar modelos de aprendizaje mixto que combinen instrucción humana con herramientas de IA para potenciar la experiencia educativa. Incluye estrategias paso a paso, mejores prácticas y métricas para evaluar la efectividad de estos enfoques híbridos.
5. Innovaciones Futuras: Exploración en profundidad de tecnologías emergentes como realidad aumentada, aprendizaje por refuerzo y gemelos digitales en IA educativa. Analiza su potencial impacto en los próximos 5-10 años, considerando aspectos como la accesibilidad, la equidad educativa y el desarrollo de habilidades del siglo XXI.`,
  },
  en: {
    system: journalistPrompts.en,
    user: `Your task is to analyze the interview responses and extract the key parts and their descriptions.
Each part should represent a main section or component of the topic discussed in the interview.
Format the output as a numbered list where each line follows the format: "Part: Description"

Based on the following interview questions and answers about "Artificial Intelligence in Education", identify the main parts and their descriptions.
Each part should be a key component or section of the topic.

Questions and Answers:
{qa}

Format each line as "Part: Description".
Each part should be on a new line.

The output should be like this, without anything more before or after:
1. AI Technologies in Education: Comprehensive overview of Machine Learning, Natural Language Processing, and Intelligent Tutoring Systems applications in current educational settings. Includes specific case studies of successful implementations in both K-12 and higher education, detailing the impact on student engagement, learning outcomes, and teacher workload.
2. Adaptive Learning: In-depth explanation of how AI algorithms analyze student performance to adjust lesson difficulty and pace in real-time. Covers the types of data collected, processing methodologies, and how these insights are translated into personalized learning paths. Discusses the potential for reducing achievement gaps and supporting diverse learning needs.
3. Data Privacy and Security: Thorough analysis of student data protection measures, including anonymization techniques, informed consent processes, and strategies for compliance with regulations like GDPR and FERPA in educational AI use. Examines ethical considerations and provides a framework for responsible AI implementation in educational institutions.
4. Hybrid Methodologies: Comprehensive guide for implementing blended learning models that combine human instruction with AI tools to enhance the educational experience. Includes step-by-step strategies for integration, best practices for teacher training, and metrics for evaluating the effectiveness of these hybrid approaches in various educational contexts.
5. Future Innovations: Extensive exploration of emerging technologies like augmented reality, reinforcement learning, and digital twins in educational AI. Analyzes their potential impact over the next 5-10 years, considering aspects such as accessibility, educational equity, and the development of 21st-century skills. Includes expert predictions and potential challenges to be addressed.`,
  },
};
