/* ═══════════════════════════════════════════════
   ATUM Shared Components
   ═══════════════════════════════════════════════ */
const { useState, useEffect, useRef, useCallback } = React;

/* ── Hex Grid Background ── */
function HexGrid({ opacity = 0.03 }) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='60' height='52'>
    <polygon points='30,0 60,15 60,37 30,52 0,37 0,15' fill='none' stroke='rgba(139,148,158,${opacity})' stroke-width='0.5'/>
  </svg>`;
  return React.createElement('div', {
    style: {
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
      backgroundSize: '60px 52px',
    }
  });
}

/* ── Navigation ── */
const navStyles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '13px 34px',
    background: 'rgba(10, 10, 15, 0.75)',
    backdropFilter: 'blur(21px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(21px) saturate(1.4)',
    borderBottom: '1px solid rgba(48, 54, 61, 0.4)',
    transition: 'background 377ms ease',
  },
  brand: {
    display: 'flex', alignItems: 'center', gap: '13px', cursor: 'pointer',
  },
  brandMark: {
    width: 34, height: 34, borderRadius: '50%',
    background: 'linear-gradient(135deg, #22C55E 0%, #3B82F6 50%, #EF4444 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '14px', fontWeight: 700, color: '#fff',
    fontFamily: "'Cinzel Decorative', serif",
  },
  brandName: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '21px', fontWeight: 700,
    background: 'linear-gradient(90deg, #22C55E, #3B82F6)',
    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
    letterSpacing: '3px',
  },
  links: {
    display: 'flex', gap: '34px', alignItems: 'center',
  },
  link: (active) => ({
    fontFamily: "'Source Serif 4', serif",
    fontSize: '14px', color: active ? '#e6edf3' : '#8b949e',
    textDecoration: 'none', cursor: 'pointer',
    transition: 'color 233ms ease',
    borderBottom: active ? '2px solid #f39c12' : '2px solid transparent',
    paddingBottom: '4px', letterSpacing: '1px',
    textTransform: 'uppercase',
  }),
};

function Navigation({ currentPage, onNavigate }) {
  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'explorer', label: 'Explorer' },
    { id: 'patterns', label: 'Patterns' },
    { id: 'letters', label: 'Letters' },
    { id: 'research', label: 'Research' },
  ];

  return React.createElement('nav', { style: navStyles.nav },
    React.createElement('div', {
      style: navStyles.brand,
      onClick: () => onNavigate('home'),
    },
      React.createElement('div', { style: navStyles.brandMark }, 'A'),
      React.createElement('span', { style: navStyles.brandName }, 'ATUM'),
    ),
    React.createElement('div', { style: navStyles.links },
      pages.map(p =>
        React.createElement('span', {
          key: p.id,
          style: navStyles.link(currentPage === p.id),
          onClick: () => onNavigate(p.id),
          onMouseEnter: (e) => { if (currentPage !== p.id) e.target.style.color = '#e6edf3'; },
          onMouseLeave: (e) => { if (currentPage !== p.id) e.target.style.color = '#8b949e'; },
        }, p.label)
      )
    ),
  );
}

/* ── Search Bar ── */
const searchBarStyles = {
  wrapper: (focused) => ({
    position: 'relative', width: '100%', maxWidth: 610,
    borderRadius: 13,
    background: focused ? 'rgba(22, 27, 34, 0.95)' : 'rgba(22, 27, 34, 0.8)',
    border: `1px solid ${focused ? 'rgba(243, 156, 18, 0.5)' : 'rgba(48, 54, 61, 0.6)'}`,
    boxShadow: focused ? '0 0 30px rgba(243, 156, 18, 0.15), 0 0 60px rgba(243, 156, 18, 0.05)' : 'none',
    transition: 'all 377ms ease',
  }),
  input: {
    width: '100%', padding: '16px 24px 16px 50px',
    background: 'transparent', border: 'none', outline: 'none',
    fontFamily: "'Source Serif 4', serif",
    fontSize: '18px', color: '#e6edf3',
  },
  icon: {
    position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)',
    fontSize: '18px', color: '#8b949e', pointerEvents: 'none',
  },
};

function SearchBar({ value, onChange, onSubmit, placeholder = 'Search any word to find its root...', autoFocus = false }) {
  const [focused, setFocused] = useState(false);
  return React.createElement('div', { style: searchBarStyles.wrapper(focused) },
    React.createElement('span', { style: searchBarStyles.icon }, '⌕'),
    React.createElement('input', {
      type: 'text', value: value || '', placeholder,
      style: searchBarStyles.input,
      autoFocus,
      onChange: (e) => onChange && onChange(e.target.value),
      onFocus: () => setFocused(true),
      onBlur: () => setFocused(false),
      onKeyDown: (e) => { if (e.key === 'Enter' && onSubmit) onSubmit(value); },
    }),
  );
}

/* ── Root Badge ── */
function RootBadge({ rootId, size = 'md', style: extraStyle = {} }) {
  const root = ATUM_DATA.roots[rootId];
  if (!root) return null;
  const sizes = { sm: { fontSize: 11, padding: '3px 10px' }, md: { fontSize: 13, padding: '5px 14px' }, lg: { fontSize: 16, padding: '8px 20px' } };
  const s = sizes[size] || sizes.md;
  return React.createElement('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: s.fontSize, padding: s.padding,
      borderRadius: 21, fontWeight: 600,
      color: root.color,
      background: root.colorDim,
      border: `1px solid ${root.color}33`,
      letterSpacing: '1px',
      ...extraStyle,
    }
  }, root.id);
}

/* ── Confidence Badge ── */
function ConfidenceBadge({ level, showLabel = true }) {
  const conf = ATUM_DATA.confidenceLevels[level];
  if (!conf) return null;
  const colors = {
    proven: '#22C55E', strong: '#3B82F6', moderate: '#f39c12', emerging: '#8b949e'
  };
  return React.createElement('span', {
    title: conf.description,
    style: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 13, color: colors[level] || '#8b949e',
      fontFamily: "'JetBrains Mono', monospace",
    }
  },
    React.createElement('span', { style: { fontSize: 16 } }, conf.icon),
    showLabel && React.createElement('span', null, conf.label),
  );
}

/* ── Etymology Card ── */
const cardStyles = {
  card: (rootColor, expanded) => ({
    background: expanded ? 'rgba(28, 33, 40, 0.95)' : 'rgba(22, 27, 34, 0.8)',
    border: `1px solid ${expanded ? rootColor + '44' : 'rgba(48, 54, 61, 0.5)'}`,
    borderRadius: 13, padding: expanded ? '34px' : '21px',
    cursor: 'pointer',
    transition: 'all 377ms ease',
    position: 'relative', overflow: 'hidden',
  }),
  european: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: 28, color: '#e6edf3', marginBottom: 8,
    letterSpacing: '1px',
  },
  arabic: {
    fontFamily: "'Amiri', serif", direction: 'rtl',
    fontSize: 24, color: '#f39c12', marginBottom: 13,
    display: 'flex', alignItems: 'center', gap: 8,
  },
  rule: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13, color: '#22C55E',
    padding: '6px 12px', background: 'rgba(34, 197, 94, 0.08)',
    borderRadius: 8, marginBottom: 13, display: 'inline-block',
  },
  meaning: {
    fontSize: 15, color: '#8b949e', fontStyle: 'italic',
    marginBottom: 13,
  },
  path: {
    fontFamily: "'Source Serif 4', serif",
    fontSize: 14, color: '#8b949e', lineHeight: 1.8,
    padding: '13px 0', borderTop: '1px solid rgba(48,54,61,0.5)',
    marginTop: 13,
  },
  accentBar: (color) => ({
    position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
    background: color, borderRadius: '3px 0 0 3px',
  }),
};

function EtymologyCard({ word, onClick, expanded = false }) {
  const root = ATUM_DATA.roots[word.rootId];
  const [hover, setHover] = useState(false);
  const style = {
    ...cardStyles.card(root.color, expanded),
    transform: hover ? 'translateY(-2px)' : 'none',
    boxShadow: hover ? `0 8px 30px ${root.color}15` : 'none',
  };
  return React.createElement('div', {
    style, onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  },
    React.createElement('div', { style: cardStyles.accentBar(root.color) }),
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 } },
      React.createElement('div', { style: cardStyles.european }, word.european),
      React.createElement('div', { style: { display: 'flex', gap: 8, alignItems: 'center' } },
        React.createElement(ConfidenceBadge, { level: word.confidence, showLabel: false }),
        React.createElement(RootBadge, { rootId: word.rootId, size: 'sm' }),
      ),
    ),
    React.createElement('div', { style: cardStyles.arabic },
      React.createElement('span', null, '← '),
      React.createElement('span', { style: { fontFamily: "'Amiri', serif" } }, word.arabicRoot),
      React.createElement('span', { style: { fontSize: 14, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace", direction: 'ltr' } }, ` (${word.transliteration})`),
    ),
    React.createElement('div', { style: cardStyles.rule }, word.rule),
    expanded && React.createElement(React.Fragment, null,
      React.createElement('div', { style: cardStyles.meaning }, `"${word.meaning}"`),
      React.createElement('div', { style: cardStyles.path },
        React.createElement('div', { style: { color: '#e6edf3', fontSize: 13, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '1px' } }, 'Language Path'),
        word.path,
      ),
      word.languages && React.createElement('div', { style: { display: 'flex', gap: 8, marginTop: 13, flexWrap: 'wrap' } },
        word.languages.map(l =>
          React.createElement('span', {
            key: l,
            style: { fontSize: 12, padding: '3px 10px', borderRadius: 21, background: 'rgba(48,54,61,0.5)', color: '#8b949e' }
          }, l)
        )
      ),
    ),
  );
}

/* ── Stat Card ── */
function StatCard({ value, label, prefix = '', suffix = '', color = '#e6edf3', delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const numVal = parseFloat(String(value).replace(/[^0-9.-]/g, ''));
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !animated.current) {
        animated.current = true;
        const start = Date.now();
        const dur = 1200;
        const timer = setInterval(() => {
          const progress = Math.min((Date.now() - start - delay) / dur, 1);
          if (progress < 0) return;
          const ease = 1 - Math.pow(1 - progress, 3);
          setDisplay(numVal * ease);
          if (progress >= 1) clearInterval(timer);
        }, 16);
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const formatted = Number.isInteger(numVal)
    ? Math.round(display).toLocaleString()
    : display.toFixed(String(value).includes('.') ? String(value).split('.')[1].length : 1);

  return React.createElement('div', {
    ref,
    style: {
      textAlign: 'center', padding: '21px',
      background: 'rgba(22, 27, 34, 0.6)',
      border: '1px solid rgba(48,54,61,0.4)',
      borderRadius: 13, flex: 1, minWidth: 140,
    }
  },
    React.createElement('div', {
      style: { fontFamily: "'Cinzel Decorative', serif", fontSize: 34, color, fontWeight: 700, lineHeight: 1.2 }
    }, prefix + formatted + suffix),
    React.createElement('div', {
      style: { fontSize: 13, color: '#8b949e', marginTop: 8, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: "'JetBrains Mono', monospace" }
    }, label),
  );
}

/* ── GlowText ── */
function GlowText({ children, color = '#f39c12', size = 34, font = 'display', style: extra = {} }) {
  const fonts = { display: "'Cinzel Decorative', serif", body: "'Source Serif 4', serif", arabic: "'Amiri', serif", mono: "'JetBrains Mono', monospace" };
  return React.createElement('div', {
    style: {
      fontFamily: fonts[font] || fonts.display,
      fontSize: size, color,
      textShadow: `0 0 20px ${color}66, 0 0 40px ${color}33`,
      lineHeight: 1.3,
      ...extra,
    }
  }, children);
}

/* ── Section Header ── */
function SectionHeader({ title, subtitle, align = 'center' }) {
  return React.createElement('div', {
    style: { textAlign: align, marginBottom: 55 }
  },
    React.createElement('h2', {
      style: {
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 34, color: '#e6edf3',
        marginBottom: subtitle ? 13 : 0,
        letterSpacing: '2px',
      }
    }, title),
    subtitle && React.createElement('p', {
      style: { fontSize: 16, color: '#8b949e', maxWidth: 610, margin: align === 'center' ? '0 auto' : '0' }
    }, subtitle),
  );
}

/* ── Filter Pills ── */
function FilterPills({ options, active, onChange, style: extraStyle = {} }) {
  return React.createElement('div', {
    style: { display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', ...extraStyle }
  },
    options.map(opt =>
      React.createElement('button', {
        key: opt.id,
        onClick: () => onChange(opt.id),
        style: {
          padding: '8px 21px', borderRadius: 21,
          border: `1px solid ${active === opt.id ? (opt.color || '#f39c12') : 'rgba(48,54,61,0.5)'}`,
          background: active === opt.id ? (opt.color || '#f39c12') + '22' : 'transparent',
          color: active === opt.id ? (opt.color || '#f39c12') : '#8b949e',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13, cursor: 'pointer',
          transition: 'all 233ms ease',
          letterSpacing: '1px', fontWeight: 600,
        }
      }, opt.label)
    )
  );
}

/* ── Page Wrapper ── */
function PageWrapper({ children, style = {} }) {
  return React.createElement('div', {
    style: {
      minHeight: '100vh', paddingTop: 80,
      position: 'relative', zIndex: 1,
      ...style,
    }
  }, children);
}

/* ── Footer ── */
function Footer() {
  return React.createElement('footer', {
    style: {
      textAlign: 'center', padding: '55px 34px 34px',
      borderTop: '1px solid rgba(48,54,61,0.3)',
      marginTop: 89,
    }
  },
    React.createElement('div', {
      style: {
        fontFamily: "'Cinzel Decorative', serif",
        fontSize: 16, color: '#8b949e',
        letterSpacing: '3px', marginBottom: 8,
      }
    }, 'ATUM'),
    React.createElement('div', {
      style: { fontSize: 13, color: '#484f58' }
    }, 'The Root of All Words'),
  );
}

// Export all
Object.assign(window, {
  HexGrid, Navigation, SearchBar, RootBadge, ConfidenceBadge,
  EtymologyCard, StatCard, GlowText, SectionHeader, FilterPills,
  PageWrapper, Footer,
});
