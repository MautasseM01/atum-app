import { NextRequest, NextResponse } from 'next/server';
import { getConceptContent } from '@/lib/concepts-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || '';
  const locale = (searchParams.get('locale') || 'en') as 'ar' | 'en' | 'fr';

  if (!id) {
    return NextResponse.json({ content: null, found: false });
  }

  const content = getConceptContent(id, locale);
  if (!content) {
    return NextResponse.json({ content: null, found: false });
  }

  return NextResponse.json({ content, found: true });
}
