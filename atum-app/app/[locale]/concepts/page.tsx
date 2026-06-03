import { loadConceptIndex } from '@/lib/concepts-data';
import { CONCEPT_GROUPS, type IndexConcept } from '@/lib/concepts';
import ConceptsPage from '@/components/ConceptsPage';

export default function Page() {
  const idx = loadConceptIndex();
  const byId = new Map<string, IndexConcept>(idx.concepts.map(c => [c.id, c]));

  const groups = CONCEPT_GROUPS.map(g => ({
    ...g,
    concepts: g.conceptIds
      .map(id => byId.get(id))
      .filter((c): c is IndexConcept => Boolean(c)),
  }));

  return <ConceptsPage groups={groups} />;
}

export const metadata = {
  title: 'Concepts — ATUM',
};
