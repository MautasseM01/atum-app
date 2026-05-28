'use client';

import { useState } from 'react';
import SectionHeader from '@/components/SectionHeader';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import Footer from '@/components/Footer';

interface WordItem {
  id: string; european: string; arabicRoot: string; rootId: string; rule: string;
  meaning: string; confidence: string; path: string; languages: string[];
}

interface PatternsPageProps { locale: string; words: WordItem[]; }

const ROOTS_DATA: Record<string, { id: string; arabic: string; color: string; principle: string }> = {
  ATUM: { id: 'ATUM', arabic: 'أتم', color: '#22C55E', principle: 'Unity · Inertia · Containment' },
  BULL: { id: 'BULL', arabic: 'بول', color: '#EF4444', principle: 'Radiation · Expansion · Outward' },
  TOR: { id: 'TOR', arabic: 'طور', color: '#3B82F6', principle: 'Structure · Rotation · Cycles' },
};

function LearnCard({ rootId, words }: { rootId: string; words: WordItem[] }) {
  const root = ROOTS_DATA[rootId];
  const rootWords = words.filter(w => w.rootId === rootId).slice(0, 5);
  const [flipped, setFlipped] = useState(false);
  const color = root.color;

  return (
    <div onClick={() => setFlipped(!flipped)} style={{ cursor: 'pointer', width: '100%', height: 320, position: 'relative' }}>
      <div style={{
        position: 'absolute', inset: 0,
        opacity: flipped ? 0 : 1,
        transform: flipped ? 'scale(0.96)' : 'scale(1)',
        transition: 'all 377ms cubic-bezier(0.23, 1, 0.32, 1)',
        pointerEvents: flipped ? 'none' : 'auto',
        background: `linear-gradient(135deg, ${color}11, ${color}05)`,
        border: `1px solid ${color}33`,
        borderRadius: 21, padding: 34,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center',
      }}>
        <div style={{
          width: 89, height: 89, borderRadius: '50%',
          border: `2px solid ${color}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 21,
          boxShadow: `0 0 30px ${color}22`,
        }}>
          <span style={{ fontFamily: "'Amiri', serif", fontSize: 42, color: '#f39c12', direction: 'rtl' }}>{root.arabic}</span>
        </div>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 34, color, letterSpacing: '4px', marginBottom: 13 }}>
          {root.id}
        </div>
        <div style={{ fontSize: 16, color: '#8b949e', maxWidth: 360, lineHeight: 1.6 }}>
          {root.principle}
        </div>
        <div style={{ marginTop: 21, fontSize: 13, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>
          Click to see examples →
        </div>
      </div>

      <div style={{
        position: 'absolute', inset: 0,
        opacity: flipped ? 1 : 0,
        transform: flipped ? 'scale(1)' : 'scale(0.96)',
        transition: 'all 377ms cubic-bezier(0.23, 1, 0.32, 1)',
        pointerEvents: flipped ? 'auto' : 'none',
        background: 'rgba(22, 27, 34, 0.95)',
        border: `1px solid ${color}33`,
        borderRadius: 21, padding: 34,
        overflow: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 21, paddingBottom: 13, borderBottom: `1px solid ${color}22` }}>
          <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 21, color, letterSpacing: '3px' }}>
            {root.id} Words
          </span>
          <span style={{ fontSize: 13, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>
            ← flip back
          </span>
        </div>
        {rootWords.map((w, i) => (
          <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i < rootWords.length - 1 ? '1px solid rgba(48,54,61,0.3)' : 'none' }}>
            <div>
              <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 21, color: '#e6edf3' }}>
                {w.european}
              </span>
              {w.rule && <span style={{ fontSize: 13, color: '#22C55E', marginLeft: 13, fontFamily: "'JetBrains Mono', monospace" }}>
                {w.rule.split('→')[0]}
              </span>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 21, color: '#f39c12', direction: 'rtl' }}>
                {w.arabicRoot}
              </span>
              <ConfidenceBadge level={w.confidence} showLabel={false} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PracticeMode({ words }: { words: WordItem[] }) {
  const allWords = words;
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const word = allWords[idx % allWords.length] || { european: '', meaning: '', rootId: 'ATUM' };
  const isCorrect = chosen === word.rootId;
  const rootIds = ['ATUM', 'BULL', 'TOR'];

  const handleChoice = (rootId: string) => {
    if (chosen) return;
    setChosen(rootId);
    setTotal(t => t + 1);
    if (rootId === word.rootId) {
      setScore(s => s + 1);
      setStreak(s => { const n = s + 1; setBestStreak(b => Math.max(b, n)); return n; });
    } else setStreak(0);
  };

  const next = () => { setChosen(null); setIdx(i => { let n = i + 1; if (n >= allWords.length) n = 0; return n; }); };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 34, marginBottom: 55, flexWrap: 'wrap' }}>
        {[
          { label: 'Score', value: `${score}/${total}`, color: '#22C55E' },
          { label: 'Streak', value: streak, color: '#f39c12' },
          { label: 'Best', value: bestStreak, color: '#3B82F6' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 34, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#484f58', letterSpacing: '1.5px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 55, padding: '34px', background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)', borderRadius: 21 }}>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 55, color: '#e6edf3', marginBottom: 13, letterSpacing: '3px' }}>
          {word.european}
        </div>
        <div style={{ fontSize: 16, color: '#484f58', fontStyle: 'italic' }}>
          &ldquo;{word.meaning}&rdquo;
        </div>
      </div>

      <div style={{ display: 'flex', gap: 13, justifyContent: 'center', marginBottom: 34 }}>
        {rootIds.map(rootId => {
          const root = ROOTS_DATA[rootId];
          const isThis = chosen === rootId;
          const correct = word.rootId === rootId;
          let bg = `${root.color}15`;
          let border = `${root.color}44`;
          if (chosen) {
            if (correct) { bg = `${root.color}33`; border = root.color; }
            else if (isThis && !correct) { bg = 'rgba(239,68,68,0.15)'; border = '#EF4444'; }
            else { bg = 'rgba(22,27,34,0.3)'; border = 'rgba(48,54,61,0.3)'; }
          }
          return (
            <button
              key={rootId}
              onClick={() => handleChoice(rootId)}
              style={{
                flex: 1, padding: '21px 13px', borderRadius: 13,
                background: bg, border: `2px solid ${border}`,
                cursor: chosen ? 'default' : 'pointer',
                transition: 'all 233ms ease',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                opacity: chosen && !correct && !isThis ? 0.4 : 1,
                boxShadow: (chosen && correct) ? `0 0 30px ${root.color}33` : 'none',
              }}
            >
              <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 21, color: root.color, letterSpacing: '2px' }}>{rootId}</span>
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 24, color: '#f39c12', direction: 'rtl' }}>{root.arabic}</span>
            </button>
          );
        })}
      </div>

      {chosen && (
        <div style={{ padding: '21px', borderRadius: 13, marginBottom: 21, background: isCorrect ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isCorrect ? '#22C55E' : '#EF4444'}33` }}>
          <div style={{ fontSize: 18, color: isCorrect ? '#22C55E' : '#EF4444', marginBottom: 8 }}>
            {isCorrect ? 'Correct!' : 'Not quite.'}
          </div>
          {!isCorrect && <div style={{ fontSize: 14, color: '#8b949e' }}>The root is {word.rootId} ({ROOTS_DATA[word.rootId]?.arabic})</div>}
          <button
            onClick={next}
            style={{
              marginTop: 13, padding: '10px 34px', borderRadius: 21,
              background: '#f39c12', border: 'none', color: '#0a0a0f',
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: "'Source Serif 4', serif",
            }}
          >
            Next Word →
          </button>
        </div>
      )}
    </div>
  );
}

function ExploreGrid({ words, locale }: { words: WordItem[]; locale: string }) {
  const grouped: Record<string, WordItem[]> = { ATUM: [], BULL: [], TOR: [] };
  words.forEach(w => { if (grouped[w.rootId]) grouped[w.rootId].push(w); });

  return (
    <div style={{ display: 'flex', gap: 21, flexWrap: 'wrap' }}>
      {['ATUM', 'BULL', 'TOR'].map(rootId => {
        const root = ROOTS_DATA[rootId];
        return (
          <div key={rootId} style={{ flex: '1 1 300px', minWidth: 280 }}>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 21, color: root.color, letterSpacing: '3px', marginBottom: 13, paddingBottom: 8, borderBottom: `1px solid ${root.color}33`, display: 'flex', alignItems: 'center', gap: 13 }}>
              {root.id}
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 21, color: '#f39c12', direction: 'rtl' }}>{root.arabic}</span>
            </div>
            {grouped[rootId].map(w => (
              <div key={w.id} style={{ padding: '10px 13px', marginBottom: 4, borderRadius: 8, cursor: 'pointer', transition: 'background 144ms ease', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = `${root.color}11`}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                onClick={() => window.location.href = `/${locale}/explorer?search=${encodeURIComponent(w.european)}`}
              >
                <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 16, color: '#e6edf3' }}>{w.european}</span>
                <ConfidenceBadge level={w.confidence} showLabel={false} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

export default function PatternsPage({ locale, words }: PatternsPageProps) {
  const [mode, setMode] = useState('learn');
  const modes = [
    { id: 'learn', label: 'LEARN' },
    { id: 'practice', label: 'PRACTICE' },
    { id: 'explore', label: 'EXPLORE' },
  ];

  return (
    <>
      <div style={{ padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title="Pattern Learning" subtitle="Understand the three electromagnetic roots through study, practice, and exploration." />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 55, gap: 4, background: 'rgba(22,27,34,0.6)', borderRadius: 13, padding: 4, width: 'fit-content', margin: '0 auto 55px', border: '1px solid rgba(48,54,61,0.4)' }}>
          {modes.map(m => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              style={{
                padding: '10px 34px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13, letterSpacing: '2px', fontWeight: 600,
                background: mode === m.id ? 'rgba(243,156,18,0.15)' : 'transparent',
                color: mode === m.id ? '#f39c12' : '#484f58',
                transition: 'all 233ms ease',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'learn' && (
          <>
            <div style={{ maxWidth: 700, margin: '0 auto 34px', textAlign: 'center', fontSize: 15, color: '#8b949e', fontStyle: 'italic', lineHeight: 1.9 }}>
              The same way Arabic <span style={{ fontFamily: "'Amiri', serif", fontSize: 20, color: '#f39c12' }}>أوزان الأفعال</span> give you:<br />
              كتب → كاتب، مكتوب، كتابة، مكتبة...<br /><br />
              ATUM, BULL, TOR work across ALL languages:<br />
              طور → TOR → Tour, Tower, Torus, Tornado...
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 21 }}>
              <LearnCard rootId="ATUM" words={words} />
              <LearnCard rootId="BULL" words={words} />
              <LearnCard rootId="TOR" words={words} />
            </div>
          </>
        )}

        {mode === 'practice' && <PracticeMode words={words} />}

        {mode === 'explore' && <ExploreGrid words={words} locale={locale} />}
      </div>
      <Footer />
    </>
  );
}
