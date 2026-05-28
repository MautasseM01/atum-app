import { loadWords } from '@/lib/data';
import HomePage from '@/components/HomePage';

export default async function IndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const words = loadWords();

  return <HomePage locale={locale} words={words} />;
}
