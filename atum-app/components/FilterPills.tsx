interface FilterOption {
  id: string;
  label: string;
  color?: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  active: string;
  onChange: (id: string) => void;
  style?: React.CSSProperties;
}

export default function FilterPills({ options, active, onChange, style: extraStyle = {} }: FilterPillsProps) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', ...extraStyle }}>
      {options.map(opt => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          style={{
            padding: '8px 21px', borderRadius: 21,
            border: `1px solid ${active === opt.id ? (opt.color || '#f39c12') : 'rgba(48,54,61,0.5)'}`,
            background: active === opt.id ? (opt.color || '#f39c12') + '22' : 'transparent',
            color: active === opt.id ? (opt.color || '#f39c12') : '#8b949e',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13, cursor: 'pointer',
            transition: 'all 233ms ease',
            letterSpacing: '1px', fontWeight: 600,
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
