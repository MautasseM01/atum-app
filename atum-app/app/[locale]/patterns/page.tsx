import { loadWords } from '@/lib/data';
import PatternsPage from '@/components/PatternsPage';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const words = loadWords();
  return <PatternsPage locale={locale} words={words} />;
}
