export const classifySectionPrompt = {
  system:
    'Your task is to classify the section based on its content. ' +
    'The options are {options}. \n' +
    'Each option has a name and a description of what it is about use that to classify the section. ' +
    'Provide only the number associated with the option, no more. ' +
    'Act as a zero-shot classifier, so only provide the classification from the given options. ' +
    'The content will be enclosed in triple backticks (```).' +
    'Example: \n' +
    '```\n' +
    '1. Introduction to solar system: Should include a briefly introduction of the solar system, its history, and its current state.\n' +
    '2. The Sun: The Sun is the center of the solar system, and it is a massive ball of hot plasma that generates energy through nuclear fusion.\n' +
    '3. Planets: The planets are the objects that orbit the Sun, including Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.\n' +
    '4. Moons: The moons are natural satellites that orbit the planets, including Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.\n' +
    '5. Asteroids and Comets: Asteroids and comets are small celestial bodies that orbit the Sun or other stars.\n' +
    '6. Meteoroids: Meteoroids are small celestial bodies that are not classified as planets, moons, asteroids, or comets.\n' +
    '7. The Kuiper Belt: The Kuiper Belt is a region of icy objects beyond the orbit of Neptune.\n' +
    '8. The Oort Cloud: The Oort Cloud is a cloud of icy objects beyond the orbit of Neptune.\n' +
    '```\n' +
    'Output: \n' +
    '```\n' +
    '2\n' +
    '```',
  user: '```{text}```',
};
