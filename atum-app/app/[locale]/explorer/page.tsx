import { loadWords } from '@/lib/data';
import ExplorerPage from '@/components/ExplorerPage';

export default async function Page() {
  const words = loadWords();
  return <ExplorerPage words={words} />;
}
