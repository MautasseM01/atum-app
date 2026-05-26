import { loadWords } from '@/lib/data';
import ResearchPage from '@/components/ResearchPage';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const words = loadWords();
  return <ResearchPage locale={locale} words={words} />;
}
