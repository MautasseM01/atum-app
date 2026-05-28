'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import SearchBar from '@/components/SearchBar';
import SectionHeader from '@/components/SectionHeader';
import EtymologyCard from '@/components/EtymologyCard';
import Footer from '@/components/Footer';

interface SearchResultItem {
  id: string; european: string; arabicRoot: string; rootId: string;
  rule: string; meaning: string; confidence: string; language: string;
}

interface ExplorerPageProps {
  results: SearchResultItem[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  rootCounts: { ATUM: number; BULL: number; TOR: number };
  search: string;
  activeRoot: string;
  activeLang: string;
  onSearch: (val: string) => void;
  onRootFilter: (root: string) => void;
  onLangFilter: (lang: string) => void;
  onLoadMore: () => void;
}

const rootFilterOpts = [
  { id: 'ALL', label: 'All Roots', color: '#f39c12' },
  { id: 'ATUM', label: 'ATUM', color: '#22C55E' },
  { id: 'BULL', label: 'BULL', color: '#EF4444' },
  { id: 'TOR', label: 'TOR', color: '#3B82F6' },
];

const langFilterOpts = [
  { id: 'ALL', label: 'All Lang', color: '#8b949e' },
  { id: 'EN', label: 'EN', color: '#3B82F6' },
  { id: 'GR', label: 'GR', color: '#8B5CF6' },
  { id: 'LA', label: 'LA', color: '#EF4444' },
  { id: 'FR', label: 'FR', color: '#10B981' },
  { id: 'AR', label: 'AR', color: '#f39c12' },
];

function SkeletonCard() {
  return (
    <div style={{
      background: 'rgba(22, 27, 34, 0.8)', borderRadius: 13, padding: 21,
      border: '1px solid rgba(48, 54, 61, 0.5)', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{
          width: '55%', height: 24, borderRadius: 4,
          background: 'rgba(48, 54, 61, 0.6)',
          animation: 'pulse 2s infinite',
        }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 34, height: 20, borderRadius: 10, background: 'rgba(48, 54, 61, 0.6)', animation: 'pulse 2s infinite' }} />
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(48, 54, 61, 0.6)', animation: 'pulse 2s infinite' }} />
        </div>
      </div>
      <div style={{ width: '35%', height: 20, borderRadius: 4, background: 'rgba(48, 54, 61, 0.6)', animation: 'pulse 2s infinite', marginBottom: 8 }} />
      <div style={{ width: '25%', height: 18, borderRadius: 4, background: 'rgba(48, 54, 61, 0.4)', animation: 'pulse 2s infinite 0.2s' }} />
    </div>
  );
}

const PULSE_STYLE = `
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}
`;

export default function ExplorerPage({
  results, total, loading, loadingMore, hasMore,
  rootCounts, search, activeRoot, activeLang,
  onSearch, onRootFilter, onLangFilter, onLoadMore,
}: ExplorerPageProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('relevance');
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
      { rootMargin: '200px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onLoadMore]);

  const sorted = useMemo(() => {
    if (sortBy === 'confidence') {
      const order: Record<string, number> = { proven: 0, strong: 1, moderate: 2, emerging: 3 };
      return [...results].sort((a, b) => (order[a.confidence] || 9) - (order[b.confidence] || 9));
    }
    if (sortBy === 'alpha') {
      return [...results].sort((a, b) => a.european.localeCompare(b.european));
    }
    return results;
  }, [results, sortBy]);

  return (
    <>
      <style>{PULSE_STYLE}</style>
      <div style={{ padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader title="Etymology Explorer" subtitle="Search any word to discover its electromagnetic root and trace its journey from Arabic origins." />

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 34 }}>
          <SearchBar value={search} onChange={onSearch} autoFocus placeholder="Search by word, root, or meaning..." />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          {rootFilterOpts.map(opt => (
            <button
              key={opt.id}
              onClick={() => onRootFilter(opt.id)}
              style={{
                padding: '8px 21px', borderRadius: 21,
                border: `1px solid ${activeRoot === opt.id ? opt.color : 'rgba(48,54,61,0.5)'}`,
                background: activeRoot === opt.id ? opt.color + '22' : 'transparent',
                color: activeRoot === opt.id ? opt.color : '#8b949e',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13, cursor: 'pointer', transition: 'all 233ms ease',
                letterSpacing: '1px', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              {opt.label}
              <span style={{
                fontSize: 11, opacity: 0.7,
                background: activeRoot === opt.id ? opt.color + '33' : 'rgba(48,54,61,0.5)',
                padding: '2px 7px', borderRadius: 10,
              }}>
                {rootCounts[opt.id as keyof typeof rootCounts] || (opt.id === 'ALL' ? rootCounts.ATUM + rootCounts.BULL + rootCounts.TOR : 0)}
              </span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 13, flexWrap: 'wrap' }}>
          {langFilterOpts.map(opt => (
            <button
              key={opt.id}
              onClick={() => onLangFilter(opt.id)}
              style={{
                padding: '4px 14px', borderRadius: 13,
                border: `1px solid ${activeLang === opt.id ? opt.color : 'rgba(48,54,61,0.3)'}`,
                background: activeLang === opt.id ? opt.color + '22' : 'transparent',
                color: activeLang === opt.id ? opt.color : '#6e7681',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, cursor: 'pointer', transition: 'all 233ms ease',
                letterSpacing: '1px', fontWeight: 500,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 21, padding: '0 4px' }}>
          <span style={{ fontSize: 14, color: '#484f58' }}>
            {loading ? 'Searching...' : `${total} result${total !== 1 ? 's' : ''}`}
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#484f58', marginRight: 4 }}>Sort:</span>
            {['relevance', 'confidence', 'alpha'].map(s => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                style={{
                  fontSize: 12, padding: '4px 10px', borderRadius: 8,
                  border: 'none', cursor: 'pointer',
                  background: sortBy === s ? 'rgba(243,156,18,0.15)' : 'transparent',
                  color: sortBy === s ? '#f39c12' : '#484f58',
                  fontFamily: "'JetBrains Mono', monospace",
                  textTransform: 'capitalize',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading && !loadingMore ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 21 }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : sorted.length > 0 ? (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 21 }}>
              {sorted.map(word => (
                <EtymologyCard
                  key={word.id}
                  word={{
                    id: word.id, european: word.european, arabicRoot: word.arabicRoot,
                    rootId: word.rootId, rule: word.rule, meaning: word.meaning,
                    confidence: word.confidence, language: word.language,
                  }}
                  expanded={expandedId === word.id}
                  onClick={() => setExpandedId(expandedId === word.id ? null : word.id)}
                />
              ))}
            </div>
            {loadingMore && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 21, marginTop: 21 }}>
                {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
              </div>
            )}
            <div ref={sentinelRef} style={{ height: 1 }} />
            {!hasMore && total > 50 && (
              <div style={{ textAlign: 'center', padding: '34px', color: '#484f58', fontSize: 14 }}>
                — All {total} results loaded —
              </div>
            )}
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '89px 34px', color: '#484f58' }}>
            <div style={{ fontSize: 55, marginBottom: 21 }}>⌕</div>
            <div style={{ fontSize: 18, marginBottom: 8, color: '#e6edf3' }}>
              {search ? `No results for "${search}"` : 'Try searching any word'}
            </div>
            <div style={{ fontSize: 14, marginBottom: 21, color: '#8b949e' }}>
              {search ? 'Try a different search term' : 'Click an example to see its root'}
            </div>
            <div style={{ display: 'flex', gap: 13, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['paradise', 'atlas', 'alcohol'].map(ex => (
                <button
                  key={ex}
                  onClick={() => onSearch(ex)}
                  style={{
                    padding: '10px 24px', borderRadius: 21,
                    background: 'rgba(243,156,18,0.1)',
                    border: '1px solid rgba(243,156,18,0.3)',
                    color: '#f39c12', cursor: 'pointer',
                    fontFamily: "'Cinzel Decorative', serif",
                    fontSize: 16, letterSpacing: '1px',
                    transition: 'all 233ms ease',
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
            {!search && (
              <div style={{ marginTop: 34, fontSize: 14, color: '#484f58' }}>
                Or browse by root →
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
