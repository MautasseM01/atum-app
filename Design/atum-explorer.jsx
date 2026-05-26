/* ═══════════════════════════════════════════════
   ATUM — Etymology Explorer Page
   ═══════════════════════════════════════════════ */
const { useState, useEffect, useMemo } = React;

function ExplorerPage({ onNavigate, initialFilter, initialSearch, tweaks }) {
  const [search, setSearch] = useState(initialSearch || '');
  const [activeRoot, setActiveRoot] = useState(initialFilter || 'ALL');
  const [expandedId, setExpandedId] = useState(null);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (initialSearch) setSearch(initialSearch);
    if (initialFilter) setActiveRoot(initialFilter);
  }, [initialSearch, initialFilter]);

  const filterOpts = [
    { id: 'ALL', label: 'All Roots', color: '#f39c12' },
    { id: 'ATUM', label: 'ATUM', color: '#22C55E' },
    { id: 'BULL', label: 'BULL', color: '#EF4444' },
    { id: 'TOR', label: 'TOR', color: '#3B82F6' },
  ];

  const filtered = useMemo(() => {
    let results = ATUM_DATA.words;
    if (activeRoot !== 'ALL') results = results.filter(w => w.rootId === activeRoot);
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      results = results.filter(w =>
        w.european.toLowerCase().includes(q) ||
        w.arabicRoot.includes(q) ||
        w.transliteration.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'confidence') {
      const order = { proven: 0, strong: 1, moderate: 2, emerging: 3 };
      results = [...results].sort((a, b) => (order[a.confidence] || 9) - (order[b.confidence] || 9));
    } else if (sortBy === 'alpha') {
      results = [...results].sort((a, b) => a.european.localeCompare(b.european));
    }
    return results;
  }, [search, activeRoot, sortBy]);

  const rootCounts = useMemo(() => {
    const counts = { ALL: ATUM_DATA.words.length, ATUM: 0, BULL: 0, TOR: 0 };
    ATUM_DATA.words.forEach(w => counts[w.rootId]++);
    return counts;
  }, []);

  return React.createElement(PageWrapper, null,
    React.createElement('div', { style: { padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' } },

      /* Header */
      React.createElement(SectionHeader, {
        title: 'Etymology Explorer',
        subtitle: 'Search any word to discover its electromagnetic root and trace its journey from Arabic origins.',
      }),

      /* Search */
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'center', marginBottom: 34 }
      },
        React.createElement(SearchBar, {
          value: search, onChange: setSearch, autoFocus: true,
          placeholder: 'Search by word, root, or meaning...',
        }),
      ),

      /* Filters */
      React.createElement('div', {
        style: { display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 13, flexWrap: 'wrap' }
      },
        filterOpts.map(opt =>
          React.createElement('button', {
            key: opt.id,
            onClick: () => setActiveRoot(opt.id),
            style: {
              padding: '8px 21px', borderRadius: 21,
              border: `1px solid ${activeRoot === opt.id ? opt.color : 'rgba(48,54,61,0.5)'}`,
              background: activeRoot === opt.id ? opt.color + '22' : 'transparent',
              color: activeRoot === opt.id ? opt.color : '#8b949e',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, cursor: 'pointer', transition: 'all 233ms ease',
              letterSpacing: '1px', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }
          },
            opt.label,
            React.createElement('span', {
              style: {
                fontSize: 11, opacity: 0.7,
                background: activeRoot === opt.id ? opt.color + '33' : 'rgba(48,54,61,0.5)',
                padding: '2px 7px', borderRadius: 10,
              }
            }, rootCounts[opt.id]),
          )
        )
      ),

      /* Sort bar */
      React.createElement('div', {
        style: {
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 21, padding: '0 4px',
        }
      },
        React.createElement('span', {
          style: { fontSize: 14, color: '#484f58' }
        }, `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`),
        React.createElement('div', {
          style: { display: 'flex', gap: 8, alignItems: 'center' }
        },
          React.createElement('span', { style: { fontSize: 12, color: '#484f58', marginRight: 4 } }, 'Sort:'),
          ['relevance', 'confidence', 'alpha'].map(s =>
            React.createElement('button', {
              key: s,
              onClick: () => setSortBy(s),
              style: {
                fontSize: 12, padding: '4px 10px', borderRadius: 8,
                border: 'none', cursor: 'pointer',
                background: sortBy === s ? 'rgba(243,156,18,0.15)' : 'transparent',
                color: sortBy === s ? '#f39c12' : '#484f58',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'capitalize',
              }
            }, s)
          ),
        ),
      ),

      /* Results */
      filtered.length > 0
        ? React.createElement('div', {
            style: {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: 21,
            }
          },
            filtered.map(word =>
              React.createElement(EtymologyCard, {
                key: word.id,
                word,
                expanded: expandedId === word.id,
                onClick: () => setExpandedId(expandedId === word.id ? null : word.id),
              })
            )
          )
        : React.createElement('div', {
            style: {
              textAlign: 'center', padding: '89px 34px',
              color: '#484f58',
            }
          },
            React.createElement('div', { style: { fontSize: 55, marginBottom: 21 } }, '⌕'),
            React.createElement('div', { style: { fontSize: 18, marginBottom: 8 } },
              search ? `No results for "${search}"` : 'Start typing to explore'),
            React.createElement('div', { style: { fontSize: 14 } },
              'Try searching for "atom", "tower", or "bold"'),
          ),
    ),

    React.createElement(Footer, null),
  );
}

Object.assign(window, { ExplorerPage });
