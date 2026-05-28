interface RootBadgeProps {
  rootId: string;
  size?: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const roots: Record<string, { color: string; colorDim: string }> = {
  ATUM: { color: '#22C55E', colorDim: 'rgba(34,197,94,0.15)' },
  BULL: { color: '#EF4444', colorDim: 'rgba(239,68,68,0.15)' },
  TOR: { color: '#3B82F6', colorDim: 'rgba(59,130,246,0.15)' },
};

export default function RootBadge({ rootId, size = 'md', style: extraStyle = {} }: RootBadgeProps) {
  const root = roots[rootId.toUpperCase()] || roots.TOR;
  const sizes = { sm: { fontSize: 11, padding: '3px 10px' }, md: { fontSize: 13, padding: '5px 14px' }, lg: { fontSize: 16, padding: '8px 20px' } };
  const s = sizes[size] || sizes.md;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: s.fontSize, padding: s.padding,
      borderRadius: 21, fontWeight: 600,
      color: root.color,
      background: root.colorDim,
      border: `1px solid ${root.color}33`,
      letterSpacing: '1px',
      ...extraStyle,
    }}>
      {rootId.toUpperCase()}
    </span>
  );
}
