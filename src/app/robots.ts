import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/profile/', '/order-history/', '/api/', '/auth/'],
    },
    sitemap: 'https://mithilamakhana.com/sitemap.xml',
  }
}
