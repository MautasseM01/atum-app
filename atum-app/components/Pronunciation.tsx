'use client';

interface PronunciationProps {
  text: string;
  arabic?: string;
  ipa?: string;
}

const SIMPLE_IPA: Record<string, string> = {
  a: 'æ', e: 'ɛ', i: 'ɪ', o: 'ɒ', u: 'ʌ',
  aa: 'ɑː', ee: 'iː', oo: 'uː',
  th: 'θ', sh: 'ʃ', ch: 'tʃ', kh: 'x', gh: 'ɣ',
};

function guessIPA(word: string): string {
  const lower = word.toLowerCase();
  if (lower.startsWith('ph')) return '/f/';
  if (lower.startsWith('ps')) return '/s/';
  let ipa = '';
  let i = 0;
  while (i < lower.length) {
    if (i < lower.length - 1 && SIMPLE_IPA[lower.slice(i, i + 2)]) {
      ipa += SIMPLE_IPA[lower.slice(i, i + 2)]; i += 2;
    } else if (SIMPLE_IPA[lower[i]]) {
      ipa += SIMPLE_IPA[lower[i]]; i++;
    } else {
      ipa += lower[i]; i++;
    }
  }
  return '/' + ipa + '/';
}

export default function Pronunciation({ text, arabic, ipa }: PronunciationProps) {
  const displayIpa = ipa || guessIPA(text);

  const speak = (word: string) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = /[\u0600-\u06FF]/.test(word) ? 'ar-SA' : 'en-US';
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
          onClick={() => speak(arabic)}
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
