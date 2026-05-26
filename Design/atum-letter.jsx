/* ═══════════════════════════════════════════════
   ATUM — Letter Detail Page
   ═══════════════════════════════════════════════ */
const { useState, useEffect, useRef } = React;

/* ── Radar Chart (SVG) ── */
function RadarChart({ data, color, size = 240 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const dims = ['Frequency', 'Phonetic Shift', 'Root Affinity', 'Historical Depth', 'Cross-Language'];
  const n = dims.length;
  const angleStep = (Math.PI * 2) / n;

  const polyPoints = (values) =>
    values.map((v, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      return `${cx + r * v * Math.cos(angle)},${cy + r * v * Math.sin(angle)}`;
    }).join(' ');

  const gridLevels = [0.25, 0.5, 0.75, 1];

  return React.createElement('svg', {
    width: size, height: size, viewBox: `0 0 ${size} ${size}`,
  },
    /* Grid lines */
    gridLevels.map(level =>
      React.createElement('polygon', {
        key: level,
        points: polyPoints(Array(n).fill(level)),
        fill: 'none', stroke: 'rgba(48,54,61,0.4)',
        strokeWidth: 0.5,
      })
    ),
    /* Axes */
    Array.from({ length: n }).map((_, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      return React.createElement('line', {
        key: `axis-${i}`,
        x1: cx, y1: cy,
        x2: cx + r * Math.cos(angle),
        y2: cy + r * Math.sin(angle),
        stroke: 'rgba(48,54,61,0.3)', strokeWidth: 0.5,
      });
    }),
    /* Data polygon */
    React.createElement('polygon', {
      points: polyPoints(data),
      fill: color + '22', stroke: color, strokeWidth: 2,
    }),
    /* Data points */
    data.map((v, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      return React.createElement('circle', {
        key: `pt-${i}`,
        cx: cx + r * v * Math.cos(angle),
        cy: cy + r * v * Math.sin(angle),
        r: 4, fill: color, stroke: '#0a0a0f', strokeWidth: 2,
      });
    }),
    /* Labels */
    dims.map((label, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const lx = cx + (r + 24) * Math.cos(angle);
      const ly = cy + (r + 24) * Math.sin(angle);
      return React.createElement('text', {
        key: `lbl-${i}`,
        x: lx, y: ly,
        textAnchor: 'middle', dominantBaseline: 'middle',
        fill: '#8b949e', fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
      }, label);
    }),
  );
}

/* ── Evolution Timeline ── */
function EvolutionTimeline({ letter }) {
  const stages = [
    { era: '~1800 BCE', label: 'Proto-Sinaitic', glyph: '𓃾', color: '#f39c12' },
    { era: '~1050 BCE', label: 'Phoenician', glyph: letter.phoenician, color: '#EF4444' },
    { era: '~800 BCE', label: 'Aramaic', glyph: letter.letter, color: '#3B82F6' },
    { era: '~400 CE', label: 'Arabic', glyph: letter.letter, color: '#22C55E' },
    { era: 'Modern', label: 'Present', glyph: letter.letter, color: '#f39c12' },
  ];

  return React.createElement('div', null,
    React.createElement('div', {
      style: {
        fontSize: 13, color: '#484f58', letterSpacing: '2px',
        fontFamily: "'JetBrains Mono', monospace",
        textTransform: 'uppercase', marginBottom: 21,
      }
    }, 'Script Evolution'),
    React.createElement('div', {
      style: { position: 'relative', paddingLeft: 24 }
    },
      /* Vertical line */
      React.createElement('div', {
        style: {
          position: 'absolute', left: 6, top: 8, bottom: 8,
          width: 2, background: 'rgba(48,54,61,0.5)',
          borderRadius: 1,
        }
      }),
      stages.map((s, i) =>
        React.createElement('div', {
          key: i,
          style: {
            display: 'flex', alignItems: 'center', gap: 21,
            padding: '13px 0', position: 'relative',
          }
        },
          /* Dot */
          React.createElement('div', {
            style: {
              position: 'absolute', left: -21, top: '50%', transform: 'translateY(-50%)',
              width: 13, height: 13, borderRadius: '50%',
              background: s.color, border: '2px solid #0a0a0f',
              boxShadow: `0 0 8px ${s.color}44`,
            }
          }),
          /* Glyph */
          React.createElement('div', {
            style: {
              width: 55, height: 55, borderRadius: 13,
              background: `${s.color}11`, border: `1px solid ${s.color}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, color: s.color,
              fontFamily: i >= 2 ? "'Amiri', serif" : 'inherit',
            }
          }, s.glyph),
          /* Info */
          React.createElement('div', null,
            React.createElement('div', {
              style: { fontSize: 15, color: '#e6edf3' }
            }, s.label),
            React.createElement('div', {
              style: { fontSize: 12, color: '#484f58', fontFamily: "'JetBrains Mono', monospace" }
            }, s.era),
          ),
        )
      ),
    ),
  );
}

/* ── Letter Page ── */
function LetterPage({ letterId, onNavigate, tweaks }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const letters = ATUM_DATA.letters;
  const letter = letters[selectedIdx] || letters[0];
  const root = ATUM_DATA.roots[letter.rootAssociation];
  const relatedWords = ATUM_DATA.words.filter(w =>
    w.arabicRoot.includes(letter.letter) || w.rootId === letter.rootAssociation
  ).slice(0, 5);

  /* Plausible radar data based on letter */
  const radarData = [
    0.5 + Math.sin(selectedIdx * 1.3) * 0.3,
    0.6 + Math.cos(selectedIdx * 0.8) * 0.25,
    0.7 + Math.sin(selectedIdx * 2.1) * 0.2,
    0.4 + Math.cos(selectedIdx * 1.7) * 0.35,
    0.55 + Math.sin(selectedIdx * 0.5) * 0.3,
  ];

  return React.createElement(PageWrapper, null,
    React.createElement('div', { style: { padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' } },

      /* Letter selector */
      React.createElement('div', {
        style: {
          display: 'flex', gap: 8, justifyContent: 'center',
          marginBottom: 55, flexWrap: 'wrap',
        }
      },
        letters.map((l, i) => {
          const lr = ATUM_DATA.roots[l.rootAssociation];
          return React.createElement('button', {
            key: l.letter,
            onClick: () => setSelectedIdx(i),
            style: {
              width: 48, height: 48, borderRadius: 13,
              border: `1px solid ${selectedIdx === i ? lr.color : 'rgba(48,54,61,0.4)'}`,
              background: selectedIdx === i ? `${lr.color}22` : 'transparent',
              color: selectedIdx === i ? lr.color : '#8b949e',
              fontFamily: "'Amiri', serif", fontSize: 24,
              cursor: 'pointer', transition: 'all 233ms ease',
              direction: 'rtl',
            }
          }, l.letter);
        })
      ),

      /* Main content */
      React.createElement('div', {
        style: {
          display: 'grid',
          gridTemplateColumns: '280px 1fr 280px',
          gap: 34, alignItems: 'start',
        }
      },
        /* Left — Timeline */
        React.createElement('div', {
          style: {
            background: 'rgba(22,27,34,0.6)',
            border: '1px solid rgba(48,54,61,0.4)',
            borderRadius: 21, padding: 21,
          }
        },
          React.createElement(EvolutionTimeline, { letter }),
        ),

        /* Center — Giant letter + radar */
        React.createElement('div', {
          style: { textAlign: 'center' }
        },
          /* Giant letter */
          React.createElement('div', {
            style: {
              fontFamily: "'Amiri', serif",
              fontSize: 144, color: '#f39c12',
              lineHeight: 1, direction: 'rtl',
              textShadow: `0 0 40px ${root.color}44, 0 0 80px ${root.color}22`,
              marginBottom: 13,
              transition: 'all 610ms cubic-bezier(0.23, 1, 0.32, 1)',
            }
          }, letter.letter),
          React.createElement('div', {
            style: {
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 21, color: '#e6edf3', letterSpacing: '2px',
              marginBottom: 4,
            }
          }, letter.name),
          React.createElement('div', {
            style: {
              fontSize: 14, color: '#8b949e',
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 8,
            }
          }, `Transliteration: ${letter.transliteration}`),
          React.createElement(RootBadge, { rootId: letter.rootAssociation, size: 'md' }),

          /* Radar chart */
          React.createElement('div', {
            style: {
              marginTop: 34, display: 'flex', justifyContent: 'center',
              background: 'rgba(22,27,34,0.4)',
              borderRadius: 21, padding: 21,
              border: '1px solid rgba(48,54,61,0.3)',
            }
          },
            React.createElement(RadarChart, {
              data: radarData,
              color: root.color,
              size: 280,
            }),
          ),

          React.createElement('div', {
            style: {
              marginTop: 13, fontSize: 13, color: '#484f58',
              fontFamily: "'JetBrains Mono', monospace",
            }
          }, 'DNA Profile — Linguistic Dimensions'),
        ),

        /* Right — Related words */
        React.createElement('div', {
          style: {
            background: 'rgba(22,27,34,0.6)',
            border: '1px solid rgba(48,54,61,0.4)',
            borderRadius: 21, padding: 21,
          }
        },
          React.createElement('div', {
            style: {
              fontSize: 13, color: '#484f58', letterSpacing: '2px',
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: 'uppercase', marginBottom: 21,
            }
          }, `Etymologies (${letter.wordCount})`),
          relatedWords.map(w =>
            React.createElement('div', {
              key: w.id,
              style: {
                padding: '10px 0',
                borderBottom: '1px solid rgba(48,54,61,0.3)',
                cursor: 'pointer',
              },
              onClick: () => onNavigate('explorer', null, w.european),
            },
              React.createElement('div', {
                style: { fontFamily: "'Cinzel Decorative', serif", fontSize: 16, color: '#e6edf3', marginBottom: 4 }
              }, w.european),
              React.createElement('div', {
                style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
              },
                React.createElement('span', {
                  style: { fontFamily: "'Amiri', serif", fontSize: 16, color: '#f39c12', direction: 'rtl' }
                }, w.arabicRoot),
                React.createElement(ConfidenceBadge, { level: w.confidence, showLabel: false }),
              ),
            )
          ),
        ),
      ),
    ),

    React.createElement(Footer, null),
  );
}

Object.assign(window, { LetterPage });
