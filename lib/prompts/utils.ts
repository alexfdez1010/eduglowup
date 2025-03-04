/**
 * This function will replace the parameters "{key}" in the prompt
 * with the corresponding value.
 *
 * @param prompt The prompt to replace the parameters in
 * @param parameters The parameters to replace (key by value)
 * @returns The prompt with the parameters replaced
 */
export function replaceParametersPrompt(
  prompt: string,
  parameters: Record<string, string | number>,
): string {
  let newPrompt = prompt;

  for (const key in parameters) {
    const value = parameters[key].toString();

    newPrompt = newPrompt.replaceAll(`{${key}}`, value);
  }

  return newPrompt;
}
