import fs from 'fs';
import path from 'path';

const VALID_LOCALES = ['ar', 'en', 'fr'] as const;
type Locale = (typeof VALID_LOCALES)[number];

export interface WordInsight {
  word: string;
  locale: Locale;
  content: string;
  excerpt: string;
  meta: {
    arabicRoot: string;
    root: string;
    confidence: string;
  };
}

function parseFrontmatter(md: string): { meta: WordInsight['meta']; body: string } {
  const yamlMatch = md.match(/^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/);
  if (yamlMatch) {
    const front = yamlMatch[1];
    const body = yamlMatch[2];
    const pick = (key: string): string => {
      const re = new RegExp(`${key}\\s*:\\s*([^\\n]+)$`, 'mi');
      const m = front.match(re);
      return m ? m[1].trim() : '';
    };
    return {
      meta: {
        arabicRoot: pick('Arabic root') || pick('الجذر العربي') || pick('Racine arabe'),
        root: pick('Cosmic root') || pick('الجذر الكوني') || pick('Racine cosmique') || pick('Root'),
        confidence: pick('Confidence') || pick('الثقة') || pick('Confiance'),
      },
      body,
    };
  }

  const arabicRootMatch = md.match(/\*\*(?:Arabic root|الجذر العربي|Racine arabe):\*\*\s*([^*\n]+)/i);
  const rootMatch = md.match(/\*\*(?:Cosmic root|الجذر الكوني|Racine cosmique):\*\*\s*([^*\n]+)/i);
  const confidenceMatch = md.match(/\*\*(?:Confidence|الثقة|Confiance):\*\*\s*([^*\n]+)/i);

  return {
    meta: {
      arabicRoot: arabicRootMatch ? arabicRootMatch[1].trim() : '',
      root: rootMatch ? rootMatch[1].trim() : '',
      confidence: confidenceMatch ? confidenceMatch[1].trim() : '',
    },
    body: md,
  };
}

function buildExcerpt(body: string, maxLen = 320): string {
  const cleaned = body
    .replace(/^#+\s+.*$/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (cleaned.length <= maxLen) return cleaned;
  const cut = cleaned.slice(0, maxLen);
  const lastSpace = cut.lastIndexOf(' ');
  return cut.slice(0, lastSpace > 0 ? lastSpace : maxLen) + '…';
}

export function getWordInsight(word: string, locale: string): WordInsight | null {
  if (!word || !VALID_LOCALES.includes(locale as Locale)) return null;

  const safeWord = word.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!safeWord) return null;

  const fp = path.join(process.cwd(), 'data', 'sources', 'word-insights', locale, `${safeWord}.md`);

  let raw: string;
  try {
    raw = fs.readFileSync(fp, 'utf8');
  } catch {
    return null;
  }

  const { meta, body } = parseFrontmatter(raw);
  return {
    word: safeWord,
    locale: locale as Locale,
    content: body.trim(),
    excerpt: buildExcerpt(body),
    meta,
  };
}
