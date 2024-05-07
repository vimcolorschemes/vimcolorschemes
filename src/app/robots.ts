import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  if (process.env.ENABLE_ROBOTS_TXT !== 'true') {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${process.env.APP_URL}/sitemap.xml`,
  };
}
