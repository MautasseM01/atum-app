'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
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

function RadarChart({ data, color, size = 240 }: { data: number[]; color: string; size?: number }) {
  const t = useTranslations('Letters');
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const dims = [t('dimFrequency'), t('dimPhonetic'), t('dimRootAffinity'), t('dimHistorical'), t('dimCrossLang')];
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
  const t = useTranslations('Letters');
  const stages = [
    { era: '~1800 BCE', label: 'Proto-Sinaitic', glyph: letter.protoSinaitic || '𓃾', color: '#f39c12' },
    { era: '~1050 BCE', label: 'Phoenician', glyph: letter.phoenician || '𐤀', color: '#EF4444' },
    { era: '~800 BCE', label: 'Aramaic', glyph: letter.arabic, color: '#3B82F6' },
    { era: '~400 CE', label: 'Arabic', glyph: letter.arabic, color: '#22C55E' },
    { era: 'Modern', label: 'Present', glyph: letter.arabic, color: '#f39c12' },
  ];

  return (
    <div>
      <div style={{ fontSize: 13, color: '#484f58', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginBottom: 21 }}>
        {t('scriptEvolution')}
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
  const t = useTranslations('Letters');
  const router = useRouter();
  const [selectedIdx, setSelectedIdx] = useState(0);
  const letter = letters[selectedIdx] || letters[0];

  const soundRootMap: Record<string, string> = {
    أ: 'ATUM', م: 'ATUM', و: 'ATUM', ن: 'ATUM', ه: 'ATUM', ل: 'ATUM',
    ب: 'BULL', ر: 'BULL', ف: 'BULL', ح: 'BULL', ع: 'BULL',
    ط: 'TOR', د: 'TOR', ز: 'TOR', ك: 'TOR', ت: 'TOR', ق: 'TOR',
  };

  const letterRootId = soundRootMap[letter?.arabic] || 'ATUM';
  const letterRoot = ROOTS_DATA[letterRootId];

  const radarData = [
    0.5 + Math.sin(selectedIdx * 1.3) * 0.3,
    0.6 + Math.cos(selectedIdx * 0.8) * 0.25,
    0.7 + Math.sin(selectedIdx * 2.1) * 0.2,
    0.4 + Math.cos(selectedIdx * 1.7) * 0.35,
    0.55 + Math.sin(selectedIdx * 0.5) * 0.3,
  ];

  const relatedWords = words.filter(w =>
    w.arabicRoot.includes(letter?.arabic) || w.rootId === letterRootId
  ).slice(0, 5);

  return (
    <>
      <div style={{ padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 55, flexWrap: 'wrap' }}>
          {letters.map((l, i) => {
            const lr = soundRootMap[l.arabic] || 'ATUM';
            const lRoot = ROOTS_DATA[lr];
            return (
              <button
                key={l.arabic}
                onClick={() => setSelectedIdx(i)}
                title={`${l.name} — ${lr} family · ${l.dna?.cnnConfirmed ? 'CNN confirmed' : ''} · Appears in ${(words.filter(w => w.arabicRoot.includes(l.arabic) || w.rootId === lr).length).toLocaleString()} etymologies`}
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
              fontFamily: "'Amiri', serif", fontSize: 144, color: '#f39c12',
              lineHeight: 1, direction: 'rtl',
              textShadow: `0 0 40px ${letterRoot.color}44, 0 0 80px ${letterRoot.color}22`,
              marginBottom: 13,
              transition: 'all 610ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}>
              {letter?.arabic}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 13, marginBottom: 4 }}>
              <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 21, color: '#e6edf3', letterSpacing: '2px' }}>
                {t(`names.${letter?.arabic}`)}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color: '#f39c12', opacity: 0.8 }}>
                {t(`ipas.${letter?.arabic}`)}
              </div>
              <button
                onClick={() => {
                  const u = new SpeechSynthesisUtterance(letter?.arabic);
                  u.lang = 'ar-SA';
                  window.speechSynthesis.speak(u);
                }}
                title="Listen to pronunciation"
                style={{
                  background: 'rgba(243,156,18,0.1)', border: '1px solid rgba(243,156,18,0.3)',
                  borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: '#f39c12',
                  transition: 'all 233ms ease'
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(243,156,18,0.2)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(243,156,18,0.1)'}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>
            </div>
            {letter?.dna?.fundamentalFreqHz && (
              <div style={{ fontSize: 14, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
                Hz: {letter.dna.fundamentalFreqHz}
              </div>
            )}
            <RootBadge rootId={letterRootId} size="md" />

            <div style={{ marginTop: 34, display: 'flex', justifyContent: 'center', background: 'rgba(22,27,34,0.4)', borderRadius: 21, padding: 21, border: '1px solid rgba(48,54,61,0.3)' }}>
              <RadarChart data={radarData} color={letterRoot.color} size={280} />
            </div>
            <div style={{ marginTop: 13, fontSize: 13, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }}>
              {t('dnaProfile')}
            </div>
          </div>

          <div style={{ background: 'rgba(22,27,34,0.6)', border: '1px solid rgba(48,54,61,0.4)', borderRadius: 21, padding: 21 }}>
            <div style={{ fontSize: 13, color: '#484f58', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', marginBottom: 21 }}>
              {t('etymologies')}
            </div>
            {relatedWords.map(w => (
              <div key={w.id} style={{ padding: '10px 0', borderBottom: '1px solid rgba(48,54,61,0.3)', cursor: 'pointer' }}
                onClick={() => router.push(`/${locale}/etymology/${encodeURIComponent(w.european.toLowerCase())}`)}
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
                {t('noEtymologies')}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
