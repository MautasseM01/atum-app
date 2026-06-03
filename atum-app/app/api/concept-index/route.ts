import { NextResponse } from 'next/server';
import { loadConceptIndex } from '@/lib/concepts-data';

export async function GET() {
  return NextResponse.json(loadConceptIndex());
}
