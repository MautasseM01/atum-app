import { getTranslations } from 'next-intl/server';
import StatCard from '@/components/StatCard';
import { BookOpen, Network, Clock } from 'lucide-react';

const timeline = [
  { year: '2019', label: 'Bonacci Theory', color: '#22C55E' },
  { year: '2020', label: 'Pattern Discovery', color: '#22C55E' },
  { year: '2021', label: 'Wiktionary Scraping', color: '#3B82F6' },
  { year: '2022', label: 'AI Classification', color: '#3B82F6' },
  { year: '2023', label: 'Ibdal Research', color: '#F4A01B' },
  { year: '2024', label: 'CNN Validation', color: '#F4A01B' },
  { year: '2025', label: '5,083 Words', color: '#EF4444' },
  { year: '2026', label: 'ATUM Launch', color: '#EF4444' },
];

const sources = [
  { id: 'wehr', key: 'sourceWehr', icon: '📖' },
  { id: 'lane', key: 'sourceLane', icon: '📚' },
  { id: 'etymonline', key: 'sourceEtymonline', icon: '🌐' },
  { id: 'lisan', key: 'sourceLisan', icon: '📜' },
  { id: 'comparative', key: 'sourceComparative', icon: '🔬' },
];

export default async function ResearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Research' });

  return (
    <div className="flex-1 min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-rose-500/5 blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-cinzel text-zinc-100 tracking-tight mb-3">
            {t('title')}
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          <StatCard value="99.7%" label={t('cnnAccuracy')} color="#22C55E" />
          <StatCard value="P<0.0001" label={t('pValue')} color="#3B82F6" />
          <StatCard value="R=−0.693" label={t('correlation')} color="#EF4444" />
          <StatCard value="96" label={t('documented')} color="#F4A01B" />
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Clock className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold font-cinzel text-zinc-100">{t('timeline')}</h2>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#2a2a2a] -translate-y-1/2" />
            <div className="flex justify-between relative">
              {timeline.map((item) => (
                <div key={item.year} className="flex flex-col items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-[#0d0d0d] shadow-lg relative z-10"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs font-bold font-mono text-zinc-300">{item.year}</span>
                  <span className="text-[10px] text-zinc-500 text-center max-w-[80px] leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold font-cinzel text-zinc-100">{t('sources')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {sources.map((src) => (
              <div key={src.id} className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-xl p-4 text-center hover:border-zinc-600/40 transition-all">
                <span className="text-2xl block mb-2">{src.icon}</span>
                <p className="text-xs text-zinc-300 leading-relaxed">{t(src.key)}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-3 mb-8">
            <Network className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold font-cinzel text-zinc-100">{t('network')}</h2>
          </div>

          <div className="bg-[#1a1a1a]/50 border border-[#2a2a2a] rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center gap-12 mb-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center">
                  <span className="text-lg font-bold text-emerald-400 font-cinzel">A</span>
                </div>
                <span className="text-xs text-emerald-400 font-bold">ATUM</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500/40 flex items-center justify-center">
                  <span className="text-lg font-bold text-rose-400 font-cinzel">B</span>
                </div>
                <span className="text-xs text-rose-400 font-bold">BULL</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500/40 flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-400 font-cinzel">T</span>
                </div>
                <span className="text-xs text-blue-400 font-bold">TOR</span>
              </div>
            </div>

            <p className="text-sm text-zinc-400">
              <strong className="text-zinc-200">102 {t('nodes')}</strong> · 3 {t('nodes').toLowerCase()} (ATUM, BULL, TOR) + interconnected words
            </p>
            <p className="text-xs text-zinc-500 mt-2">
              r=−0.693 · p{'<'}0.0001 · CNN 99.7%
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
