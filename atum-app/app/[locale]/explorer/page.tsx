'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import EtymologyCard from '@/components/EtymologyCard';
import RootBadge from '@/components/RootBadge';
import data from '@/data/etymologies.json';

const ROOTS = ['ALL', 'ATOM', 'BULL', 'TOR'] as const;

export default function ExplorerPage() {
  const t = useTranslations('Explorer');
  const [query, setQuery] = useState('');
  const [rootFilter, setRootFilter] = useState<string>('ALL');
  const [visible, setVisible] = useState(24);

  const bridge = (data as any).bridge || [];
  const database = (data as any).database || [];

  const combined = useMemo(() => {
    const items: any[] = [];
    for (const b of bridge) {
      items.push({
        word: b.modernWord, arabicRoot: b.arabicRoot, arabicForm: b.arabicForm,
        transformationRule: b.transformationRule, meaning: b.modernMeaning,
        confidence: b.confidence, root: '', etymology: b.notes,
        languagePath: b.languagePath, notes: b.notes, id: b.id,
      });
    }
    for (const d of database.slice(0, 200)) {
      items.push({
        word: d.word, arabicRoot: d.arabicRoot, arabicForm: d.arabicForm,
        transformationRule: d.transformationRule, meaning: d.meaning,
        confidence: '', root: d.root, etymology: d.etymology,
        languagePath: d.languagePath, notes: d.notes, id: `db-${d.id}`,
      });
    }
    return items;
  }, []);

  const filtered = useMemo(() => {
    return combined.filter((item) => {
      const q = query.toLowerCase().trim();
      if (q && !item.word?.toLowerCase().includes(q) &&
          !item.arabicRoot?.toLowerCase().includes(q) &&
          !item.meaning?.toLowerCase().includes(q)) {
        return false;
      }
      if (rootFilter !== 'ALL' && item.root !== rootFilter) return false;
      return true;
    });
  }, [query, rootFilter, combined]);

  const displayed = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;

  return (
    <div className="flex-1 min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none translate-y-1/3" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-zinc-100 tracking-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-zinc-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setVisible(24); }}
              placeholder={t('searchPlaceholder')}
              className="w-full py-4 ps-12 pe-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-base"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute inset-y-0 end-0 flex items-center pe-4 text-zinc-400 hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-xs text-zinc-500 uppercase tracking-wider mr-1">{t('filterByRoot')}:</span>
            {ROOTS.map((r) => (
              <button
                key={r}
                onClick={() => { setRootFilter(r); setVisible(24); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  rootFilter === r
                    ? r === 'ALL' ? 'bg-zinc-800 text-zinc-100 border-zinc-600' : ''
                    : 'bg-transparent text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-600'
                }`}
              >
                {r === 'ALL' ? t('all') : <RootBadge root={r} size="sm" />}
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-zinc-500 mt-3">
            {t('resultsCount', { count: filtered.length })}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500">{t('noResults')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayed.map((item) => (
                <EtymologyCard
                  key={item.id}
                  word={item.word || ''}
                  arabicRoot={item.arabicRoot}
                  arabicForm={item.arabicForm}
                  transformationRule={item.transformationRule}
                  meaning={item.meaning}
                  confidence={item.confidence}
                  root={item.root}
                  etymology={item.etymology}
                  languagePath={item.languagePath}
                  notes={item.notes}
                />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={() => setVisible(visible + 24)}
                  className="px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl font-medium transition-all border border-zinc-700"
                >
                  {t('loadMore')} ({filtered.length - visible} more)
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
