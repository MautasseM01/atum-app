import { cn } from '@/lib/utils';

interface StatCardProps {
  value: string;
  label: string;
  color?: string;
}

export default function StatCard({ value, label, color = '#22C55E' }: StatCardProps) {
  return (
    <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] hover:border-opacity-60 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-0.5">
      <div className="text-3xl md:text-4xl font-bold font-cinzel tracking-tight mb-1" style={{ color }}>
        {value}
      </div>
      <div className="text-xs text-zinc-500 uppercase tracking-wider font-medium">
        {label}
      </div>
    </div>
  );
}
