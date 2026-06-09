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
  meta: { totalConcepts: number; totalWordInsights: number; chatInsightTopics: number; languages: string[] };
  concepts: IndexConcept[];
  chatInsights?: ChatInsightTopic[];
  wordInsights?: Array<{ word: string; root: string; confidence: string; files: Record<string, string>; relatedConcepts?: string[] }>;
}

export interface ChatInsightTopic {
  topic: string;
  title?: { ar?: string; en?: string; fr?: string };
  files: { ar?: string; en?: string; fr?: string };
  lastUpdated?: string;
}

export function hasFlag(confidence: string, flag: string): boolean {
  return confidence.includes(flag);
}

export const NEEDS_DISCLAIMER = new Set<string>([
  'wormhole-letter', 'bull-force', 'syncretism-core', 'vibrational-reality',
  'vibration', 'cosmic-symbols', 'hermetic-mind', 'atomology-original',
]);

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
  'philosophy': { ar: 'فلسفة', en: 'Philosophy', fr: 'Philosophie' },
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
    id: 'start-here',
    title: { ar: 'ابدأ هنا', en: 'Start Here', fr: 'Commencez Ici' },
    description: {
      ar: 'المفاهيم الأساسية: ما هي الجذور الثلاثة، وكيف ترتبط اللغة بالفيزياء.',
      en: 'The essential concepts: what the three roots are, and how language connects to physics.',
      fr: 'Les concepts essentiels : ce que sont les trois racines, et comment la langue se connecte à la physique.',
    },
    conceptIds: ['roots-explained', 'language-physics', 'electromagnetic-source'],
  },
  {
    id: 'three-roots',
    title: { ar: 'الجذور الثلاثة', en: 'The Three Roots', fr: 'Les Trois Racines' },
    description: {
      ar: 'تعمق في كل جذر: خريطة أتوم، قوة بول، ولغة البشرية الواحدة.',
      en: 'Deep dive into each root: ATUM-map, BULL-force, and humanity\'s one language.',
      fr: 'Plongée dans chaque racine : carte d\'ATUM, force BULL, et la langue unique de l\'humanité.',
    },
    conceptIds: ['atum-etymology-map', 'bull-force', 'one-language'],
  },
  {
    id: 'method',
    title: { ar: 'المنهج', en: 'The Method', fr: 'La Méthode' },
    description: {
      ar: 'مناهج البحث: إبدال القبيسي، نظرية داوود للآباء الثلاثة.',
      en: 'Research methodologies: Al-Qubaysi\'s ibdal, Dawood\'s three-fathers theory.',
      fr: 'Méthodologies de recherche : l\'ibdal d\'Al-Qubaysi, la théorie des trois pères de Dawood.',
    },
    conceptIds: ['dawood-method', 'qubaysi-ibdal'],
  },
  {
    id: 'deep-theory',
    title: { ar: 'نظرية عميقة', en: 'Deep Theory', fr: 'Théorie Approfondie' },
    description: {
      ar: 'أفكار متقدمة: الحرف كثقب دودي، العقل الهرمسي، هندسة تينن، الأتمولوجيا.',
      en: 'Advanced ideas: letter as wormhole, hermetic mind, Tenen geometry, atomology.',
      fr: 'Idées avancées : la lettre comme trou de ver, esprit hermétique, géométrie de Tenen, atomologie.',
    },
    conceptIds: ['wormhole-letter', 'hermetic-mind', 'tenen-geometry', 'atomology-universal', 'ontology-core', 'kuhn-consciousness'],
  },
  {
    id: 'evidence',
    title: { ar: 'الأدلة', en: 'The Evidence', fr: 'Les Preuves' },
    description: {
      ar: 'نتائج البحث الراسخة: حفظ العربية للأصوات، الأنماط السبعة، ونتائج علم البيانات.',
      en: 'Established research findings: phonetic conservation, the seven patterns, and data science results.',
      fr: 'Résultats de recherche établis : conservation phonétique, les sept motifs, et résultats de science des données.',
    },
    conceptIds: ['research-findings', 'phonetic-conservation'],
  },
  {
    id: 'exploratory',
    title: { ar: 'استكشافي ❓', en: 'Exploratory ❓', fr: 'Exploratoire ❓' },
    description: {
      ar: 'مفاهيم استكشافية ذات ثقة أقل — أفكار مثيرة للاهتمام تتطلب بحثاً إضافياً.',
      en: 'Speculative concepts with lower confidence — intriguing ideas needing further research.',
      fr: 'Concepts spéculatifs à confiance réduite — idées intrigantes nécessitant davantage de recherches.',
    },
    conceptIds: ['vibration', 'sacred-sound', 'syncretism-core', 'cosmic-symbols', 'seven-patterns', 'seven-patterns-deep', 'other-sources', 'atomology-original'],
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
