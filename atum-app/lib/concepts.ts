export type Locale = 'ar' | 'en' | 'fr';

export interface IndexConcept {
  id: string;
  title: { ar?: string; en?: string; fr?: string };
  topic: string;
  relatedRoot: 'ATUM' | 'BULL' | 'TOR' | 'ALL';
  files: { ar?: string; en?: string; fr?: string };
  confidence: string;
  relatedWords?: string[];
}

export interface ConceptIndex {
  meta: { totalConcepts: number; totalWordInsights: number; languages: string[] };
  concepts: IndexConcept[];
}

export const ROOT_COLOR: Record<string, string> = {
  ATUM: '#22C55E',
  BULL: '#EF4444',
  TOR: '#3B82F6',
  ALL: '#f39c12',
};

export const TOPIC_LABEL: Record<string, { ar: string; en: string; fr: string }> = {
  'roots-explanation': { ar: 'الجذور', en: 'Roots', fr: 'Racines' },
  'electromagnetic': { ar: 'كهرومغناطيسي', en: 'Electromagnetic', fr: 'Électromagnétique' },
  'bonacci-theory': { ar: 'نظرية بوناتشي', en: 'Bonacci Theory', fr: 'Théorie de Bonacci' },
  'language-origin': { ar: 'أصل اللغة', en: 'Language Origin', fr: 'Origine des Langues' },
  'sacred-geometry': { ar: 'هندسة مقدسة', en: 'Sacred Geometry', fr: 'Géométrie Sacrée' },
  'ontology': { ar: 'أنطولوجيا', en: 'Ontology', fr: 'Ontologie' },
  'data-science': { ar: 'علم البيانات', en: 'Data Science', fr: 'Science des Données' },
  'physics': { ar: 'فيزياء', en: 'Physics', fr: 'Physique' },
};

export function topicLabel(topic: string, locale: Locale): string {
  return TOPIC_LABEL[topic]?.[locale] || topic;
}

export interface ConceptGroup {
  id: string;
  title: { ar: string; en: string; fr: string };
  description: { ar: string; en: string; fr: string };
  conceptIds: string[];
}

export const CONCEPT_GROUPS: ConceptGroup[] = [
  {
    id: 'foundations',
    title: { ar: 'الأسس', en: 'Foundations', fr: 'Fondations' },
    description: {
      ar: 'ابدأ هنا. هذه المفاهيم تشرح الجذور الثلاثة ولماذا تعمل.',
      en: 'Start here. These explain what the three roots are and why they work.',
      fr: 'Commencez ici. Ces concepts expliquent les trois racines et pourquoi elles fonctionnent.',
    },
    conceptIds: ['roots-explained', 'language-physics'],
  },
  {
    id: 'theory',
    title: { ar: 'النظرية', en: 'The Theory', fr: 'La Théorie' },
    description: {
      ar: 'الأفكار العميقة: الحرف كثقب دودي، البنية الأنطولوجية.',
      en: 'Deeper ideas: the letter as wormhole, ontological structure.',
      fr: 'Idées profondes : la lettre comme trou de ver, structure ontologique.',
    },
    conceptIds: ['wormhole-letter', 'ontology-core', 'syncretism-core', 'bull-force'],
  },
  {
    id: 'evidence',
    title: { ar: 'الأدلة', en: 'The Evidence', fr: 'Les Preuves' },
    description: {
      ar: 'لماذا حافظت العربية على الأصوات، والأنماط السبعة، وعلم البيانات.',
      en: 'Why Arabic preserved the sounds, the seven patterns, the data.',
      fr: 'Pourquoi l\'arabe a préservé les sons, les sept motifs, les données.',
    },
    conceptIds: ['phonetic-conservation', 'seven-patterns', 'research-findings', 'one-language'],
  },
  {
    id: 'deep-sources',
    title: { ar: 'مصادر عميقة', en: 'Deep Sources', fr: 'Sources Profondes' },
    description: {
      ar: 'من نوتبوكات NotebookLM: تينن، الاهتزاز، الصوت المقدس.',
      en: 'From NotebookLM notebooks: Tenen, vibration, sacred sound.',
      fr: 'Des carnets NotebookLM : Tenen, vibration, son sacré.',
    },
    conceptIds: ['tenen-geometry', 'vibration', 'sacred-sound'],
  },
];

export function pickLocale(value: string | { ar?: string; en?: string; fr?: string } | null | undefined, locale: Locale): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[locale] || value.en || value.ar || value.fr || '';
}

export function getRootAccent(relatedRoot: string): string {
  return ROOT_COLOR[relatedRoot] || ROOT_COLOR.ALL;
}
