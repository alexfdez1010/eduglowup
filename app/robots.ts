import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/app/documents/'],
      disallow: '/app/',
    },
    sitemap: 'https://eduglowup.com/sitemap.xml',
  };
}
