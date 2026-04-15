// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/private/'],
    },
    sitemap: 'https://lucky-wheel-kappa.vercel.app/sitemap.xml',
    host: 'https://lucky-wheel-kappa.vercel.app',
  };
}