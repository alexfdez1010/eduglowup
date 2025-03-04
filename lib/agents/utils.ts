/**
 * Remove common markdown characters (* and #),
 * also 1. , 2., etc. for lists, for the unnumbered ones
 * we remove also '-' at the beginning of a new line
 * @param text The text to remove markdown from
 * @returns The text without markdown
 */
export function removeMarkdown(text: string): string {
  return text
    .replace(/[*#]/g, '') // Remove * and #
    .replace(/^[A-Za-z0-9]+\.\s*/gm, '') // Remove numbered list items
    .replace(/^-+\s*/gm, '') // Remove unnumbered list items
    .split('\n') // Split the text into lines
    .map((line) => line.trim()) // Trim leading and trailing spaces
    .join('\n'); // Join the lines back together
}

export const numberOfRetriesOnAgents = 5;

export async function tryWithFallback<T>(
  fn: () => Promise<T>,
  condition: (result: T) => boolean,
  fallback: () => Promise<T>,
  numberOfRetries: number = numberOfRetriesOnAgents,
): Promise<T> {
  let retries = 0;
  let result: T;

  while (retries < numberOfRetries) {
    result = await fn();

    if (condition(result)) {
      return result;
    }

    retries += 1;
    console.log(`Retrying... (${retries}/${numberOfRetries})`);
  }

  return fallback();
}

/**
 * Check whether the text has markdown headings
 * @param text The text to check
 * @returns true if the text has markdown headings, false otherwise
 */
export function checkHasMarkdownHeadings(text: string): boolean {
  return text.includes('#');
}

/**
 * Remove text before the first markdown heading
 * @param text The text to remove
 * @returns The text without the text before the first markdown heading
 */
export function removeTextBeforeMarkdown(text: string): string {
  const indexFirstMarkdown = text.search('#');

  if (indexFirstMarkdown === -1) return text;

  return text.slice(indexFirstMarkdown);
}

/**
 * Set the title of the text
 * @param title The title to set
 * @param text The text to set the title
 * @returns The text with the title set
 */
export function setTitle(title: string, text: string): string {
  const firstLine = text.split(/\n+/)[0];

  if (firstLine.search(/^#\s/) !== -1) {
    const textWithoutTitle = text.replace(firstLine, '');
    return `# ${title}${textWithoutTitle}`;
  }

  return `# ${title}\n\n${text}`;
}

/**
 * Takes care of normalizing line breaks, this includes
 * replacing three or more line breaks with two line breaks
 * and line breaks at the beginning of the text
 * @param text The text to replace
 * @returns the text with two line breaks
 */
export function normalizeLineBreaks(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n').replace(/^\n+/, '');
}
