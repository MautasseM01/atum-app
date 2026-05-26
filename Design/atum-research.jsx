/* ═══════════════════════════════════════════════
   ATUM — Research Dashboard Page
   ═══════════════════════════════════════════════ */
const { useState, useEffect, useRef, useMemo } = React;

/* ── Network Visualization (SVG) ── */
function NetworkGraph() {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w: 800, h: 450 });
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDims({ w: rect.width, h: Math.min(rect.width * 0.55, 500) });
    }
  }, []);

  /* Generate node positions using golden angle for Fibonacci-spiral-like distribution */
  const nodes = useMemo(() => {
    const roots = [
      { id: 'ATUM', x: 0.3, y: 0.4, r: 28, color: '#22C55E', label: 'ATUM' },
      { id: 'BULL', x: 0.7, y: 0.35, r: 28, color: '#EF4444', label: 'BULL' },
      { id: 'TOR', x: 0.5, y: 0.75, r: 28, color: '#3B82F6', label: 'TOR' },
    ];
    const words = ATUM_DATA.words.map((w, i) => {
      const root = roots.find(r => r.id === w.rootId);
      const goldenAngle = i * 2.399963;
      const dist = 0.12 + (i * 0.618 % 0.22);
      return {
        id: w.id, x: root.x + Math.cos(goldenAngle) * dist,
        y: root.y + Math.sin(goldenAngle) * dist,
        r: 8 + (w.confidence === 'proven' ? 4 : w.confidence === 'strong' ? 2 : 0),
        color: root.color, label: w.european, rootId: w.rootId,
      };
    });
    return [...roots, ...words];
  }, []);

  const edges = useMemo(() =>
    ATUM_DATA.words.map(w => ({ from: w.rootId, to: w.id, rootId: w.rootId })),
  []);

  return React.createElement('div', {
    ref: containerRef,
    style: {
      background: 'rgba(22,27,34,0.4)',
      border: '1px solid rgba(48,54,61,0.4)',
      borderRadius: 21, padding: 21, overflow: 'hidden',
    }
  },
    React.createElement('div', {
      style: {
        fontSize: 13, color: '#484f58', letterSpacing: '2px',
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: 'uppercase', marginBottom: 13,
      }
    }, 'Root Network'),
    React.createElement('svg', {
      width: dims.w - 42, height: dims.h,
      viewBox: `0 0 ${dims.w - 42} ${dims.h}`,
    },
      /* Edges */
      edges.map((e, i) => {
        const from = nodes.find(n => n.id === e.from);
        const to = nodes.find(n => n.id === e.to);
        if (!from || !to) return null;
        const root = ATUM_DATA.roots[e.rootId];
        const isHighlight = hovered === e.from || hovered === e.to;
        return React.createElement('line', {
          key: `e-${i}`,
          x1: from.x * (dims.w - 42), y1: from.y * dims.h,
          x2: to.x * (dims.w - 42), y2: to.y * dims.h,
          stroke: root.color,
          strokeWidth: isHighlight ? 1.5 : 0.6,
          strokeOpacity: isHighlight ? 0.6 : 0.15,
        });
      }),
      /* Nodes */
      nodes.map(n => {
        const isHighlight = hovered === n.id || hovered === n.rootId;
        const isRoot = ['ATUM', 'BULL', 'TOR'].includes(n.id);
        return React.createElement('g', {
          key: n.id,
          onMouseEnter: () => setHovered(n.id),
          onMouseLeave: () => setHovered(null),
          style: { cursor: 'pointer' },
        },
          React.createElement('circle', {
            cx: n.x * (dims.w - 42), cy: n.y * dims.h, r: n.r,
            fill: isRoot ? n.color + '33' : n.color + (isHighlight ? '44' : '22'),
            stroke: n.color, strokeWidth: isRoot ? 2 : (isHighlight ? 1.5 : 0.5),
            strokeOpacity: isHighlight || isRoot ? 1 : 0.4,
          }),
          isRoot && React.createElement('text', {
            x: n.x * (dims.w - 42), y: n.y * dims.h + 1,
            textAnchor: 'middle', dominantBaseline: 'middle',
            fill: n.color, fontSize: 11, fontWeight: 700,
            fontFamily: "'Cinzel Decorative', serif", letterSpacing: '1px',
          }, n.label),
          !isRoot && (isHighlight || n.r > 10) && React.createElement('text', {
            x: n.x * (dims.w - 42), y: n.y * dims.h - n.r - 6,
            textAnchor: 'middle', fill: '#e6edf3',
            fontSize: 10, fontFamily: "'Source Serif 4', serif",
          }, n.label),
        );
      }),
    ),
  );
}

/* ── Timeline ── */
function ResearchTimeline() {
  const events = [
    { year: '2019', title: 'Initial Corpus', desc: 'Arabic-European word pairs collected' },
    { year: '2020', title: 'Root Discovery', desc: 'ATUM/BULL/TOR pattern identified' },
    { year: '2021', title: 'CNN Training', desc: 'Neural network trained on letter patterns' },
    { year: '2022', title: '99.7% Accuracy', desc: 'CNN achieves near-perfect classification' },
    { year: '2023', title: 'Ibdal Rules', desc: 'Systematic letter transformation rules mapped' },
    { year: '2024', title: '96 Proven', desc: 'Statistical confirmation of root connections' },
    { year: '2025', title: 'Cross-Language', desc: '5 source languages analyzed systematically' },
    { year: '2026', title: 'Public Release', desc: 'ATUM platform opens for exploration' },
  ];
  const colors = ['#22C55E', '#3B82F6', '#EF4444', '#f39c12', '#22C55E', '#3B82F6', '#EF4444', '#f39c12'];

  return React.createElement('div', {
    style: {
      background: 'rgba(22,27,34,0.4)',
      border: '1px solid rgba(48,54,61,0.4)',
      borderRadius: 21, padding: '21px 0',
      overflow: 'hidden',
    }
  },
    React.createElement('div', {
      style: {
        fontSize: 13, color: '#484f58', letterSpacing: '2px',
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: 'uppercase', marginBottom: 21,
        paddingLeft: 21,
      }
    }, 'Research Timeline'),
    React.createElement('div', {
      style: {
        display: 'flex', gap: 0, overflowX: 'auto',
        padding: '0 21px 13px',
        scrollbarWidth: 'thin',
      }
    },
      events.map((e, i) =>
        React.createElement('div', {
          key: i,
          style: {
            flex: '0 0 auto', width: 155, padding: '0 8px',
            borderLeft: `2px solid ${colors[i]}33`,
            position: 'relative',
          }
        },
          React.createElement('div', {
            style: {
              width: 10, height: 10, borderRadius: '50%',
              background: colors[i], position: 'absolute',
              left: -6, top: 0,
              boxShadow: `0 0 8px ${colors[i]}44`,
            }
          }),
          React.createElement('div', {
            style: {
              fontSize: 12, color: colors[i], marginBottom: 4,
              fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
            }
          }, e.year),
          React.createElement('div', {
            style: { fontSize: 14, color: '#e6edf3', marginBottom: 4 }
          }, e.title),
          React.createElement('div', {
            style: { fontSize: 12, color: '#484f58', lineHeight: 1.5 }
          }, e.desc),
        )
      ),
    ),
  );
}

/* ── Source Cards ── */
function SourceCards() {
  const sources = [
    { name: 'Wehr Dictionary', type: 'Arabic-English Lexicon', confidence: 'proven', count: 2840 },
    { name: 'Lane Lexicon', type: 'Classical Arabic Reference', confidence: 'proven', count: 1560 },
    { name: 'Etymonline', type: 'English Etymology Database', confidence: 'strong', count: 3200 },
    { name: 'Lisan al-Arab', type: 'Comprehensive Arabic Dictionary', confidence: 'proven', count: 980 },
    { name: 'Comparative Semitic', type: 'Cross-Language Analysis', confidence: 'strong', count: 420 },
  ];

  return React.createElement('div', {
    style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 13 }
  },
    sources.map(s =>
      React.createElement('div', {
        key: s.name,
        style: {
          background: 'rgba(22,27,34,0.6)',
          border: '1px solid rgba(48,54,61,0.4)',
          borderRadius: 13, padding: 21,
        }
      },
        React.createElement('div', {
          style: { fontSize: 15, color: '#e6edf3', marginBottom: 4 }
        }, s.name),
        React.createElement('div', {
          style: { fontSize: 12, color: '#484f58', marginBottom: 13 }
        }, s.type),
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
        },
          React.createElement(ConfidenceBadge, { level: s.confidence, showLabel: false }),
          React.createElement('span', {
            style: { fontSize: 12, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace" }
          }, s.count.toLocaleString() + ' entries'),
        ),
      )
    ),
  );
}

/* ── Research Dashboard Page ── */
function ResearchPage({ tweaks }) {
  const s = ATUM_DATA.stats;
  return React.createElement(PageWrapper, null,
    React.createElement('div', { style: { padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' } },

      React.createElement(SectionHeader, {
        title: 'Research Dashboard',
        subtitle: 'The computational linguistics and statistical evidence behind the three root theory.',
      }),

      /* Hero stats */
      React.createElement('div', {
        style: { display: 'flex', gap: 13, marginBottom: 55, flexWrap: 'wrap' }
      },
        React.createElement(StatCard, { value: s.cnnAccuracy, label: 'CNN Accuracy', color: '#22C55E', suffix: '%' }),
        React.createElement(StatCard, { value: '0.0001', label: 'p-value', color: '#3B82F6', prefix: 'p<' }),
        React.createElement(StatCard, { value: '0.693', label: 'Correlation', color: '#EF4444', prefix: 'r=−' }),
        React.createElement(StatCard, { value: s.provenWords, label: 'Proven', color: '#f39c12' }),
      ),

      /* Network graph */
      React.createElement('div', { style: { marginBottom: 34 } },
        React.createElement(NetworkGraph, null),
      ),

      /* Timeline */
      React.createElement('div', { style: { marginBottom: 34 } },
        React.createElement(ResearchTimeline, null),
      ),

      /* Sources */
      React.createElement('div', null,
        React.createElement('div', {
          style: {
            fontSize: 13, color: '#484f58', letterSpacing: '2px',
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase', marginBottom: 21,
          }
        }, 'Data Sources'),
        React.createElement(SourceCards, null),
      ),
    ),

    React.createElement(Footer, null),
  );
}

Object.assign(window, { ResearchPage });
