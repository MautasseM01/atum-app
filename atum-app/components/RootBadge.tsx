import { cn } from '@/lib/utils';

interface RootBadgeProps {
  root: 'ATUM' | 'BULL' | 'TOR' | string;
  size?: 'sm' | 'md' | 'lg';
}

const rootConfig = {
  ATUM: { color: '#22C55E', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  BULL: { color: '#EF4444', bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400' },
  TOR: { color: '#3B82F6', bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
};

export default function RootBadge({ root, size = 'md' }: RootBadgeProps) {
  const key = root.toUpperCase();
  const cfg = rootConfig[key as keyof typeof rootConfig] || rootConfig.TOR;
  const sizeClass = size === 'sm' ? 'text-[10px] px-2 py-0.5' : size === 'lg' ? 'text-sm px-4 py-1.5' : 'text-xs px-3 py-1';

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full font-bold border tracking-wider uppercase', cfg.bg, cfg.border, cfg.text, sizeClass)}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
      {key}
    </span>
  );
}
