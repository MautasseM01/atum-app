'use client';

import { useState, useTransition, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, BookOpen, AlertCircle } from 'lucide-react';

interface Etymology {
  id: string;
  arabicRoot: string;
  arabicForm: string;
  arabicMeaning: string;
  modernWord: string;
  modernMeaning: string;
  targetLanguage: string;
  transformationRule: string;
  languagePath: string;
  domain: string;
  confidence: string;
  notes?: string;
}

interface QuickSearchProps {
  etymologies: Etymology[];
}

export default function QuickSearch({ etymologies }: QuickSearchProps) {
  const t = useTranslations('Index');
  const [query, setQuery] = useState('');
  const [selectedWord, setSelectedWord] = useState<Etymology | null>(null);

  // Suggested keywords
  const suggestions = ['Motor', 'Atom', 'Delta', 'Story', 'Medicine'];

  const filteredEtymologies = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchLower = query.toLowerCase();
    return etymologies.filter(
      (item) =>
        item.modernWord.toLowerCase().includes(searchLower) ||
        item.arabicRoot.includes(searchLower) ||
        item.arabicForm.includes(searchLower) ||
        item.modernMeaning.includes(searchLower)
    ).slice(0, 5); // Limit to top 5 results
  }, [query, etymologies]);

  const getConfidenceBadge = (confidenceStr: string) => {
    if (confidenceStr.includes('محتمل') || confidenceStr.toLowerCase().includes('probable')) {
      return { text: t('confidenceProbable'), color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    }
    if (confidenceStr.includes('عالي') || confidenceStr.toLowerCase().includes('high') || confidenceStr.toLowerCase().includes('proven')) {
      return { text: t('confidenceProven'), color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    }
    if (confidenceStr.includes('استكشافي') || confidenceStr.toLowerCase().includes('exploratory')) {
      return { text: t('confidenceExploratory'), color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    }
    return { text: t('confidenceSpeculative'), color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 relative z-20">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-zinc-400">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('searchPlaceholder')}
          className="w-full py-4 ps-12 pe-4 bg-[#161b22] border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-base md:text-lg"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 end-0 flex items-center pe-4 text-zinc-400 hover:text-zinc-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggested chips */}
      <div className="flex flex-wrap gap-2 mt-3 items-center text-sm px-1">
        <span className="text-zinc-500">{t('suggested')}:</span>
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setQuery(suggestion)}
            className="px-3 py-1 bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-700/50 hover:border-zinc-600 rounded-full text-zinc-300 transition-all text-xs"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Search Dropdown Results */}
      {query.trim() && (
        <div className="absolute w-full mt-2 bg-[#161b22] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
          {filteredEtymologies.length > 0 ? (
            <div className="divide-y divide-zinc-800/60">
              {filteredEtymologies.map((item) => {
                const badge = getConfidenceBadge(item.confidence);
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedWord(item);
                      setQuery('');
                    }}
                    className="w-full px-5 py-4 flex items-center justify-between text-start hover:bg-zinc-800/30 transition-all"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-lg font-bold text-zinc-100 font-sans tracking-wide">
                        {item.modernWord}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {t('meaning')}: {item.modernMeaning}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-arabic font-bold text-amber-500">
                        {item.arabicRoot}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 border rounded-full font-medium ${badge.color}`}>
                        {badge.text}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-5 py-6 text-center text-zinc-500 flex flex-col items-center gap-2">
              <AlertCircle className="w-8 h-8 text-zinc-600" />
              <span>No results found. Try search for other words like "Motor".</span>
            </div>
          )}
        </div>
      )}

      {/* Selected Word Details Overlay (Modal/Card) */}
      {selectedWord && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm z-50 animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#161b22]/95 border border-zinc-800 rounded-2xl shadow-2xl p-6 md:p-8 overflow-hidden">
            {/* Ambient glows inside card */}
            <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedWord(null)}
              className="absolute top-4 end-4 text-zinc-400 hover:text-zinc-100 transition-colors p-1 bg-zinc-800/50 hover:bg-zinc-800 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded">
                {selectedWord.domain || 'Linguistics'}
              </span>
              <h3 className="text-3xl font-bold font-sans text-zinc-100 mt-3 flex items-baseline gap-2">
                {selectedWord.modernWord}
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
                {t('meaning')}: <span className="text-zinc-200">{selectedWord.modernMeaning}</span>
              </p>
            </div>

            {/* Details Grid */}
            <div className="space-y-4 border-t border-b border-zinc-800/80 py-5 my-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">{t('arabicRoot')}</span>
                <span className="text-xl font-bold font-arabic text-amber-400 bg-amber-400/5 border border-amber-400/15 px-3 py-1 rounded">
                  {selectedWord.arabicRoot} ({selectedWord.arabicForm})
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">Root Meaning</span>
                <span className="text-sm font-arabic font-medium text-zinc-300">
                  {selectedWord.arabicMeaning}
                </span>
              </div>

              {selectedWord.transformationRule && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">{t('phoneticRule')}</span>
                  <span className="text-sm font-mono bg-zinc-900 border border-zinc-850 px-2.5 py-0.5 rounded text-zinc-300">
                    {selectedWord.transformationRule}
                  </span>
                </div>
              )}

              {selectedWord.languagePath && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400">Language Path</span>
                  <span className="text-xs font-mono text-zinc-400 text-end">
                    {selectedWord.languagePath}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-sm text-zinc-400">{t('confidence')}</span>
                <span className={`text-xs px-2.5 py-1 border rounded-full font-semibold ${getConfidenceBadge(selectedWord.confidence).color}`}>
                  {getConfidenceBadge(selectedWord.confidence).text}
                </span>
              </div>
            </div>

            {/* Notes Section */}
            {selectedWord.notes && (
              <div className="bg-zinc-900/60 border border-zinc-850 p-4 rounded-xl">
                <span className="text-xs font-mono text-zinc-500 block mb-1">NOTES & RESEARCH</span>
                <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                  {selectedWord.notes}
                </p>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedWord(null)}
                className="w-full md:w-auto px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-xl transition-all border border-zinc-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
