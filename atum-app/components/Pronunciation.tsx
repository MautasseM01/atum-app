'use client';

interface PronunciationProps {
  text: string;
  arabic?: string;
  ipa?: string;
  language?: string; // 'EN' | 'FR' | 'GR' | 'LA' | 'AR'
}

// ── TTS language tag mapping ──────────────────────────────────────────────────
const LANG_TO_TTS: Record<string, string> = {
  EN: 'en-US',
  FR: 'fr-FR',
  GR: 'el-GR',
  LA: 'la',
  AR: 'ar-SA',
};

// ── English IPA ───────────────────────────────────────────────────────────────
const EN_DIGRAPHS: Record<string, string> = {
  aa: 'ɑː', ee: 'iː', oo: 'uː',
  th: 'θ', sh: 'ʃ', ch: 'tʃ', kh: 'x', gh: 'ɣ',
  ph: 'f', ps: 's',
};
const EN_VOWELS: Record<string, string> = {
  a: 'æ', e: 'ɛ', i: 'ɪ', o: 'ɒ', u: 'ʌ',
};

function guessIPA_EN(word: string): string {
  const lower = word.toLowerCase();
  let ipa = '';
  let i = 0;
  while (i < lower.length) {
    const di = lower.slice(i, i + 2);
    if (EN_DIGRAPHS[di]) {
      ipa += EN_DIGRAPHS[di]; i += 2;
    } else if (EN_VOWELS[lower[i]]) {
      ipa += EN_VOWELS[lower[i]]; i++;
    } else {
      ipa += lower[i]; i++;
    }
  }
  return '/' + ipa + '/';
}

// ── French IPA ────────────────────────────────────────────────────────────────
const FR_TRIGRAPHS: Record<string, string> = {
  eau: 'o', ain: 'ɛ̃', ein: 'ɛ̃',
};
const FR_DIGRAPHS: Record<string, string> = {
  ou: 'u', au: 'o', ai: 'ɛ', ei: 'ɛ', oi: 'wa',
  eu: 'ø', an: 'ɑ̃', en: 'ɑ̃', am: 'ɑ̃', em: 'ɑ̃',
  in: 'ɛ̃', im: 'ɛ̃', on: 'õ', om: 'õ', un: 'œ̃', um: 'œ̃',
  ch: 'ʃ', gn: 'ɲ', qu: 'k', ph: 'f',
};
const SILENT_FINAL = /[estxzd]$/;

function guessIPA_FR(word: string): string {
  const lower = word.toLowerCase();
  // strip silent final consonants/e for IPA purposes
  const stripped = lower.replace(SILENT_FINAL, '').replace(/e$/, '');
  let ipa = '';
  let i = 0;
  while (i < stripped.length) {
    const tri = stripped.slice(i, i + 3);
    const di  = stripped.slice(i, i + 2);
    if (FR_TRIGRAPHS[tri]) {
      ipa += FR_TRIGRAPHS[tri]; i += 3;
    } else if (FR_DIGRAPHS[di]) {
      ipa += FR_DIGRAPHS[di]; i += 2;
    } else if (stripped[i] === 'r') {
      ipa += 'ʁ'; i++;
    } else {
      ipa += stripped[i]; i++;
    }
  }
  return '/' + ipa + '/';
}

// ── Greek IPA ─────────────────────────────────────────────────────────────────
const GR_LETTERS: Record<string, string> = {
  α: 'a', β: 'v', γ: 'ɣ', δ: 'ð', ε: 'e', ζ: 'z', η: 'i',
  θ: 'θ', ι: 'i', κ: 'k', λ: 'l', μ: 'm', ν: 'n', ξ: 'ks',
  ο: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's', τ: 't', υ: 'i',
  φ: 'f', χ: 'x', ψ: 'ps', ω: 'o',
};
const GR_LATIN_DIGRAPHS: Record<string, string> = {
  th: 'θ', ph: 'f', ch: 'x', ps: 'ps', rh: 'r',
};
const GR_LATIN_VOWELS: Record<string, string> = {
  a: 'a', e: 'e', i: 'i', o: 'o', u: 'u',
};

function guessIPA_GR(word: string): string {
  const lower = word.toLowerCase();
  // Detect Greek script
  const isGreekScript = /[\u0370-\u03ff\u1f00-\u1fff]/.test(lower);
  let ipa = '';
  if (isGreekScript) {
    for (const ch of lower) {
      ipa += GR_LETTERS[ch] ?? ch;
    }
  } else {
    let i = 0;
    while (i < lower.length) {
      const di = lower.slice(i, i + 2);
      if (GR_LATIN_DIGRAPHS[di]) {
        ipa += GR_LATIN_DIGRAPHS[di]; i += 2;
      } else if (GR_LATIN_VOWELS[lower[i]]) {
        ipa += GR_LATIN_VOWELS[lower[i]]; i++;
      } else {
        ipa += lower[i]; i++;
      }
    }
  }
  return '/' + ipa + '/';
}

// ── Latin IPA ─────────────────────────────────────────────────────────────────
const LA_DIGRAPHS: Record<string, string> = {
  ae: 'aɪ', oe: 'ɔɪ', ph: 'f', qu: 'kw',
};
const LA_VOWELS: Record<string, string> = {
  a: 'a', e: 'ɛ', i: 'i', o: 'ɔ', u: 'u',
};

function guessIPA_LA(word: string): string {
  const lower = word.toLowerCase();
  let ipa = '';
  let i = 0;
  while (i < lower.length) {
    const di = lower.slice(i, i + 2);
    if (LA_DIGRAPHS[di]) {
      ipa += LA_DIGRAPHS[di]; i += 2;
    } else if (lower[i] === 'v') {
      ipa += 'w'; i++;
    } else if (lower[i] === 'x') {
      ipa += 'ks'; i++;
    } else if (lower[i] === 'c') {
      // Classical: always /k/
      ipa += 'k'; i++;
    } else if (lower[i] === 'g') {
      ipa += 'g'; i++;
    } else if (LA_VOWELS[lower[i]]) {
      ipa += LA_VOWELS[lower[i]]; i++;
    } else {
      ipa += lower[i]; i++;
    }
  }
  return '/' + ipa + '/';
}

// ── Arabic placeholder ────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function guessIPA_AR(word: string): string {
  return '/ʔarabɪ/';
}

// ── Dispatcher ────────────────────────────────────────────────────────────────
function guessIPA(word: string, language?: string): string {
  switch ((language || 'EN').toUpperCase()) {
    case 'FR': return guessIPA_FR(word);
    case 'GR': return guessIPA_GR(word);
    case 'LA': return guessIPA_LA(word);
    case 'AR': return guessIPA_AR(word);
    default:   return guessIPA_EN(word);
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Pronunciation({ text, arabic, ipa, language }: PronunciationProps) {
  const displayIpa = ipa || guessIPA(text, language);

  const speak = (word: string, langCode?: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = LANG_TO_TTS[langCode || language || 'EN'] || 'en-US';
    u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 13, marginTop: 8 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        background: 'rgba(48,54,61,0.3)', borderRadius: 8,
        padding: '6px 14px',
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: '#8b949e' }}>
          {displayIpa}
        </span>
        <button
          onClick={() => speak(text)}
          title="Listen to pronunciation"
          style={{
            background: 'none', border: 'none', color: '#8b949e',
            cursor: 'pointer', fontSize: 18, padding: '2px 6px',
            borderRadius: 4, transition: 'all 233ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#f39c12'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#8b949e'}
        >
          🔊
        </button>
      </div>
      {arabic && (
        <button
          onClick={() => speak(arabic, 'AR')}
          title="Listen to Arabic pronunciation"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(48,54,61,0.3)', borderRadius: 8, border: 'none',
            padding: '6px 14px', cursor: 'pointer', color: '#8b949e',
            fontSize: 14, transition: 'all 233ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#f39c12'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#8b949e'}
        >
          <span style={{ fontFamily: "'Amiri', serif", fontSize: 20, color: '#f39c12', direction: 'rtl' }}>{arabic}</span>
          <span style={{ fontSize: 14 }}>🔊</span>
        </button>
      )}
    </div>
  );
}
