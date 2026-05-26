import fs from 'fs';
import path from 'path';
import { getTranslations } from 'next-intl/server';
import RootBadge from '@/components/RootBadge';

interface Letter {
  id: number; arabic: string; name: string; nameAr: string;
  abjadValue: number; element: string;
  dna: { semanticDepth?: number; fundamentalFreqHz?: number; corpusFrequency?: number; energyType?: string; mataqadatClass?: string; phonosemanticVerdict?: string; cnnConfirmed?: boolean };
}

const soundRootMap: Record<string, string> = {
  أ: 'ATUM', م: 'ATUM', و: 'ATUM', ن: 'ATUM', ه: 'ATUM', ل: 'ATUM',
  ب: 'BULL', ر: 'BULL', ف: 'BULL', ح: 'BULL', ع: 'BULL',
  ط: 'TOR', د: 'TOR', ز: 'TOR', ك: 'TOR', ت: 'TOR', ق: 'TOR',
};

const rootColors: Record<string, string> = { ATUM: 'text-emerald-400', BULL: 'text-rose-400', TOR: 'text-blue-400' };
const rootBg: Record<string, string> = { ATUM: 'bg-emerald-500/10', BULL: 'bg-rose-500/10', TOR: 'bg-blue-500/10' };
const rootBorder: Record<string, string> = { ATUM: 'border-emerald-500/30', BULL: 'border-rose-500/30', TOR: 'border-blue-500/30' };

export default async function LettersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Letters' });

  let letters: Letter[] = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'letters.json');
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    letters = parsed.letters || [];
  } catch { console.error('Failed to load letters data'); }

  return (
    <div className="flex-1 min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/5 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none translate-y-1/3" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-zinc-100 tracking-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {letters.map((letter) => {
            const root = soundRootMap[letter.arabic] || '';
            return (
              <div key={letter.id} className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-600/40">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center">
                      <span className="text-3xl font-bold font-arabic text-amber-400">{letter.arabic}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">{letter.name}</h3>
                      <p className="text-xs text-zinc-500">{letter.nameAr}</p>
                    </div>
                  </div>
                  {root && <RootBadge root={root} size="sm" />}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-2.5">
                    <span className="text-zinc-500 block uppercase tracking-wider mb-1">Abjad</span>
                    <span className="text-zinc-200 font-bold font-mono">{letter.abjadValue}</span>
                  </div>
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-2.5">
                    <span className="text-zinc-500 block uppercase tracking-wider mb-1">{t('element')}</span>
                    <span className={`font-medium ${letter.element === 'نار' || letter.element === 'Fire' ? 'text-rose-400' : letter.element === 'ماء' || letter.element === 'Water' ? 'text-blue-400' : letter.element === 'هواء' || letter.element === 'Air' ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {letter.element}
                    </span>
                  </div>
                </div>

                {letter.dna && (
                  <div className="border-t border-[#2a2a2a] pt-3 space-y-2 text-xs">
                    {letter.dna.energyType && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">{t('energy')}</span>
                        <span className="text-zinc-300 text-right max-w-[60%]">{letter.dna.energyType}</span>
                      </div>
                    )}
                    {letter.dna.corpusFrequency && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">{t('frequency')}</span>
                        <span className="font-mono text-zinc-300">{letter.dna.corpusFrequency}%</span>
                      </div>
                    )}
                    {letter.dna.fundamentalFreqHz && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Hz</span>
                        <span className="font-mono text-zinc-300">{letter.dna.fundamentalFreqHz}</span>
                      </div>
                    )}
                    {letter.dna.phonosemanticVerdict && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">{t('verdict')}</span>
                        <span>{letter.dna.phonosemanticVerdict}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-500">CNN v2</span>
                      <span className={letter.dna.cnnConfirmed ? 'text-emerald-400' : 'text-zinc-600'}>
                        {letter.dna.cnnConfirmed ? '✓ Confirmed' : '—'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
