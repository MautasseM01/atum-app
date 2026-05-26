'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import RootBadge from './RootBadge';
import ConfidenceBadge from './ConfidenceBadge';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface EtymologyCardProps {
  word: string;
  arabicRoot?: string;
  arabicForm?: string;
  transformationRule?: string;
  meaning?: string;
  confidence: string;
  root?: string;
  etymology?: string;
  languagePath?: string;
  notes?: string;
}

const rootBorderColor: Record<string, string> = {
  ATOM: 'hover:border-emerald-500/40',
  BULL: 'hover:border-rose-500/40',
  TOR: 'hover:border-blue-500/40',
};

export default function EtymologyCard({
  word, arabicRoot, arabicForm, transformationRule,
  meaning, confidence, root, etymology, languagePath, notes,
}: EtymologyCardProps) {
  const [expanded, setExpanded] = useState(false);
  const rootKey = root?.toUpperCase() || '';
  const borderClass = rootBorderColor[rootKey] || 'hover:border-zinc-500/40';

  return (
    <div
      className={cn(
        'bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-2xl p-5 transition-all duration-300 cursor-pointer',
        borderClass, expanded ? 'border-opacity-60' : 'hover:-translate-y-0.5'
      )}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold font-cinzel text-zinc-100 tracking-tight">{word}</h3>
        {root && <RootBadge root={root} size="sm" />}
      </div>

      {(arabicForm || arabicRoot) && (
        <div className="mb-2">
          <span className="text-lg font-arabic text-amber-400" dir="rtl">
            {arabicForm || ''} {arabicRoot ? `← ${arabicRoot}` : ''}
          </span>
        </div>
      )}

      {transformationRule && (
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2.5 py-1 mb-3">
          <span className="text-xs font-mono text-emerald-400">{transformationRule}</span>
        </div>
      )}

      {meaning && (
        <p className="text-sm text-zinc-400 italic leading-relaxed mb-3">{meaning}</p>
      )}

      <div className="flex items-center justify-between">
        <ConfidenceBadge level={confidence} size="sm" />
        <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#2a2a2a] space-y-3 text-sm animate-fade-in">
          {etymology && (
            <div>
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1">Etymology</span>
              <p className="text-zinc-300 leading-relaxed">{etymology}</p>
            </div>
          )}
          {languagePath && (
            <div className="flex justify-between">
              <span className="text-zinc-500 text-xs">Language Path</span>
              <span className="text-xs font-mono text-zinc-400">{languagePath}</span>
            </div>
          )}
          {notes && (
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-3">
              <span className="text-[10px] font-mono text-zinc-500 block mb-1">NOTES</span>
              <p className="text-xs text-zinc-400 leading-relaxed">{notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
