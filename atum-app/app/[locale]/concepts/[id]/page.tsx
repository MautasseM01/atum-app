import { notFound } from 'next/navigation';
import { getConceptById, loadConceptIndex } from '@/lib/concepts-data';
import ConceptDetailPage from '@/components/ConceptDetailPage';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const concept = getConceptById(id);
  if (!concept) notFound();
  return <ConceptDetailPage concept={concept} />;
}

export async function generateStaticParams() {
  const idx = loadConceptIndex();
  return idx.concepts.map(c => ({ id: c.id }));
}
