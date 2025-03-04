/**
 * This function will retry the given function until the condition is met.
 *
 * @param func The function to retry
 * @param condition The condition to meet
 * @param retryInterval The interval to wait before retrying (milliseconds)
 * @returns The result of the function
 */
export async function retryUntilCondition<T>(
  func: () => T,
  condition: (result: T) => boolean,
  retryInterval: number,
) {
  let result: T;

  result = await func();

  while (!condition(result)) {
    await wait(retryInterval);
    result = await func();
  }

  return result;
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
