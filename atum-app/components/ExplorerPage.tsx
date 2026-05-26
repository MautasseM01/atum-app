'use client';

import { useState, useMemo } from 'react';
import HexGrid from '@/components/HexGrid';
import Navigation from '@/components/Navigation';
import SearchBar from '@/components/SearchBar';
import SectionHeader from '@/components/SectionHeader';
import EtymologyCard from '@/components/EtymologyCard';
import PageWrapper from '@/components/PageWrapper';
import Footer from '@/components/Footer';

interface WordItem {
  id: string; european: string; arabicRoot: string; rootId: string; rule: string;
  meaning: string; confidence: string; path: string; languages: string[];
}

interface ExplorerPageProps {
  locale: string;
  words: WordItem[];
}

export default function ExplorerPage({ locale, words }: ExplorerPageProps) {
  const [search, setSearch] = useState('');
  const [activeRoot, setActiveRoot] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('relevance');

  const filterOpts = [
    { id: 'ALL', label: 'All Roots', color: '#f39c12' },
    { id: 'ATUM', label: 'ATUM', color: '#22C55E' },
    { id: 'BULL', label: 'BULL', color: '#EF4444' },
    { id: 'TOR', label: 'TOR', color: '#3B82F6' },
  ];

  const filtered = useMemo(() => {
    let results = words;
    if (activeRoot !== 'ALL') results = results.filter(w => w.rootId === activeRoot);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(w =>
        w.european.toLowerCase().includes(q) ||
        w.arabicRoot.includes(q) ||
        w.meaning.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'confidence') {
      const order: Record<string, number> = { proven: 0, strong: 1, moderate: 2, emerging: 3 };
      results = [...results].sort((a, b) => (order[a.confidence] || 9) - (order[b.confidence] || 9));
    } else if (sortBy === 'alpha') {
      results = [...results].sort((a, b) => a.european.localeCompare(b.european));
    }
    return results;
  }, [search, activeRoot, sortBy, words]);

  const rootCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: words.length, ATUM: 0, BULL: 0, TOR: 0 };
    words.forEach(w => counts[w.rootId]++);
    return counts;
  }, [words]);

  return (
    <>
      <HexGrid />
      <Navigation currentPage="explorer" onNavigate={(p) => window.location.href = `/${locale}/${p === 'home' ? '' : p}`} />
      <PageWrapper>
        <div style={{ padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' }}>
          <SectionHeader title="Etymology Explorer" subtitle="Search any word to discover its electromagnetic root and trace its journey from Arabic origins." />

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 34 }}>
            <SearchBar value={search} onChange={setSearch} autoFocus placeholder="Search by word, root, or meaning..." />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 13, flexWrap: 'wrap' }}>
            {filterOpts.map(opt => (
              <button
                key={opt.id}
                onClick={() => setActiveRoot(opt.id)}
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
                  {rootCounts[opt.id]}
                </span>
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 21, padding: '0 4px' }}>
            <span style={{ fontSize: 14, color: '#484f58' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
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

          {filtered.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 21 }}>
              {filtered.map(word => (
                <EtymologyCard
                  key={word.id}
                  word={{
                    id: word.id, european: word.european, arabicRoot: word.arabicRoot,
                    rootId: word.rootId, rule: word.rule, meaning: word.meaning,
                    confidence: word.confidence, path: word.path, languages: word.languages,
                  }}
                  expanded={expandedId === word.id}
                  onClick={() => setExpandedId(expandedId === word.id ? null : word.id)}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '89px 34px', color: '#484f58' }}>
              <div style={{ fontSize: 55, marginBottom: 21 }}>⌕</div>
              <div style={{ fontSize: 18, marginBottom: 8 }}>
                {search ? `No results for "${search}"` : 'Start typing to explore'}
              </div>
              <div style={{ fontSize: 14 }}>
                Try searching for &quot;atom&quot;, &quot;tower&quot;, or &quot;bold&quot;
              </div>
            </div>
          )}
        </div>
        <Footer />
      </PageWrapper>
    </>
  );
}
