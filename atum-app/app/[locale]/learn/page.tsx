import { loadConceptIndex, getConceptContent, type Locale } from '@/lib/concepts-data';
import LearnPage from '@/components/LearnPage';

const SEQUENCE_IDS = ['roots-explained', 'language-physics', 'phonetic-conservation', 'one-language'];

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const idx = loadConceptIndex();
  const sequence = SEQUENCE_IDS
    .map(id => idx.concepts.find(c => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map(concept => {
      const content = getConceptContent(concept.id, locale as Locale);
      return { concept, body: content?.body || '' };
    });

  return <LearnPage sequence={sequence} />;
}
