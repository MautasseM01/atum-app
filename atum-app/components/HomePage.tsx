'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import SearchBar from '@/components/SearchBar';
import SectionHeader from '@/components/SectionHeader';
import StatCard from '@/components/StatCard';
import RootBadge from '@/components/RootBadge';
import ConfidenceBadge from '@/components/ConfidenceBadge';
import Footer from '@/components/Footer';

const TorusCanvas = dynamic(() => import('@/components/TorusCanvas'), { ssr: false });

const ROOTS: Record<string, { id: string; arabic: string; transliteration: string; meaning: string; principle: string; color: string; colorDim: string; colorGlow: string }> = {
  ATUM: { id: 'ATUM', arabic: 'أتم', transliteration: 'Atum', meaning: 'Unity, to complete', principle: 'Unity · Inertia · Containment', color: '#22C55E', colorDim: 'rgba(34,197,94,0.15)', colorGlow: 'rgba(34,197,94,0.4)' },
  BULL: { id: 'BULL', arabic: 'بول', transliteration: 'Bull', meaning: 'Radiation, expansion', principle: 'Radiation · Expansion · Outward', color: '#EF4444', colorDim: 'rgba(239,68,68,0.15)', colorGlow: 'rgba(239,68,68,0.4)' },
  TOR: { id: 'TOR', arabic: 'طور', transliteration: 'Tor', meaning: 'Cycle, rotation', principle: 'Structure · Rotation · Cycles', color: '#3B82F6', colorDim: 'rgba(59,130,246,0.15)', colorGlow: 'rgba(59,130,246,0.4)' },
};

interface WordItem {
  id: string; european: string; arabicRoot: string; rootId: string; rule: string;
  meaning: string; confidence: string; path: string; languages: string[];
}

interface HomePageProps {
  locale: string;
  words: WordItem[];
}

function RootCircle({ rootId, onNavigate, words }: { rootId: string; onNavigate: (page: string, filter?: string) => void; words: WordItem[] }) {
  const root = ROOTS[rootId as keyof typeof ROOTS];
  const rootWords = words.filter(w => w.rootId === rootId).slice(0, 5);
  const [hover, setHover] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReveal(hover), hover ? 150 : 0);
    return () => clearTimeout(t);
  }, [hover]);

  return (
    <div
      style={{
        position: 'relative', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        transition: 'transform 610ms cubic-bezier(0.23, 1, 0.32, 1)',
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        flex: '1 1 0', maxWidth: 320,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onNavigate('explorer', rootId)}
    >
      <div style={{
        width: 200, height: 200, borderRadius: '50%',
        border: `2px solid ${root.color}`,
        background: `radial-gradient(circle, ${root.color}15 0%, transparent 70%)`,
        boxShadow: hover
          ? `0 0 40px ${root.color}44, 0 0 80px ${root.color}22, inset 0 0 30px ${root.color}15`
          : `0 0 20px ${root.color}22`,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'all 610ms cubic-bezier(0.23, 1, 0.32, 1)',
        position: 'relative',
      }}>
        <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 34, fontWeight: 900, color: root.color, letterSpacing: '4px', lineHeight: 1 }}>
          {root.id}
        </div>
        <div style={{ fontFamily: "'Amiri', serif", fontSize: 28, color: '#f39c12', marginTop: 4, direction: 'rtl' }}>
          {root.arabic}
        </div>
      </div>

      <div style={{ marginTop: 21, textAlign: 'center', transition: 'all 377ms ease' }}>
        <div style={{ fontSize: 14, color: '#8b949e', letterSpacing: '1px', marginBottom: 4 }}>{root.transliteration}</div>
        <div style={{ fontSize: 15, color: '#8b949e', maxWidth: 240 }}>{root.meaning}</div>
      </div>

      {hover && (
        <div style={{
          position: 'absolute', top: '100%', marginTop: 8,
          background: 'rgba(13, 17, 23, 0.95)',
          border: `1px solid ${root.color}33`,
          borderRadius: 13, padding: '13px 21px',
          backdropFilter: 'blur(21px)',
          minWidth: 220, zIndex: 10,
          boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 20px ${root.color}11`,
        }}>
          {rootWords.map((w, i) => (
            <div key={w.id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '6px 0',
              borderBottom: i < rootWords.length - 1 ? '1px solid rgba(48,54,61,0.3)' : 'none',
              opacity: reveal ? 1 : 0,
              transform: reveal ? 'translateY(0)' : 'translateY(8px)',
              transition: `all 377ms ease ${i * 80}ms`,
            }}>
              <span style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 15, color: '#e6edf3' }}>{w.european}</span>
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 16, color: '#f39c12', direction: 'rtl' }}>{w.arabicRoot}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WordOfDay({ words }: { words: WordItem[] }) {
  const wod = words.find(w => w.id === 'E005') || words[0] || { european: '', arabicRoot: '', meaning: '', rootId: 'ATUM', confidence: '', rule: '', path: '', id: '', languages: [], };
  const root = ROOTS[wod.rootId as keyof typeof ROOTS] || ROOTS.ATUM;

  return (
    <div style={{
      maxWidth: 610, margin: '0 auto',
      background: 'rgba(22, 27, 34, 0.6)',
      border: '1px solid rgba(243, 156, 18, 0.25)',
      borderRadius: 13, padding: '34px',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 120, height: 120,
        background: `radial-gradient(circle at top right, ${root.color}15, transparent 70%)`,
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 21 }}>
        <div>
          <div style={{
            fontSize: 11, color: '#f39c12', letterSpacing: '2px',
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase', marginBottom: 8,
          }}>
            Word of the Day
          </div>
          <div style={{ fontFamily: "'Cinzel Decorative', serif", fontSize: 34, color: '#e6edf3' }}>
            {wod.european}
          </div>
        </div>
        <div style={{
          fontFamily: "'Amiri', serif", fontSize: 42, color: '#f39c12', direction: 'rtl',
          textShadow: '0 0 20px rgba(243,156,18,0.3)',
        }}>
          {wod.arabicRoot}
        </div>
      </div>
      <p style={{ fontSize: 15, color: '#8b949e', lineHeight: 1.7 }}>
        &ldquo;{wod.meaning}&rdquo;
      </p>
      <div style={{ marginTop: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
        <RootBadge rootId={wod.rootId} size="sm" />
        <ConfidenceBadge level={wod.confidence} showLabel={false} />
      </div>
    </div>
  );
}

function StatsStrip() {
  return (
    <div style={{ display: 'flex', gap: 13, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 900, margin: '0 auto' }}>
      <StatCard value={5083} label="Words Analyzed" color="#e6edf3" delay={0} />
      <StatCard value={96} label="Proven Roots" color="#22C55E" suffix="" delay={200} />
      <StatCard value={5} label="Source Languages" color="#3B82F6" delay={400} />
      <StatCard value={99.7} label="CNN Accuracy" color="#f39c12" suffix="%" delay={600} />
    </div>
  );
}

export default function HomePage({ locale, words }: HomePageProps) {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');

  const handleNavigate = (page: string, filter?: string, search?: string) => {
    if (page === 'home') { router.push(`/${locale}`); return; }
    let href = `/${locale}/${page}`;
    if (filter || search) {
      const params = new URLSearchParams();
      if (filter) params.set('filter', filter);
      if (search) params.set('search', search);
      href += '?' + params.toString();
    }
    router.push(href);
  };

  const handleSearch = () => {
    if (searchVal.trim()) handleNavigate('explorer', undefined, searchVal.trim());
  };

  return (
    <>
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '120px 34px 55px',
      }}>
        <TorusCanvas />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900 }}>
          <h1 style={{
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(34px, 6vw, 89px)',
            color: '#e6edf3', lineHeight: 1.15,
            marginBottom: 21,
            textShadow: '0 0 40px rgba(243,156,18,0.15)',
            letterSpacing: '3px',
          }}>
            Every Word Has a Root
          </h1>
          <p style={{
            fontSize: 'clamp(16px, 2vw, 21px)',
            color: '#8b949e', maxWidth: 550,
            margin: '0 auto 55px', lineHeight: 1.7,
          }}>
            Three electromagnetic roots — ATUM, BULL, TOR — form the hidden architecture beneath all world languages.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 89 }}>
            <SearchBar value={searchVal} onChange={setSearchVal} onSubmit={handleSearch} />
          </div>

          <div style={{ display: 'flex', gap: 34, justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <RootCircle rootId="ATUM" onNavigate={handleNavigate} words={words} />
            <RootCircle rootId="BULL" onNavigate={handleNavigate} words={words} />
            <RootCircle rootId="TOR" onNavigate={handleNavigate} words={words} />
          </div>

          <div style={{
            maxWidth: 550, margin: '55px auto 0',
            background: 'rgba(22, 27, 34, 0.6)',
            border: '1px solid rgba(243, 156, 18, 0.25)',
            borderRadius: 13, padding: '21px 34px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 14, color: '#f39c12', marginBottom: 13, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '1px' }}>
              How to use ATUM
            </div>
            <p style={{ fontSize: 15, color: '#8b949e', fontStyle: 'italic', lineHeight: 1.8, margin: 0 }}>
              Think of ATUM, BULL, TOR like Arabic verb patterns (أوزان). Once you recognize the pattern, you see it everywhere.
            </p>
            <p style={{ fontSize: 15, color: '#8b949e', fontStyle: 'italic', lineHeight: 1.8, margin: '13px 0 0' }}>
              Try: search &quot;paradise&quot; in Explorer → you&apos;ll find its Arabic root فردس
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: '89px 34px 55px', position: 'relative', zIndex: 1 }}>
        <SectionHeader title="Word of the Day" subtitle="Discover the hidden root behind an everyday word" />
        <WordOfDay words={words} />
      </section>

      <section style={{ padding: '55px 34px 89px', position: 'relative', zIndex: 1 }}>
        <SectionHeader title="The Research" subtitle="Backed by computational linguistics and statistical analysis" />
        <StatsStrip />
      </section>

      <Footer />
    </>
  );
}
