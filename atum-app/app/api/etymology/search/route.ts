import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

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

interface SearchResultItem {
  id: string;
  european: string;
  arabicRoot: string;
  rootId: string;
  rule: string;
  meaning: string;
  confidence: string;
  language: string;
}

interface SearchResponse {
  results: SearchResultItem[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  counts: { ATUM: number; BULL: number; TOR: number };
}

interface EtymologyDB {
  bridge: BridgeEntry[];
  database: DatabaseEntry[];
}

let cachedDb: EtymologyDB | null = null;

async function loadDatabase(): Promise<EtymologyDB> {
  if (cachedDb) return cachedDb;
  const filePath = path.join(process.cwd(), 'data', 'etymologies.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  cachedDb = JSON.parse(raw) as EtymologyDB;
  return cachedDb;
}

const EMPTY_RESPONSE: SearchResponse = {
  results: [], total: 0, page: 1, limit: 50, hasMore: false, counts: { ATUM: 0, BULL: 0, TOR: 0 },
};

const mapConfidence = (c: unknown) => {
  if (!c) return 'emerging';
  const s = String(c).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (s.includes('proven') || s.includes('high') || s.includes('عال') || s.includes('مؤكد')) return 'proven';
  if (s.includes('strong') || s.includes('probable') || s.includes('محتم')) return 'strong';
  if (s.includes('moderate') || s.includes('exploratory') || s.includes('استكش') || s.includes('تخم')) return 'moderate';
  if (s.includes('0.9') || (typeof c === 'number' && c >= 0.9)) return 'proven';
  if (s.includes('0.7') || (typeof c === 'number' && c >= 0.7)) return 'strong';
  return 'emerging';
};

const mapRoot = (r: string | undefined) => {
  if (!r) return 'ATUM';
  const u = r.toUpperCase().replace('ATOM', 'ATUM');
  if (['ATUM', 'BULL', 'TOR'].includes(u)) return u;
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

function precomputeCounts(bridge: BridgeEntry[], database: DatabaseEntry[]) {
  const counts: Record<string, number> = { ATUM: 0, BULL: 0, TOR: 0 };
  counts.ATUM += bridge.length;
  for (const d of database) {
    const root = mapRoot(d.root);
    counts[root]++;
  }
  return counts as { ATUM: number; BULL: number; TOR: number };
}

function matchesQuery(val: string | undefined | null, query: string): boolean {
  if (!query) return true;
  if (!val) return false;
  return val.toLowerCase().includes(query);
}

function matchesLanguage(lang: string, filter: string | undefined): boolean {
  if (!filter || filter === 'ALL') return true;
  return lang === filter;
}

export async function GET(req: NextRequest) {
  try {
    const db = await loadDatabase();
    const url = new URL(req.url);
    const q = url.searchParams.get('q')?.trim() || '';
    const root = url.searchParams.get('root')?.toUpperCase().trim() || '';
    const lang = url.searchParams.get('lang')?.toUpperCase().trim() || '';
    const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '50', 10), 1), 500);

    const counts = precomputeCounts(db.bridge, db.database);

    let results: SearchResultItem[] = [];

    for (const b of db.bridge) {
      const item: SearchResultItem = {
        id: b.id,
        european: b.modernWord || '',
        arabicRoot: b.arabicRoot || '',
        rootId: 'ATUM',
        rule: b.transformationRule || '',
        meaning: b.modernMeaning || '',
        confidence: mapConfidence(b.confidence),
        language: detectLanguage(b),
      };
      if (q && !matchesQuery(item.european, q) && !matchesQuery(item.arabicRoot, q) && !matchesQuery(item.meaning, q)) continue;
      if (root && root !== 'ALL' && item.rootId !== root) continue;
      if (!matchesLanguage(item.language, lang)) continue;
      results.push(item);
    }

    for (const d of db.database) {
      const item: SearchResultItem = {
        id: `db-${d.id}`,
        european: d.word || '',
        arabicRoot: '',
        rootId: mapRoot(d.root),
        rule: '',
        meaning: d.meaning || '',
        confidence: mapConfidence(d.confidence),
        language: detectLanguage(d),
      };
      if (q && !matchesQuery(item.european, q) && !matchesQuery(item.meaning, q)) continue;
      if (root && root !== 'ALL' && item.rootId !== root) continue;
      if (!matchesLanguage(item.language, lang)) continue;
      results.push(item);
    }

    const total = results.length;
    const offset = (page - 1) * limit;
    const paginated = results.slice(offset, offset + limit);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      results: paginated,
      total,
      page,
      limit,
      hasMore,
      counts,
    });
  } catch (e) {
    console.error('Search API error:', e);
    return NextResponse.json(EMPTY_RESPONSE);
  }
}
