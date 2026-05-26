interface ConfidenceBadgeProps {
  level: string;
  showLabel?: boolean;
}

const colors: Record<string, string> = {
  proven: '#22C55E', strong: '#3B82F6', moderate: '#f39c12', emerging: '#8b949e',
};

const labels: Record<string, string> = {
  proven: '🔬', strong: '🧩', moderate: '🔍', emerging: '❓',
};

const descriptions: Record<string, string> = {
  proven: 'Confirmed through multiple evidence chains',
  strong: 'Strong correlation with supporting data',
  moderate: 'Plausible connection, further research needed',
  emerging: 'Hypothetical, initial observation only',
};

export default function ConfidenceBadge({ level, showLabel = true }: ConfidenceBadgeProps) {
  const normalized = level.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  let matched = 'emerging';
  if (normalized.includes('proven') || normalized.includes('high') || normalized.includes('عال') || normalized.includes('مؤكد')) matched = 'proven';
  else if (normalized.includes('strong') || normalized.includes('probable') || normalized.includes('محتم')) matched = 'strong';
  else if (normalized.includes('moderate') || normalized.includes('exploratory') || normalized.includes('استكش') || normalized.includes('تخم')) matched = 'moderate';

  return (
    <span
      title={descriptions[matched]}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontSize: 13, color: colors[matched] || '#8b949e',
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <span style={{ fontSize: 16 }}>{labels[matched]}</span>
      {showLabel && <span>{matched.charAt(0).toUpperCase() + matched.slice(1)}</span>}
    </span>
  );
}
