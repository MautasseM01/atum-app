interface ConfidenceBadgeProps {
  level: string;
  showLabel?: boolean;
}

const emojiMap: Record<string, { color: string; label: string; desc: string }> = {
  '🔬': { color: '#22C55E', label: 'Scientific', desc: 'Confirmed through multiple evidence chains' },
  '🧩': { color: '#3B82F6', label: 'Strong', desc: 'Strong correlation with supporting data' },
  '🔍': { color: '#f39c12', label: 'Exploratory', desc: 'Plausible connection, further research needed' },
  '❓': { color: '#8b949e', label: 'Speculative', desc: 'Hypothetical, initial observation only' },
  '❌': { color: '#EF4444', label: 'Excluded', desc: 'Excluded — disclaimer required' },
};

const order = ['🔬', '🧩', '🔍', '❓', '❌'];

export default function ConfidenceBadge({ level, showLabel = true }: ConfidenceBadgeProps) {
  const matched = order.find(e => level.includes(e)) || '🔍';
  const meta = emojiMap[matched] || emojiMap['🔍'];

  return (
    <span
      title={meta.desc}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 13, color: meta.color,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <span style={{ fontSize: 16 }}>{matched}</span>
      {showLabel && <span>{meta.label}</span>}
    </span>
  );
}
