/* ═══════════════════════════════════════════════
   ATUM — App Shell (Router + Tweaks)
   ═══════════════════════════════════════════════ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "glowIntensity": 1,
  "animSpeed": 1,
  "particleCount": 1400,
  "showHexGrid": true,
  "accentHue": "gold"
}/*EDITMODE-END*/;

function AtumApp() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [page, setPage] = React.useState('home');
  const [filterRoot, setFilterRoot] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState('');

  const navigate = React.useCallback((target, filter, search) => {
    setPage(target);
    if (filter !== undefined) setFilterRoot(filter);
    if (search !== undefined) setSearchQuery(search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /* Render page */
  const renderPage = () => {
    switch (page) {
      case 'home':
        return React.createElement(HomePage, { onNavigate: navigate, tweaks });
      case 'explorer':
        return React.createElement(ExplorerPage, {
          onNavigate: navigate, tweaks,
          initialFilter: filterRoot, initialSearch: searchQuery,
        });
      case 'patterns':
        return React.createElement(PatternsPage, { onNavigate: navigate, tweaks });
      case 'letters':
        return React.createElement(LetterPage, { onNavigate: navigate, tweaks });
      case 'research':
        return React.createElement(ResearchPage, { tweaks });
      default:
        return React.createElement(HomePage, { onNavigate: navigate, tweaks });
    }
  };

  const accentColors = {
    gold: { accent: '#f39c12' },
    emerald: { accent: '#22C55E' },
    sapphire: { accent: '#3B82F6' },
    ruby: { accent: '#EF4444' },
  };

  return React.createElement(React.Fragment, null,
    tweaks.showHexGrid && React.createElement(HexGrid, { opacity: 0.03 }),
    React.createElement(Navigation, { currentPage: page, onNavigate: navigate }),
    React.createElement('div', {
      style: { position: 'relative', zIndex: 1 }
    }, renderPage()),

    /* Tweaks Panel */
    React.createElement(TweaksPanel, { title: 'Tweaks' },
      React.createElement(TweakSection, { label: 'Visual' },
        React.createElement(TweakSlider, {
          label: 'Glow Intensity',
          value: tweaks.glowIntensity, min: 0, max: 2, step: 0.1,
          onChange: v => setTweak('glowIntensity', v),
        }),
        React.createElement(TweakSlider, {
          label: 'Animation Speed',
          value: tweaks.animSpeed, min: 0.2, max: 3, step: 0.1,
          onChange: v => setTweak('animSpeed', v),
        }),
        React.createElement(TweakSlider, {
          label: 'Particle Density',
          value: tweaks.particleCount, min: 400, max: 3000, step: 100,
          onChange: v => setTweak('particleCount', v),
        }),
      ),
      React.createElement(TweakSection, { label: 'Layout' },
        React.createElement(TweakToggle, {
          label: 'Hex Grid Background',
          value: tweaks.showHexGrid,
          onChange: v => setTweak('showHexGrid', v),
        }),
        React.createElement(TweakSelect, {
          label: 'Accent Tone',
          value: tweaks.accentHue,
          options: ['gold', 'emerald', 'sapphire', 'ruby'],
          onChange: v => setTweak('accentHue', v),
        }),
      ),
    ),
  );
}

/* Mount */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(AtumApp));
