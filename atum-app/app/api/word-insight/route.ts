import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getWordInsight, type WordInsight } from '@/lib/getWordInsight';

interface IndexConcept {
  id: string;
  title: { ar?: string; en?: string; fr?: string };
  relatedRoot: string;
  relatedWords?: string[];
  files: { ar?: string; en?: string; fr?: string };
}

interface IndexFile {
  concepts: IndexConcept[];
}

interface RootInfo {
  root: string;
  principle: string;
  principleAr?: string;
  principleFr?: string;
}

let indexCache: IndexFile | null = null;
let rootCache: Record<string, RootInfo> | null = null;

function loadIndex(): IndexFile {
  if (!indexCache) {
    const fp = path.join(process.cwd(), 'data', 'sources', 'INDEX.json');
    indexCache = JSON.parse(fs.readFileSync(fp, 'utf8'));
  }
  return indexCache!;
}

function loadRoots(): Record<string, RootInfo> {
  if (!rootCache) {
    const fp = path.join(process.cwd(), 'data', 'rootPatterns.json');
    const raw = JSON.parse(fs.readFileSync(fp, 'utf8'));
    rootCache = raw.roots || {};
  }
  return rootCache!;
}

function pickConceptExcerpt(conceptId: string, locale: string): string | null {
  const idx = loadIndex();
  const concept = idx.concepts.find(c => c.id === conceptId);
  if (!concept) return null;
  const rel = concept.files[locale as 'ar' | 'en' | 'fr'] || concept.files.en;
  if (!rel) return null;
  const fp = path.join(process.cwd(), 'data', 'sources', rel);
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    const stripped = raw
      .replace(/^---[\s\S]*?---\s*/, '')
      .replace(/^#+\s+.*$/gm, '')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (stripped.length <= 400) return stripped;
    const cut = stripped.slice(0, 400);
    const lastSpace = cut.lastIndexOf(' ');
    return cut.slice(0, lastSpace > 0 ? lastSpace : 400) + '…';
  } catch {
    return null;
  }
}

function buildFallback(word: string, rootId: string, locale: string): WordInsight {
  const roots = loadRoots();
  const root = roots[rootId] || { root: rootId, principle: '—' };
  const principle =
    locale === 'ar' ? (root.principleAr || root.principle) :
    locale === 'fr' ? (root.principleFr || root.principle) :
    root.principle;

  const idx = loadIndex();
  const candidates = idx.concepts
    .filter(c => c.relatedRoot === 'ALL' || c.relatedRoot === rootId)
    .sort((a, b) => {
      const aHit = (a.relatedWords || []).some(w => word.toLowerCase().includes(w.toLowerCase())) ? 1 : 0;
      const bHit = (b.relatedWords || []).some(w => word.toLowerCase().includes(w.toLowerCase())) ? 1 : 0;
      return bHit - aHit;
    });
  const chosen = candidates[0];
  const conceptTitle = chosen?.title?.[locale as 'ar' | 'en' | 'fr'] || chosen?.title?.en || '';
  const conceptExcerpt = chosen ? pickConceptExcerpt(chosen.id, locale) : null;

  const intro =
    locale === 'ar'
      ? `**${word}** تنتمي إلى عائلة **${rootId}**، التي تمثّل مبدأ: ${principle}.`
      : locale === 'fr'
        ? `**${word}** appartient à la famille **${rootId}**, qui représente le principe : ${principle}.`
        : `**${word}** belongs to the **${rootId}** family, which represents: ${principle}.`;

  const connector =
    locale === 'ar' ? conceptTitle ? `\n\n## ${conceptTitle}\n\n` : ''
    : locale === 'fr' ? conceptTitle ? `\n\n## ${conceptTitle}\n\n` : ''
    : conceptTitle ? `\n\n## ${conceptTitle}\n\n` : '';

  const body = intro + connector + (conceptExcerpt || '');

  return {
    word: word.toLowerCase(),
    locale: locale as 'ar' | 'en' | 'fr',
    content: body,
    excerpt: (intro + ' ' + (conceptExcerpt || '')).slice(0, 320),
    meta: { arabicRoot: '', root: rootId, confidence: '🧩' },
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const word = (searchParams.get('word') || '').toLowerCase();
  const locale = searchParams.get('locale') || 'en';
  const rootId = (searchParams.get('root') || '').toUpperCase();

  if (!word) {
    return NextResponse.json({ insight: null, found: false, source: 'none' });
  }

  const fileInsight = getWordInsight(word, locale);
  if (fileInsight) {
    return NextResponse.json({ insight: fileInsight, found: true, source: 'file' });
  }

  if (rootId && ['ATUM', 'BULL', 'TOR'].includes(rootId)) {
    const fallback = buildFallback(word, rootId, locale);
    return NextResponse.json({ insight: fallback, found: true, source: 'fallback' });
  }

  return NextResponse.json({ insight: null, found: false, source: 'none' });
}
