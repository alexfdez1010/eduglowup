import { randomElement } from '@/lib/random';

const learningTipsEn: string[] = [
  '💧 Hydrate Your Brain: Chug down 8 glasses of water daily to boost your cognitive sharpness and prep your brain for absorbing new info!',
  '🏃‍ Boost Your Brain with Brawn: Regular workouts increase blood flow upstairs, enhancing your smarts and memory!',
  '🌜 Dream to Succeed: Clock in 7-9 hours of sleep to let your brain tidy up its memory palace, making learning a breeze.',
  '📵 Go Offline: Slash those digital distractions by killing notifications or employing a phone blocker during crunch times.',
  '🔄 Crave Constructive Criticism: Thrive on feedback to pinpoint and polish your study tactics for maximum efficiency.',
  '👥 Collaborate to Elevate: Unlock deeper insights by learning with pals, turning group studies into brainpower bonanzas.',
  '📔 Flash Those Cards: Flashcards aren’t just retro; they’re your brain’s best buds for beating the forgetfulness monster.',
  '🕰️ Learn in Leaps: Spread your study sessions for a memory marathon; spaced repetition is your ticket to long-term knowledge.',
  '🚶‍ Break to Make: Master your focus with mini breaks. Try the Pomodoro Technique: 25 minutes of intense focus followed by a 5-minute breather.',
  '🧠 Map Your Mind: Sketch mind maps to link concepts visually, boosting your recall and nailing complex ideas.',
  '🤔 Reflect to Perfect: Make reflection a ritual. Summarize, teach, and review to transform information into knowledge.',
  '🎯 Aim to Claim: Set precise targets for every study slot to stay on track and turbocharge your motivation.',
  '🌐 Diversify to Intensify: Dive into different sources to broaden your perspective and solidify your memory.',
  '🎒 Command Your Space: Keep your study zone clutter-free to laser-focus your brainpower where it matters.',
  '🤖 Tech It Up: Embrace ed-tech tools to tailor a thrilling and customized learning voyage.',
  '🧘 Zen Your Den: Meditate or practice mindfulness to squash stress and supercharge your concentration.',
  '📖 Get Proactive with Pages: Question, predict, and summarize as you read to truly engage with every word.',
  '🎧 Tune Into Knowledge: Supplement your studies with educational podcasts for a soundtrack of insights.',
  '📝 Journal Your Journey: Track your triumphs and trip-ups in a learning journal to craft your personalized path to knowledge.',
  '🌟 Keep the Faith: Harness a can-do attitude towards learning to turn your brain into a powerhouse of possibilities.',
];

const learningTipsEs = [
  '💧 Hidrata tu cerebro: Bebe 8 vasos de agua al día para mejorar tu concentración y absorber mejor la información.',
  '🏃‍️ Activa tu mente con ejercicio: Hacer ejercicio regularmente aumenta el flujo sanguíneo al cerebro, mejorando tu memoria e inteligencia.',
  '🌜 Descansa bien: Duerme entre 7 y 9 horas para que tu cerebro pueda organizar y consolidar la información que has aprendido.',
  '📵 Evita distracciones: Desactiva las notificaciones o usa apps que bloqueen llamadas durante tus momentos de estudio clave.',
  '🔄 Busca retroalimentación: Aprovecha el feedback para mejorar y optimizar tus técnicas de estudio.',
  '👥 Estudia en grupo: Profundiza tus conocimientos estudiando con otros, haciendo del aprendizaje colaborativo algo enriquecedor.',
  '📔 Usa tarjetas didácticas: Las tarjetas son una herramienta efectiva para recordar y repasar conceptos.',
  '🕰️ Estudia a intervalos: Divide tus sesiones de estudio para mejorar la retención a largo plazo con la técnica de repetición espaciada.',
  '🚶‍ Haz pausas: Mantén tu enfoque con descansos cortos. Prueba la Técnica Pomodoro: 25 minutos de estudio intenso seguidos de 5 minutos de descanso.',
  '🧠 Crea mapas mentales: Dibuja mapas mentales para conectar conceptos visualmente y entender mejor ideas complejas.',
  '🤔 Reflexiona: Resumen, enseña y revisa lo que aprendes para convertir la información en conocimiento duradero.',
  '🎯 Fija metas claras: Define objetivos específicos para cada sesión de estudio para mantenerte enfocado y motivado.',
  '🌐 Diversifica tus fuentes: Consulta diferentes materiales para ampliar tu perspectiva y reforzar tu memoria.',
  '🎒 Organiza tu espacio: Mantén tu área de estudio ordenada para maximizar tu concentración y eficiencia.',
  '🤖 Usa la tecnología: Incorpora herramientas educativas que hagan tu aprendizaje más interesante y personalizado.',
  '🧘 Mantén la calma: Practica la meditación o el mindfulness para reducir el estrés y mejorar tu concentración.',
  '📖 Activa tu lectura: Haz preguntas, predicciones y resúmenes mientras lees para comprometerte más con el texto.',
  '🎧 Escucha podcasts: Complementa tus estudios con podcasts educativos que te brinden nuevos conocimientos.',
  '📝 Lleva un diario de aprendizaje: Anota tus éxitos y errores para crear tu propio camino hacia el conocimiento.',
  '🌟 Mantén una actitud positiva: Adopta una mentalidad de "puedo hacerlo" para convertir el aprendizaje en una experiencia positiva y poderosa.',
];

const learningTips: Record<string, string[]> = {
  en: learningTipsEn,
  es: learningTipsEs,
};

export function getTip(locale: string) {
  const tips = learningTips[locale] || learningTipsEn;
  return randomElement(tips);
}
