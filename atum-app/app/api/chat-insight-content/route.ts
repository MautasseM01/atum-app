import { NextRequest, NextResponse } from 'next/server';
import { getChatInsightContent } from '@/lib/concepts-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const topic = searchParams.get('topic') || '';
  const locale = (searchParams.get('locale') || 'en') as 'ar' | 'en' | 'fr';

  if (!topic) {
    return NextResponse.json({ content: null, found: false });
  }

  const content = getChatInsightContent(topic, locale);
  if (!content) {
    return NextResponse.json({ content: null, found: false });
  }

  const cleaned = content
    .replace(/^---\s*([\s\S]*?)\s*---\s*/, '')
    .replace(/^#\s+[^\n]*\n+/, '')
    .trim();

  return NextResponse.json({ content: cleaned, topic, found: true, locale });
}
