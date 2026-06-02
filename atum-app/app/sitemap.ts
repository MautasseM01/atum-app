import type { MetadataRoute } from 'next';
import { getAllEtymologyWords } from '@/lib/wordPage';

const SITE_URL = 'https://atum-app-dna.vercel.app';
const LOCALES = ['en', 'ar', 'fr'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [];
  const baseRoutes = ['', '/explorer', '/patterns', '/letters', '/research'];
  for (const route of baseRoutes) {
    for (const locale of LOCALES) {
      staticRoutes.push({
        url: `${SITE_URL}/${locale}${route}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: route === '' ? 1.0 : 0.7,
      });
    }
  }

  const allWords = await getAllEtymologyWords();
  const wordRoutes: MetadataRoute.Sitemap = [];
  for (const w of allWords) {
    if (!w.european) continue;
    for (const locale of LOCALES) {
      wordRoutes.push({
        url: `${SITE_URL}/${locale}/etymology/${encodeURIComponent(w.european.toLowerCase())}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6,
        alternates: {
          languages: {
            en: `${SITE_URL}/en/etymology/${encodeURIComponent(w.european.toLowerCase())}`,
            ar: `${SITE_URL}/ar/etymology/${encodeURIComponent(w.european.toLowerCase())}`,
            fr: `${SITE_URL}/fr/etymology/${encodeURIComponent(w.european.toLowerCase())}`,
          },
        },
      });
    }
  }

  return [...staticRoutes, ...wordRoutes];
}
