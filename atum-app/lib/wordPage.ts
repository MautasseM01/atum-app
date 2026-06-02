import fs from 'fs';
import path from 'path';
import { getWordInsight, type WordInsight } from '@/lib/getWordInsight';

export interface WordData {
  id: string;
  european: string;
  arabicRoot: string;
  rootId: 'ATUM' | 'BULL' | 'TOR';
  rule: string;
  meaning: string;
  confidence: string;
  language: string;
}

export interface ScoredConcept {
  id: string;
  title: string;
  topic: string;
  content: string;
  sourceFile: string;
  relevance: number;
  matchType: string;
}

export interface InsightResult {
  insight: WordInsight | null;
  source: 'file' | 'fallback' | 'none';
}

interface BridgeEntry {
  id: string;
  arabicRoot: string;
  arabicForm: string;
  arabicMeaning: string;
  modernWord: string;
  modernMeaning: string;
  targetLanguage: string;
  transformationRule: string;
  ibdalIDs: string;
  intermediateForm: string;
  languagePath: string;
  domain: string;
  dawoodEpisode: string;
  confidence: string;
  notes: string;
  dataset: 'etymology_bridge';
}

interface DatabaseEntry {
  id: number;
  word: string;
  root: string;
  etymology: string;
  meaning: string;
  confidence: number;
  source: string;
  validated: boolean;
  timestamp: string;
  dataset: 'etymology_database';
}

interface EtymologyDB {
  bridge: BridgeEntry[];
  database: DatabaseEntry[];
}

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

interface ConceptRaw {
  id: string;
  title: string;
  topic: string;
  content: string;
  sourceFile: string;
}

let dbCache: EtymologyDB | null = null;
let indexCache: IndexFile | null = null;
let rootCache: Record<string, RootInfo> | null = null;
let conceptsCache: ConceptRaw[] | null = null;

function loadDb(): EtymologyDB {
  if (!dbCache) {
    const fp = path.join(process.cwd(), 'data', 'etymologies.json');
    dbCache = JSON.parse(fs.readFileSync(fp, 'utf8'));
  }
  return dbCache!;
}

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

function loadConcepts(): ConceptRaw[] {
  if (!conceptsCache) {
    const fp = path.join(process.cwd(), 'data', 'sources', 'concepts.json');
    const raw = JSON.parse(fs.readFileSync(fp, 'utf8'));
    conceptsCache = raw.concepts || [];
  }
  return conceptsCache!;
}

const mapConfidence = (c: unknown): string => {
  if (!c) return 'emerging';
  const s = String(c).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (s.includes('proven') || s.includes('high') || s.includes('عال') || s.includes('مؤكد')) return 'proven';
  if (s.includes('strong') || s.includes('probable') || s.includes('محتم')) return 'strong';
  if (s.includes('moderate') || s.includes('exploratory') || s.includes('استكش') || s.includes('تخم')) return 'moderate';
  if (s.includes('0.9') || (typeof c === 'number' && c >= 0.9)) return 'proven';
  if (s.includes('0.7') || (typeof c === 'number' && c >= 0.7)) return 'strong';
  return 'emerging';
};

const mapRoot = (r: string | undefined): 'ATUM' | 'BULL' | 'TOR' => {
  if (!r) return 'ATUM';
  const u = r.toUpperCase().replace('ATOM', 'ATUM');
  if (u === 'ATUM' || u === 'BULL' || u === 'TOR') return u;
  return 'ATUM';
};

const detectLanguage = (entry: BridgeEntry | DatabaseEntry): string => {
  if ('targetLanguage' in entry) {
    const tl = (entry as BridgeEntry).targetLanguage || '';
    if (tl.includes('يونانية')) return 'GR';
    if (tl.includes('لاتينية')) return 'LA';
    if (tl.includes('فرنسية')) return 'FR';
    if (tl.includes('عربية')) return 'AR';
    if (tl.includes('إنكليزية')) return 'EN';
    return 'EN';
  }
  return 'EN';
};

function bridgeToWord(b: BridgeEntry): WordData {
  return {
    id: b.id,
    european: b.modernWord || '',
    arabicRoot: b.arabicRoot || '',
    rootId: 'ATUM',
    rule: b.transformationRule || '',
    meaning: b.modernMeaning || '',
    confidence: mapConfidence(b.confidence),
    language: detectLanguage(b),
  };
}

function dbToWord(d: DatabaseEntry): WordData {
  return {
    id: `db-${d.id}`,
    european: d.word || '',
    arabicRoot: '',
    rootId: mapRoot(d.root),
    rule: '',
    meaning: d.meaning || '',
    confidence: mapConfidence(d.confidence),
    language: detectLanguage(d),
  };
}

export function getEtymologyByWord(slug: string): WordData | null {
  if (!slug) return null;
  const db = loadDb();
  const lower = slug.toLowerCase();

  for (const b of db.bridge) {
    if (b.modernWord && b.modernWord.toLowerCase() === lower) return bridgeToWord(b);
  }
  for (const d of db.database) {
    if (d.word && d.word.toLowerCase() === lower) return dbToWord(d);
  }
  return null;
}

export function getRelatedWords(rootId: string, excludeSlug: string, limit = 8): WordData[] {
  const db = loadDb();
  const lower = excludeSlug.toLowerCase();
  const results: WordData[] = [];

  for (const b of db.bridge) {
    if (results.length >= limit) break;
    if (!b.modernWord || b.modernWord.toLowerCase() === lower) continue;
    results.push(bridgeToWord(b));
  }
  for (const d of db.database) {
    if (results.length >= limit) break;
    if (!d.word || d.word.toLowerCase() === lower) continue;
    const w = dbToWord(d);
    if (w.rootId !== rootId) continue;
    results.push(w);
  }

  return results.slice(0, limit);
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

  const connector = conceptTitle ? `\n\n## ${conceptTitle}\n\n` : '';
  const body = intro + connector + (conceptExcerpt || '');

  return {
    word: word.toLowerCase(),
    locale: locale as 'ar' | 'en' | 'fr',
    content: body,
    excerpt: (intro + ' ' + (conceptExcerpt || '')).slice(0, 320),
    meta: { arabicRoot: '', root: rootId, confidence: '🧩' },
  };
}

export function getWordInsightData(word: string, locale: string, rootId?: string): InsightResult {
  if (!word) return { insight: null, source: 'none' };

  const fileInsight = getWordInsight(word, locale);
  if (fileInsight) return { insight: fileInsight, source: 'file' };

  if (rootId && ['ATUM', 'BULL', 'TOR'].includes(rootId)) {
    return { insight: buildFallback(word, rootId, locale), source: 'fallback' };
  }
  return { insight: null, source: 'none' };
}

const ROOT_TOPIC_MAP: Record<string, string[]> = {
  ATUM: ['atom', 'physics'],
  BULL: ['electromagnetic', 'physics'],
  TOR: ['sacred-geometry', 'physics'],
};

export function getRelatedConcepts(rootId: string, word: string): ScoredConcept[] {
  if (!['ATUM', 'BULL', 'TOR'].includes(rootId)) return [];
  const allConcepts = loadConcepts();
  const wordTerms = word.toLowerCase().split(/[\s_-]+/).filter(Boolean);
  const preferredTopics = ROOT_TOPIC_MAP[rootId] || [];

  const scored: ScoredConcept[] = allConcepts.map(c => {
    let score = 0;
    let matchType = 'general';
    const titleLower = c.title.toLowerCase();
    const contentLower = c.content.toLowerCase();
    const combined = titleLower + ' ' + contentLower;

    const rootInTitle = titleLower.includes(rootId.toLowerCase());
    const rootInContent = combined.includes(rootId.toLowerCase());

    if (rootInTitle) { score += 4; matchType = 'root-title'; }
    else if (rootInContent) { score += 2; matchType = 'root-content'; }

    if (preferredTopics.includes(c.topic)) { score += 2; if (matchType === 'general') matchType = 'topic'; }
    if (c.topic === 'roots-explanation') { score += 1; if (matchType === 'general') matchType = 'background'; }

    for (const term of wordTerms) {
      if (term.length >= 3 && combined.includes(term)) { score += 1; matchType = 'word-match'; }
    }
    return { ...c, relevance: score, matchType };
  });

  const sorted = scored.filter(c => c.relevance > 0).sort((a, b) => b.relevance - a.relevance);
  const top = sorted.slice(0, 3);
  if (top.length > 0) return top;

  const fallback = allConcepts.find(c => c.topic === 'roots-explanation');
  return fallback ? [{ ...fallback, relevance: 1, matchType: 'fallback' }] : [];
}

const CONFIDENCE_RANK: Record<string, number> = { proven: 0, strong: 1, moderate: 2, emerging: 3 };

export function getAllEtymologyWords(): WordData[] {
  const db = loadDb();
  const all: WordData[] = [];
  for (const b of db.bridge) {
    if (b.modernWord) all.push(bridgeToWord(b));
  }
  for (const d of db.database) {
    if (d.word) all.push(dbToWord(d));
  }
  return all;
}

export function getTopEtymologyWords(limit = 100): WordData[] {
  const all = getAllEtymologyWords();
  return all
    .filter(w => w.european)
    .sort((a, b) => {
      const ra = CONFIDENCE_RANK[a.confidence] ?? 9;
      const rb = CONFIDENCE_RANK[b.confidence] ?? 9;
      if (ra !== rb) return ra - rb;
      return a.european.localeCompare(b.european);
    })
    .slice(0, limit);
}
