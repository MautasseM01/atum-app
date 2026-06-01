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
  confidence: string;
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

interface PoolItem {
  european: string;
  rootId: string;
  arabicRoot: string;
  confidence: string;
  meaning: string;
  language: string;
  source: 'bridge' | 'database';
}

let cachedDb: EtymologyDB | null = null;
let cachedPool: PoolItem[] | null = null;

async function loadDatabase(): Promise<EtymologyDB> {
  if (cachedDb) return cachedDb;
  const filePath = path.join(process.cwd(), 'data', 'etymologies.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  cachedDb = JSON.parse(raw) as EtymologyDB;
  return cachedDb;
}

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

function buildPool(bridge: BridgeEntry[], database: DatabaseEntry[]): PoolItem[] {
  const pool: PoolItem[] = [];
  for (const b of bridge) {
    if (!b.modernWord) continue;
    pool.push({
      european: b.modernWord,
      rootId: 'ATUM',
      arabicRoot: b.arabicRoot || '',
      confidence: b.confidence || '🧩',
      meaning: b.modernMeaning || '',
      language: detectLanguage(b),
      source: 'bridge',
    });
  }
  for (const d of database) {
    if (!d.word) continue;
    pool.push({
      european: d.word,
      rootId: mapRoot(d.root),
      arabicRoot: '',
      confidence: typeof d.confidence === 'number' ? String(d.confidence) : (d.confidence || '🧩'),
      meaning: d.meaning || '',
      language: detectLanguage(d),
      source: 'database',
    });
  }
  return pool;
}

const FEATURED = [
  'paradise', 'atlas', 'atom', 'tower', 'tour',
  'algebra', 'algorithm', 'almanac', 'alchemy',
  'magazine', 'sofa', 'candy', 'coffee', 'lemon',
  'caesar', 'europe', 'jordan', 'italy', 'human',
  'alpha', 'beta', 'omega', 'delta', 'sigma',
  'iris', 'vision', 'medicine', 'magic', 'mosque',
];

export async function GET(_req: NextRequest) {
  try {
    const db = await loadDatabase();
    if (!cachedPool) cachedPool = buildPool(db.bridge, db.database);

    const searchParams = new URL(_req.url).searchParams;
    const root = (searchParams.get('root') || '').toUpperCase();
    const lang = (searchParams.get('lang') || '').toUpperCase();

    let candidates = cachedPool;
    if (root && root !== 'ALL' && ['ATUM', 'BULL', 'TOR'].includes(root)) {
      candidates = candidates.filter(c => c.rootId === root);
    }
    if (lang && lang !== 'ALL') {
      candidates = candidates.filter(c => c.language === lang);
    }
    if (candidates.length === 0) candidates = cachedPool;

    let pick = FEATURED[Math.floor(Math.random() * FEATURED.length)];
    const found = candidates.find(c => c.european.toLowerCase() === pick.toLowerCase());
    if (!found) {
      const fallback = candidates[Math.floor(Math.random() * candidates.length)];
      pick = fallback.european;
    } else {
      pick = found.european;
    }

    return NextResponse.json({ word: pick });
  } catch (e) {
    console.error('Random API error:', e);
    return NextResponse.json({ word: 'paradise' });
  }
}
