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
  [key: string]: unknown;
}

interface EtymologyDB {
  meta: {
    bridgeCount: number;
    databaseCount: number;
    total: number;
  };
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

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q')?.toLowerCase().trim() || '';
  const root = searchParams.get('root')?.toUpperCase().trim() as 'ATOM' | 'BULL' | 'TOR' | '' | undefined;
  const dataset = searchParams.get('dataset')?.trim() as 'bridge' | 'database' | undefined;
  const confidence = searchParams.get('confidence')?.trim();
  const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10), 1), 500);
  const offset = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0);

  try {
    const db = await loadDatabase();
    let results: (BridgeEntry | DatabaseEntry)[] = [];

    // Search bridge
    if (!dataset || dataset === 'bridge') {
      results = results.concat(
        db.bridge.filter((entry) => {
          if (query && !entry.modernWord.toLowerCase().includes(query) &&
              !entry.arabicRoot.toLowerCase().includes(query) &&
              !entry.arabicMeaning.toLowerCase().includes(query) &&
              !entry.notes?.toLowerCase().includes(query)) {
            return false;
          }
          return true;
        })
      );
    }

    // Search database
    if (!dataset || dataset === 'database') {
      results = results.concat(
        db.database.filter((entry) => {
          if (query && !entry.word.toLowerCase().includes(query) &&
              !entry.meaning?.toLowerCase().includes(query) &&
              !entry.etymology?.toLowerCase().includes(query)) {
            return false;
          }
          if (root && entry.root !== root) return false;
          if (confidence && entry.source !== confidence) return false;
          return true;
        })
      );
    }

    // Pagination
    const total = results.length;
    const paginated = results.slice(offset, offset + limit);

    return NextResponse.json({
      success: true,
      query,
      filters: { root, dataset, confidence },
      pagination: { total, offset, limit, returned: paginated.length },
      results: paginated,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to search etymologies' },
      { status: 500 }
    );
  }
}
