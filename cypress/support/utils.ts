export function getRandomLanguage() {
  return Math.random() > 0.5 ? 'es' : 'en';
}

export function parseTime(time: string) {
  const [minutes, seconds] = time.split(':');

  return 60 * parseInt(minutes) + parseInt(seconds);
}
