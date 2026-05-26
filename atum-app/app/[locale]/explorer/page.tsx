import { loadWords } from '@/lib/data';
import ExplorerPage from '@/components/ExplorerPage';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const words = loadWords();
  return <ExplorerPage locale={locale} words={words} />;
}
