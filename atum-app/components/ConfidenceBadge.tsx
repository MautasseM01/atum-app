import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  level: string;
  size?: 'sm' | 'md';
}

const levels: { label: string; icon: string; className: string; match: string[] }[] = [
  { label: 'Proven', icon: '\uD83D\uDD2C', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', match: ['proven', 'high', 'عال', 'مؤكد'] },
  { label: 'Strong', icon: '\uD83E\uDDE7', className: 'bg-amber-500/10 text-amber-400 border-amber-500/30', match: ['strong', 'probable', 'محتم'] },
  { label: 'Exploratory', icon: '\uD83D\uDD0D', className: 'bg-blue-500/10 text-blue-400 border-blue-500/30', match: ['exploratory', 'moderate', 'استكش'] },
  { label: 'Speculative', icon: '\u2753', className: 'bg-rose-500/10 text-rose-400 border-rose-500/30', match: ['speculative', 'تخم'] },
];

export default function ConfidenceBadge({ level, size = 'sm' }: ConfidenceBadgeProps) {
  if (!level) return null;

  const normalized = level.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

  const found = levels.find((l) => l.match.some((m) => normalized.includes(m))) ?? levels[3];
  const sz = size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-3 py-1';

  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border font-semibold', found.className, sz)}>
      <span>{found.icon}</span><span>{found.label}</span>
    </span>
  );
}
