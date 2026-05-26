import fs from 'fs';
import path from 'path';
import { loadWords, loadLetters } from '@/lib/data';
import LettersPage from '@/components/LettersPage';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const words = loadWords();
  const letters = loadLetters();
  return <LettersPage locale={locale} letters={letters} words={words} />;
}
