export function removeDuplicates<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function getUrlComplete(pathname: string) {
  return `${process.env.DOMAIN}${pathname}`;
}

export function isValidUrl(url: string): boolean {
  const pattern = new RegExp(
    '^(https?:\\/\\/)' + // Protocol is required (http or https)
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,63}|' + // Domain name (supports subdomains)
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IPv4 address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
      '(\\#[-a-z\\d_]*)?$',
    'i', // Case insensitive
  ); // fragment locator
  return !!pattern.test(url);
}

export function maxSizeInput(type: string): number {
  switch (type) {
    case 'normal-description':
      return 200;
    case 'short-description':
      return 50;
    case 'long-description':
      return 500;
    default:
      return 200;
  }
}

export function indexMinimum<T>(array: T[]): number {
  let minIndex = 0;
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[minIndex]) {
      minIndex = i;
    }
  }
  return minIndex;
}

export function indexMaximum<T>(array: T[]): number {
  let maxIndex = 0;
  for (let i = 1; i < array.length; i++) {
    if (array[i] > array[maxIndex]) {
      maxIndex = i;
    }
  }
  return maxIndex;
}
