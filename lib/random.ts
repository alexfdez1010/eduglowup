/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * @param min Minimum value
 * @param max Maximum value
 * @returns A random integer between min and max
 */
export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Return n random integers between min (inclusive) and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 * @param n Number of integers to return
 * @returns An array of n random integers
 */
export function randomIntegers(min: number, max: number, n: number) {
  return Array.from({ length: n }, () => randomInt(min, max));
}

/**
 * Return n random elements from the array (can be repeated)
 * @param array The array to get the elements from
 * @param n The number of elements to get
 * @returns An array of n random elements from the array
 */
export function randomElements<T>(array: T[], n: number): T[] {
  const selected = randomIntegers(0, array.length - 1, n);
  return selected.map((index) => array[index]);
}

export function randomIntegersWithoutRepetition(
  min: number,
  max: number,
  n: number,
): number[] {
  const indexes = shuffle(
    Array.from({ length: max - min + 1 }, (_, i) => i + min),
  );
  return indexes.slice(0, n);
}

export function randomElementsWithoutRepetition<T>(array: T[], n: number): T[] {
  const selected = randomIntegersWithoutRepetition(0, array.length - 1, n);
  return selected.map((index) => array[index]);
}

/**
 * Return a random element from the array
 * @param array The array to get the element from
 * @returns A random element from the array
 */
export function randomElement<T>(array: T[]): T {
  return randomElements(array, 1)[0];
}

/**
 * Shuffle the elements of the array
 * @param array The array to shuffle
 * @returns The shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const j = Math.floor(Math.random() * (i + 1));
    // Swap elements at indices i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Given a discrete probability distribution,
 * return the cumulative distribution of that distribution.
 * @param probabilityDistribution The probability distribution
 * @returns The cumulative distribution
 */
export function getCumulativeDistribution(probabilityDistribution: number[]) {
  let cumulative = 0;
  return probabilityDistribution.map((value) => (cumulative += value));
}

/**
 * Given a cumulative distribution, return the index chosen
 * according to the distribution.
 * @param cumulativeDistribution The cumulative distribution
 * @returns The index chosen
 */
export function selectFromCumulativeDistribution(
  cumulativeDistribution: number[],
): number {
  const random = Math.random();
  for (let i = 0; i < cumulativeDistribution.length; i++) {
    if (random < cumulativeDistribution[i]) {
      return i;
    }
  }
  return cumulativeDistribution.length - 1;
}

/**
 * Given a discrete probability distribution, return a random element
 * according to this distribution.
 * @param probabilityDistribution The probability distribution
 * @returns The random element
 */
export function selectFromProbabilityDistribution(
  probabilityDistribution: number[],
): number {
  const cumulativeDistribution = getCumulativeDistribution(
    probabilityDistribution,
  );

  return selectFromCumulativeDistribution(cumulativeDistribution);
}

/**
 * Given a list of values, return the discrete probability distribution of those values.
 * @param values The values to calculate the probability distribution
 * @param func A function to apply to each value (it must return a positive number)
 * @returns The probability distribution
 */
export function getProbabilityDistribution(
  values: number[],
  func: (value: number) => number = (value) => value,
): number[] {
  let total = 0;
  let probValues: number[] = [];

  for (const value of values) {
    const probValue = func(value);

    total += probValue;
    probValues.push(probValue);
  }

  // If the total is 0, we return a uniform distribution
  if (total === 0) {
    return Array(probValues.length).fill(1 / probValues.length);
  }

  // Normalize the values to be a probability distribution
  return probValues.map((value) => value / total);
}
