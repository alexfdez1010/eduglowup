/**
 * Given a number of elements, returns a boolean indicating if we reuse an existing questions
 * or generate a new one. If true we create a new question, if false we reuse an existing one.
 *
 * @param lengthCreated
 * @returns A boolean indicating if we create a new question or reuse an existing one
 */
export function createOrReuse(lengthCreated: number) {
  const threshold = 1 / (1 << lengthCreated);

  return Math.random() < threshold;
}
