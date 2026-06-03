import fs from 'fs';
import path from 'path';
import { type Locale, type IndexConcept, type ConceptIndex } from '@/lib/concepts';

export type { Locale, IndexConcept, ConceptIndex } from '@/lib/concepts';

export interface ConceptContent {
  id: string;
  locale: Locale;
  fallbackUsed: boolean;
  body: string;
  meta: {
    title: string;
    titleAr?: string;
    titleEn?: string;
    titleFr?: string;
  };
}

let cachedIndex: ConceptIndex | null = null;

export function loadConceptIndex(): ConceptIndex {
  if (cachedIndex) return cachedIndex;
  const fp = path.join(process.cwd(), 'data', 'sources', 'INDEX.json');
  cachedIndex = JSON.parse(fs.readFileSync(fp, 'utf8')) as ConceptIndex;
  return cachedIndex;
}

export function getConceptById(id: string): IndexConcept | null {
  const idx = loadConceptIndex();
  return idx.concepts.find(c => c.id === id) || null;
}

export function pickTitle(c: IndexConcept, locale: Locale): string {
  if (!c.title) return c.id;
  return c.title[locale] || c.title.en || c.id;
}

export function getConceptContent(id: string, locale: Locale): ConceptContent | null {
  const c = getConceptById(id);
  if (!c) return null;

  const requestedPath = c.files?.[locale];
  let raw: string | null = null;
  let fallbackUsed = false;

  if (requestedPath) {
    const fp = path.join(process.cwd(), 'data', 'sources', requestedPath);
    try {
      raw = fs.readFileSync(fp, 'utf8');
    } catch {
      raw = null;
    }
  }

  if (!raw) {
    const fallbackPath = c.files?.en || c.files?.ar || c.files?.fr;
    if (fallbackPath) {
      const fp = path.join(process.cwd(), 'data', 'sources', fallbackPath);
      try {
        raw = fs.readFileSync(fp, 'utf8');
        fallbackUsed = true;
      } catch {
        raw = null;
      }
    }
  }

  if (!raw) {
    return {
      id,
      locale,
      fallbackUsed: true,
      body: `# ${pickTitle(c, locale)}\n\n*This concept is not yet available in ${locale}.*`,
      meta: {
        title: pickTitle(c, locale),
        titleAr: c.title?.ar,
        titleEn: c.title?.en,
        titleFr: c.title?.fr,
      },
    };
  }

  const body = raw
    .replace(/^---\s*([\s\S]*?)\s*---\s*/, '')
    .replace(/^#\s+[^\n]*\n+/, '')
    .trim();

  return {
    id,
    locale,
    fallbackUsed,
    body,
    meta: {
      title: pickTitle(c, locale),
      titleAr: c.title?.ar,
      titleEn: c.title?.en,
      titleFr: c.title?.fr,
    },
  };
}
