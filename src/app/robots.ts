import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/account/',
        '/api/',
        '/cart/',
        '/checkout/',
        '/order-confirmation/',
      ],
    },
    sitemap: 'https://fishwale.com/sitemap.xml',
  }
}
