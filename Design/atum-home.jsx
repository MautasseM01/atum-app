/* ═══════════════════════════════════════════════
   ATUM — Homepage
   ═══════════════════════════════════════════════ */
const { useState, useEffect, useRef } = React;

/* ── Root Circle (Vesica Piscis inspired) ── */
function RootCircle({ rootId, onNavigate }) {
  const root = ATUM_DATA.roots[rootId];
  const words = ATUM_DATA.words.filter(w => w.rootId === rootId).slice(0, 5);
  const [hover, setHover] = useState(false);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (hover) {
      const t = setTimeout(() => setReveal(true), 150);
      return () => clearTimeout(t);
    } else {
      setReveal(false);
    }
  }, [hover]);

  return React.createElement('div', {
    style: {
      position: 'relative', cursor: 'pointer',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      transition: 'transform 610ms cubic-bezier(0.23, 1, 0.32, 1)',
      transform: hover ? 'scale(1.05)' : 'scale(1)',
      flex: '1 1 0', maxWidth: 320,
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    onClick: () => onNavigate('explorer', rootId),
  },
    /* Outer glow ring */
    React.createElement('div', {
      style: {
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
      }
    },
      React.createElement('div', {
        style: {
          fontFamily: "'Cinzel Decorative', serif",
          fontSize: 34, fontWeight: 900, color: root.color,
          letterSpacing: '4px', lineHeight: 1,
        }
      }, root.id),
      React.createElement('div', {
        style: {
          fontFamily: "'Amiri', serif", fontSize: 28,
          color: '#f39c12', marginTop: 4, direction: 'rtl',
        }
      }, root.arabic),
    ),

    /* Label */
    React.createElement('div', {
      style: {
        marginTop: 21, textAlign: 'center',
        transition: 'all 377ms ease',
      }
    },
      React.createElement('div', {
        style: { fontSize: 14, color: '#8b949e', letterSpacing: '1px', marginBottom: 4 }
      }, root.transliteration),
      React.createElement('div', {
        style: { fontSize: 15, color: '#8b949e', maxWidth: 240 }
      }, root.meaning),
    ),

    /* Hover word list */
    hover && React.createElement('div', {
      style: {
        position: 'absolute', top: '100%', marginTop: 8,
        background: 'rgba(13, 17, 23, 0.95)',
        border: `1px solid ${root.color}33`,
        borderRadius: 13, padding: '13px 21px',
        backdropFilter: 'blur(21px)',
        minWidth: 220, zIndex: 10,
        boxShadow: `0 8px 30px rgba(0,0,0,0.4), 0 0 20px ${root.color}11`,
      }
    },
      words.map((w, i) =>
        React.createElement('div', {
          key: w.id,
          style: {
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '6px 0',
            borderBottom: i < words.length - 1 ? '1px solid rgba(48,54,61,0.3)' : 'none',
            opacity: reveal ? 1 : 0,
            transform: reveal ? 'translateY(0)' : 'translateY(8px)',
            transition: `all 377ms ease ${i * 80}ms`,
          }
        },
          React.createElement('span', {
            style: { fontFamily: "'Cinzel Decorative', serif", fontSize: 15, color: '#e6edf3' }
          }, w.european),
          React.createElement('span', {
            style: { fontFamily: "'Amiri', serif", fontSize: 16, color: '#f39c12', direction: 'rtl' }
          }, w.arabicRoot),
        )
      )
    ),
  );
}

/* ── Word of the Day ── */
function WordOfDay() {
  const wod = ATUM_DATA.wordOfDay;
  const root = ATUM_DATA.roots[wod.rootId];
  return React.createElement('div', {
    style: {
      maxWidth: 610, margin: '0 auto',
      background: 'rgba(22, 27, 34, 0.6)',
      border: '1px solid rgba(243, 156, 18, 0.25)',
      borderRadius: 13, padding: '34px',
      position: 'relative', overflow: 'hidden',
    }
  },
    React.createElement('div', {
      style: {
        position: 'absolute', top: 0, right: 0,
        width: 120, height: 120,
        background: `radial-gradient(circle at top right, ${root.color}15, transparent 70%)`,
      }
    }),
    React.createElement('div', {
      style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 21 }
    },
      React.createElement('div', null,
        React.createElement('div', {
          style: {
            fontSize: 11, color: '#f39c12', letterSpacing: '2px',
            fontFamily: "'JetBrains Mono', monospace",
            textTransform: 'uppercase', marginBottom: 8,
          }
        }, 'Word of the Day'),
        React.createElement('div', {
          style: { fontFamily: "'Cinzel Decorative', serif", fontSize: 34, color: '#e6edf3' }
        }, wod.european),
      ),
      React.createElement('div', {
        style: {
          fontFamily: "'Amiri', serif", fontSize: 42,
          color: '#f39c12', direction: 'rtl',
          textShadow: '0 0 20px rgba(243,156,18,0.3)',
        }
      }, wod.arabicRoot),
    ),
    React.createElement('p', {
      style: { fontSize: 15, color: '#8b949e', lineHeight: 1.7 }
    }, wod.insight),
    React.createElement('div', { style: { marginTop: 13 } },
      React.createElement(RootBadge, { rootId: wod.rootId, size: 'sm' }),
    ),
  );
}

/* ── Stats Strip ── */
function StatsStrip() {
  const s = ATUM_DATA.stats;
  return React.createElement('div', {
    style: {
      display: 'flex', gap: 13, justifyContent: 'center',
      flexWrap: 'wrap', maxWidth: 900, margin: '0 auto',
    }
  },
    React.createElement(StatCard, { value: s.totalWords, label: 'Words Analyzed', color: '#e6edf3', delay: 0 }),
    React.createElement(StatCard, { value: s.provenWords, label: 'Proven Roots', color: '#22C55E', prefix: '', delay: 200 }),
    React.createElement(StatCard, { value: s.sources, label: 'Source Languages', color: '#3B82F6', delay: 400 }),
    React.createElement(StatCard, { value: s.cnnAccuracy, label: 'CNN Accuracy', color: '#f39c12', suffix: '%', delay: 600 }),
  );
}

/* ── Homepage ── */
function HomePage({ onNavigate, tweaks }) {
  const canvasRef = useRef(null);
  const torusRef = useRef(null);
  const [searchVal, setSearchVal] = useState('');

  useEffect(() => {
    if (canvasRef.current && !torusRef.current) {
      torusRef.current = new TorusField(canvasRef.current, {
        particleCount: tweaks.particleCount || 1400,
        speed: tweaks.animSpeed || 1,
        glowIntensity: tweaks.glowIntensity || 1,
      });
    }
    return () => { if (torusRef.current) torusRef.current.destroy(); };
  }, []);

  useEffect(() => {
    if (torusRef.current) {
      torusRef.current.setSpeed(tweaks.animSpeed || 1);
      torusRef.current.setGlow(tweaks.glowIntensity || 1);
    }
  }, [tweaks.animSpeed, tweaks.glowIntensity]);

  const handleSearch = () => {
    if (searchVal.trim()) onNavigate('explorer', null, searchVal.trim());
  };

  return React.createElement(React.Fragment, null,
    /* Hero */
    React.createElement('section', {
      style: {
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
        padding: '120px 34px 55px',
      }
    },
      /* Torus canvas */
      React.createElement('canvas', {
        ref: canvasRef,
        style: {
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          opacity: 0.7, zIndex: 0,
        }
      }),

      /* Content */
      React.createElement('div', {
        style: { position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 900 }
      },
        React.createElement('h1', {
          style: {
            fontFamily: "'Cinzel Decorative', serif",
            fontSize: 'clamp(34px, 6vw, 89px)',
            color: '#e6edf3', lineHeight: 1.15,
            marginBottom: 21,
            textShadow: '0 0 40px rgba(243,156,18,0.15)',
            letterSpacing: '3px',
          }
        }, 'Every Word Has a Root'),
        React.createElement('p', {
          style: {
            fontSize: 'clamp(16px, 2vw, 21px)',
            color: '#8b949e', maxWidth: 550,
            margin: '0 auto 55px', lineHeight: 1.7,
          }
        }, 'Three electromagnetic roots — ATUM, BULL, TOR — form the hidden architecture beneath all world languages.'),

        /* Search */
        React.createElement('div', {
          style: { display: 'flex', justifyContent: 'center', marginBottom: 89 }
        },
          React.createElement(SearchBar, {
            value: searchVal,
            onChange: setSearchVal,
            onSubmit: handleSearch,
          }),
        ),

        /* Root Circles */
        React.createElement('div', {
          style: {
            display: 'flex', gap: 34,
            justifyContent: 'center', alignItems: 'flex-start',
            flexWrap: 'wrap',
          }
        },
          React.createElement(RootCircle, { rootId: 'ATUM', onNavigate }),
          React.createElement(RootCircle, { rootId: 'BULL', onNavigate }),
          React.createElement(RootCircle, { rootId: 'TOR', onNavigate }),
        ),
      ),
    ),

    /* Word of Day */
    React.createElement('section', {
      style: { padding: '89px 34px 55px', position: 'relative', zIndex: 1 }
    },
      React.createElement(SectionHeader, {
        title: 'Word of the Day',
        subtitle: 'Discover the hidden root behind an everyday word',
      }),
      React.createElement(WordOfDay, null),
    ),

    /* Stats */
    React.createElement('section', {
      style: { padding: '55px 34px 89px', position: 'relative', zIndex: 1 }
    },
      React.createElement(SectionHeader, {
        title: 'The Research',
        subtitle: 'Backed by computational linguistics and statistical analysis',
      }),
      React.createElement(StatsStrip, null),
    ),

    React.createElement(Footer, null),
  );
}

Object.assign(window, { HomePage });
