import fs from 'fs';
import path from 'path';
import { getTranslations } from 'next-intl/server';
import ConfidenceBadge from '@/components/ConfidenceBadge';

interface RootPattern {
  root: string;
  arabicName: string;
  principle: string;
  principleAr: string;
  color: string;
  soundPattern: string[];
  europeanSounds: string[];
  flashcards: Array<{ arabic: string; european: string; language: string; rule: string; meaning: string; confidence: string }>;
}

export default async function PatternsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Patterns' });

  let rootData: Record<string, RootPattern> = {};
  try {
    const filePath = path.join(process.cwd(), 'data', 'rootPatterns.json');
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    rootData = parsed.roots || {};
  } catch { console.error('Failed to load root patterns'); }

  const roots = [rootData.ATUM, rootData.BULL, rootData.TOR].filter(Boolean);
  const rootColors: Record<string, string> = { ATUM: 'emerald', BULL: 'rose', TOR: 'blue' };
  const rootHex: Record<string, string> = { ATUM: '#22C55E', BULL: '#EF4444', TOR: '#3B82F6' };

  return (
    <div className="flex-1 min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-3xl pointer-events-none translate-y-1/3" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-zinc-100 tracking-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roots.map((root) => {
            const color = rootColors[root.root] || 'zinc';
            const hex = rootHex[root.root] || '#666';
            return (
              <div key={root.root} className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-2xl overflow-hidden">
                <div className={`p-6 border-b border-[#2a2a2a] bg-${color}-500/5`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-16 h-16 rounded-full bg-${color}-500/10 border-2 border-${color}-500/30 flex items-center justify-center`}>
                      <span className={`text-3xl font-bold font-arabic text-${color}-400`}>{root.arabicName?.charAt(0) || '?'}</span>
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold font-cinzel text-${color}-400`}>{root.root}</h3>
                      <p className="text-xs text-zinc-500 mt-0.5">{root.principle}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1.5">Arabic Letters</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {root.soundPattern?.map((l: string, i: number) => (
                          <span key={i} className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-sm font-arabic text-amber-400">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-500 block mb-1.5">European Sounds</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {root.europeanSounds?.map((l: string, i: number) => (
                          <span key={i} className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono text-zinc-300">
                            {l}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">
                    {t('wordFamilies')}
                  </h4>
                  <div className="space-y-3">
                    {root.flashcards?.map((fc: any, i: number) => (
                      <div key={i} className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-3.5">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-base font-bold font-sans text-zinc-100">{fc.european}</span>
                          <span className="text-lg font-arabic text-amber-400">{fc.arabic}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          {fc.rule && (
                            <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                              {fc.rule}
                            </span>
                          )}
                          {fc.confidence && <ConfidenceBadge level={fc.confidence} size="sm" />}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1.5">{fc.meaning}</p>
                      </div>
                    ))}
                    {(!root.flashcards || root.flashcards.length === 0) && (
                      <p className="text-xs text-zinc-500 text-center py-4">{t('noExamples')}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
