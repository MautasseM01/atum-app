import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Concept {
  id: string; title: string; topic: string; content: string; sourceFile: string;
}

interface ScoredConcept extends Concept {
  relevance: number;
  matchType: string;
}

let cached: Concept[] | null = null;

function loadConcepts(): Concept[] {
  if (!cached) {
    const fp = path.join(process.cwd(), 'data', 'sources', 'concepts.json');
    const raw = JSON.parse(fs.readFileSync(fp, 'utf8'));
    cached = raw.concepts || [];
  }
  return cached!;
}

const ROOT_TOPIC_MAP: Record<string, string[]> = {
  ATUM: ['atom', 'physics'],
  BULL: ['electromagnetic', 'physics'],
  TOR: ['sacred-geometry', 'physics'],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const root = (searchParams.get('root') || '').toUpperCase();
  const word = (searchParams.get('word') || '').toLowerCase();

  if (!root || !['ATUM', 'BULL', 'TOR'].includes(root)) {
    return NextResponse.json({ concepts: [], matchedBy: 'invalid-root' });
  }

  const allConcepts = loadConcepts();
  const wordTerms = word.split(/[\s_-]+/).filter(Boolean);
  const preferredTopics = ROOT_TOPIC_MAP[root] || [];

  const scored: ScoredConcept[] = allConcepts.map(c => {
    let score = 0;
    let matchType = 'general';

    const titleLower = c.title.toLowerCase();
    const contentLower = c.content.toLowerCase();
    const combined = titleLower + ' ' + contentLower;

    const rootInTitle = titleLower.includes(root.toLowerCase());
    const rootInContent = combined.includes(root.toLowerCase());

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

  if (top.length === 0) {
    const fallback = allConcepts.find(c => c.topic === 'roots-explanation');
    if (fallback) {
      return NextResponse.json({ concepts: [{ ...fallback, relevance: 1, matchType: 'fallback' }], matchedBy: 'fallback' });
    }
  }

  return NextResponse.json({ concepts: top, matchedBy: top[0]?.matchType || 'none' });
}
