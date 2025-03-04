export function getUrl(path: string = ''): string {
  return `https://eduglowup.com/${path}`;
}

export function getImageUrl(path: string): string {
  const baseUrl = 'https://eduglowup.com/images/';
  return `${baseUrl}${path}`;
}
