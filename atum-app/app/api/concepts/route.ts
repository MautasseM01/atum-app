import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Concept {
  id: string; title: string; topic: string; content: string; sourceFile: string;
}

let cached: { concepts: Concept[] } | null = null;

export async function GET() {
  if (!cached) {
    const fp = path.join(process.cwd(), 'data', 'sources', 'concepts.json');
    cached = JSON.parse(fs.readFileSync(fp, 'utf8'));
  }
  return NextResponse.json(cached);
}
