'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { RawLetter as LetterItem } from '@/lib/data';
import RootBadge from '@/components/RootBadge';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import Footer from '@/components/Footer';

interface WordItem {
  id: string; european: string; arabicRoot: string; rootId: string; rule: string;
  meaning: string; confidence: string; path: string; languages: string[];
}

interface LettersPageProps { locale: string; letters: LetterItem[]; words: WordItem[]; }

const ROOTS_DATA: Record<string, { id: string; color: string }> = {
  ATUM: { id: 'ATUM', color: '#22C55E' },
  BULL: { id: 'BULL', color: '#EF4444' },
  TOR: { id: 'TOR', color: '#3B82F6' },
};

const TRANS: Record<string, string> = {
  أ:'Alif', ب:'Baa', ج:'Jeem', د:'Daal', ه:'Haa', و:'Waaw', ز:'Zay',
  ح:'Hhaa', ط:'Ttaa', ي:'Yaa', ك:'Kaaf', ل:'Laam', م:'Meem', ن:'Noon',
  س:'Seen', ع:'Ayn', ف:'Faa', ص:'Saad', ق:'Qaaf', ر:'Raa', ش:'Sheen',
  ت:'Taa', ث:'Thaa', خ:'Khaa', ذ:'Dhaal', ض:'Ddad', ظ:'Ddhaa', غ:'Ghayn',
};

const PHOEN: Record<string, string> = {
  أ:'𐤀', ب:'𐤁', ج:'𐤂', د:'𐤃', ه:'𐤄', و:'𐤅', ز:'𐤆',
  ح:'𐤇', ط:'𐤈', ي:'𐤉', ك:'𐤊', ل:'𐤋', م:'𐤌', ن:'𐤍',
  س:'𐤎', ع:'𐤏', ف:'𐤐', ص:'𐤑', ق:'𐤒', ر:'𐤓', ش:'𐤔',
  ت:'𐤕', ث:'𐤔', خ:'𐤇', ذ:'𐤃', ض:'𐤑', ظ:'𐤈', غ:'𐤏',
};

const SOUND_ROOT: Record<string, string> = {
  أ:'ATUM', م:'ATUM', و:'ATUM', ن:'ATUM', ه:'ATUM', ل:'ATUM',
  ب:'BULL', ر:'BULL', ف:'BULL', ح:'BULL', ع:'BULL',
  ط:'TOR', د:'TOR', ز:'TOR', ك:'TOR', ت:'TOR', ق:'TOR',
};

function RadarChart({ data, color, size = 240 }: { data: number[]; color: string; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const dims = ['Frequency', 'Phonetic Shift', 'Root Affinity', 'Historical Depth', 'Cross-Language'];
  const n = dims.length;
  const angleStep = (Math.PI * 2) / n;

  const polyPoints = (values: number[]) =>
    values.map((v, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      return `${cx + r * v * Math.cos(angle)},${cy + r * v * Math.sin(angle)}`;
    }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {gridLevels.map(level => (
        <polygon key={level} points={polyPoints(Array(n).fill(level))} fill="none" stroke="rgba(48,54,61,0.4)" strokeWidth={0.5} />
      ))}
      {Array.from({ length: n }).map((_, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        return <line key={`ax-${i}`} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="rgba(48,54,61,0.3)" strokeWidth={0.5} />;
      })}
      <polygon points={polyPoints(data)} fill={`${color}22`} stroke={color} strokeWidth={2} />
      {data.map((v, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        return <circle key={`pt-${i}`} cx={cx + r * v * Math.cos(angle)} cy={cy + r * v * Math.sin(angle)} r={4} fill={color} stroke="#0a0a0f" strokeWidth={2} />;
      })}
      {dims.map((label, i) => {
        const angle = -Math.PI / 2 + i * angleStep;
        const lx = cx + (r + 24) * Math.cos(angle);
        const ly = cy + (r + 24) * Math.sin(angle);
        return <text key={`lb-${i}`} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" fill="#8b949e" fontSize={10} fontFamily="'JetBrains Mono', monospace">{label}</text>;
      })}
    </svg>
  );
}

function EvolutionTimeline({ letter }: { letter: LetterItem }) {
  const stages = [
    { era: '~1800 BCE', label: 'Proto-Sinaitic', glyph: '𓃾', color: '#f39c12' },
    { era: '~1050 BCE', label: 'Phoenician', glyph: '𐤀', color: '#EF4444' },
    { era: '~800 BCE', label: 'Aramaic', glyph: letter.arabic, color: '#3B82F6' },
    { era: '~400 CE', label: 'Arabic', glyph: letter.arabic, color: '#22C55E' },
    { era: 'Modern', label: 'Present', glyph: letter.arabic, color: '#f39c12' },
  ];

  return (
    <div>
      <div style={{ fontSize: 13, color: '#484f58', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginBottom: 21 }}>
        Script Evolution
      </div>
      <div style={{ position: 'relative', paddingLeft: 24 }}>
        <div style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 2, background: 'rgba(48,54,61,0.5)', borderRadius: 1 }} />
        {stages.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 21, padding: '13px 0', position: 'relative' }}>
            <div style={{ position: 'absolute', left: -21, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, borderRadius: '50%', background: s.color, border: '2px solid #0a0a0f', boxShadow: `0 0 8px ${s.color}44` }} />
            <div style={{ width: 55, height: 55, borderRadius: 13, background: `${s.color}11`, border: `1px solid ${s.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, color: s.color, fontFamily: i >= 2 ? "'Amiri', serif" : 'inherit' }}>
              {s.glyph}
            </div>
            <div>
              <div style={{ fontSize: 15, color: '#e6edf3' }}>{s.label}</div>
              <div style={{ fontSize: 12, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>{s.era}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LettersPage({ locale, letters, words }: LettersPageProps) {
  const router = useRouter();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const letter = letters[selectedIdx] || letters[0];

  const letterRootId = SOUND_ROOT[letter?.arabic] || 'ATUM';
  const letterRoot = ROOTS_DATA[letterRootId];

  const radarData = [
    0.5 + Math.sin(selectedIdx * 1.3) * 0.3,
    0.6 + Math.cos(selectedIdx * 0.8) * 0.25,
    0.7 + Math.sin(selectedIdx * 2.1) * 0.2,
    0.4 + Math.cos(selectedIdx * 1.7) * 0.35,
    0.55 + Math.sin(selectedIdx * 0.5) * 0.3,
  ];

  const relatedWords = useMemo(() => words.filter(w =>
    w.arabicRoot.includes(letter?.arabic) || w.rootId === letterRootId
  ).slice(0, 5), [words, letter, letterRootId]);

  if (!letter) {
    return (
      <div style={{ padding: '55px 34px 89px', textAlign: 'center', color: '#484f58' }}>
        Loading letters...
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 55, flexWrap: 'wrap' }}>
          {letters.map((l, i) => {
            const lr = SOUND_ROOT[l.arabic] || 'ATUM';
            const lRoot = ROOTS_DATA[lr];
            return (
              <button
                key={l.arabic}
                onClick={() => setSelectedIdx(i)}
                style={{
                  width: 48, height: 48, borderRadius: 13,
                  border: `1px solid ${selectedIdx === i ? lRoot.color : 'rgba(48,54,61,0.4)'}`,
                  background: selectedIdx === i ? `${lRoot.color}22` : 'transparent',
                  color: selectedIdx === i ? lRoot.color : '#8b949e',
                  fontFamily: "'Amiri', serif", fontSize: 24,
                  cursor: 'pointer', transition: 'all 233ms ease',
                  direction: 'rtl',
                }}
              >
                {l.arabic}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr 280px', gap: 34, alignItems: 'start' }}>
          <div style={{ background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)', borderRadius: 21, padding: 21 }}>
            <EvolutionTimeline letter={letter} />
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'Amiri', serif", fontSize: 120, color: '#f39c12',
              lineHeight: 1, direction: 'rtl',
              textShadow: `0 0 40px ${letterRoot.color}44, 0 0 80px ${letterRoot.color}22`,
              marginBottom: 8,
              transition: 'all 610ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}>
              {letter.arabic}
            </div>
            <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 21, color: '#e6edf3', letterSpacing: '2px', marginBottom: 2 }}>
              {letter.name}
            </div>
            <div style={{ fontSize: 14, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
              {TRANS[letter.arabic] || ''}
            </div>
            {letter.dna?.fundamentalFreqHz && (
              <div style={{ fontSize: 13, color: '#484f58', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>
                Hz: {letter.dna.fundamentalFreqHz}
              </div>
            )}
            {letter.dna?.energyType && (
              <div style={{ fontSize: 11, color: '#484f58', fontFamily: "'JetBrains Mono', monospace", marginBottom: 6, fontStyle: 'italic' }}>
                {letter.dna.energyType}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <RootBadge rootId={letterRootId} size="md" />
              {letter.dna?.cnnConfirmed && (
                <span style={{
                  fontSize: 10, fontWeight: 600, letterSpacing: '1px',
                  padding: '2px 8px', borderRadius: 6,
                  background: 'rgba(34,197,94,0.15)', color: '#22C55E',
                  border: '1px solid rgba(34,197,94,0.3)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  CNN
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: '#484f58', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
              Phoenician: {PHOEN[letter.arabic] || '?'}
            </div>

            <div style={{ marginTop: 21, display: 'flex', justifyContent: 'center', background: 'rgba(22,27,34,0.4)', borderRadius: 21, padding: 21, border: '1px solid rgba(48,54,61,0.3)' }}>
              <RadarChart data={radarData} color={letterRoot.color} size={280} />
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>
              DNA Profile — Linguistic Dimensions
            </div>
          </div>

          <div style={{ background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)', borderRadius: 21, padding: 21 }}>
            <div style={{ fontSize: 13, color: '#484f58', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginBottom: 13 }}>
              Etymologies
            </div>
            <div style={{ fontSize: 24, color: '#e6edf3', fontFamily: "'JetBrains Mono', monospace", marginBottom: 13 }}>
              {words.filter(w => w.rootId === letterRootId).length}
            </div>
            {relatedWords.map(w => (
              <div key={w.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(48,54,61,0.3)', cursor: 'pointer' }}
                onClick={() => router.push(`/${locale}/explorer?search=${encodeURIComponent(w.european)}`)}
              >
                <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 16, color: '#e6edf3', marginBottom: 4 }}>
                  {w.european}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Amiri', serif", fontSize: 16, color: '#f39c12', direction: 'rtl' }}>
                    {w.arabicRoot}
                  </span>
                  <ConfidenceBadge level={w.confidence} showLabel={false} />
                </div>
              </div>
            ))}
            {relatedWords.length === 0 && (
              <div style={{ fontSize: 14, color: '#484f58', textAlign: 'center', padding: '21px 0' }}>
                No words linked to this letter
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
