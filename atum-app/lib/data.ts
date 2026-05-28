import ethos from '@/data/etymologies.json';
import ltrs from '@/data/letters.json';

export interface RootInfo {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  principle: string;
  color: string;
  colorDim: string;
  colorGlow: string;
}

export interface WordInfo {
  id: string;
  european: string;
  arabicRoot: string;
  transliteration: string;
  rootId: string;
  rule: string;
  meaning: string;
  confidence: string;
  path: string;
  languages: string[];
}

export interface LetterInfo {
  letter: string;
  name: string;
  transliteration: string;
  rootAssociation: string;
  wordCount: number;
  phoenician: string;
}

export interface AppStats {
  totalWords: number;
  provenWords: number;
  sources: number;
  cnnAccuracy: string;
}

export const ROOT_DATA: Record<string, RootInfo> = {
  ATUM: { id: 'ATUM', arabic: 'أتم', transliteration: 'Atum', meaning: 'Unity, to complete', principle: 'Unity · Inertia · Containment', color: '#22C55E', colorDim: 'rgba(34,197,94,0.15)', colorGlow: 'rgba(34,197,94,0.4)' },
  BULL: { id: 'BULL', arabic: 'بول', transliteration: 'Bull', meaning: 'Radiation, expansion', principle: 'Radiation · Expansion · Outward', color: '#EF4444', colorDim: 'rgba(239,68,68,0.15)', colorGlow: 'rgba(239,68,68,0.4)' },
  TOR: { id: 'TOR', arabic: 'طور', transliteration: 'Tor', meaning: 'Cycle, rotation', principle: 'Structure · Rotation · Cycles', color: '#3B82F6', colorDim: 'rgba(59,130,246,0.15)', colorGlow: 'rgba(59,130,246,0.4)' },
};

export function loadWords(): WordInfo[] {
  try {
    const parsed = ethos as { bridge?: { id?: string; modernWord?: string; arabicRoot?: string; transformationRule?: string; modernMeaning?: string; confidence?: unknown; languagePath?: string; targetLanguage?: string }[]; database?: { id?: number; word?: string; arabicRoot?: string; root?: string; meaning?: string; confidence?: unknown; languagePath?: string }[] };
    const bridge = parsed.bridge || [];
    const database = parsed.database || [];

    const mapConfidence = (c: unknown) => {
      if (!c) return 'emerging';
      const s = String(c).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      if (s.includes('proven') || s.includes('high') || s.includes('عال') || s.includes('مؤكد')) return 'proven';
      if (s.includes('strong') || s.includes('probable') || s.includes('محتم')) return 'strong';
      if (s.includes('moderate') || s.includes('exploratory') || s.includes('استكش')) return 'moderate';
      if (s.includes('0.9') || (typeof c === 'number' && c >= 0.9)) return 'proven';
      if (s.includes('0.7') || (typeof c === 'number' && c >= 0.7)) return 'strong';
      return 'emerging';
    };

    const mapRoot = (r: string | undefined) => {
      if (!r) return 'ATUM';
      const u = r.toUpperCase().replace('ATOM', 'ATUM');
      if (['ATUM', 'BULL', 'TOR'].includes(u)) return u;
      return 'ATUM';
    };

    const words: WordInfo[] = [];

    for (const b of bridge) {
      words.push({
        id: b.id || `b-${Math.random()}`,
        european: b.modernWord || '',
        arabicRoot: b.arabicRoot || '',
        transliteration: '',
        rootId: 'ATUM',
        rule: b.transformationRule || '',
        meaning: b.modernMeaning || '',
        confidence: mapConfidence(b.confidence),
        path: b.languagePath || '',
        languages: [b.targetLanguage || ''],
      });
    }

    for (const d of database) {
      words.push({
        id: `db-${d.id ?? ''}`,
        european: d.word || '',
        arabicRoot: d.arabicRoot || '',
        transliteration: '',
        rootId: mapRoot(d.root),
        rule: '',
        meaning: d.meaning || '',
        confidence: mapConfidence(d.confidence),
        path: d.languagePath || '',
        languages: [],
      });
    }

    return words;
  } catch {
    return [];
  }
}

export interface RawLetter {
  id: number;
  arabic: string;
  name: string;
  nameAr: string;
  abjadValue: number;
  element: string;
  phoenician: string;
  protoSinaitic: string;
  transliteration?: string;
  dna?: {
    semanticDepth?: number;
    fundamentalFreqHz?: number;
    corpusFrequency?: number;
    energyType?: string;
    mataqadatClass?: string;
    phonosemanticVerdict?: string;
    cnnConfirmed?: boolean;
  };
}

export function loadLetters(): RawLetter[] {
  try {
    return (ltrs as { letters?: RawLetter[] }).letters || [];
  } catch {
    return [];
  }
}

export function loadStats(): AppStats {
  return { totalWords: 5083, provenWords: 96, sources: 5, cnnAccuracy: '99.7%' };
}
