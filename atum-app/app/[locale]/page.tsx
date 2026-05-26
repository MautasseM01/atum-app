import fs from 'fs';
import path from 'path';
import { getTranslations } from 'next-intl/server';
import QuickSearch from '@/components/QuickSearch';
import StatCard from '@/components/StatCard';
import RootBadge from '@/components/RootBadge';
import { Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface Etymology {
  id: string; arabicRoot: string; arabicForm: string; arabicMeaning: string;
  modernWord: string; modernMeaning: string; targetLanguage: string;
  transformationRule: string; languagePath: string; domain: string;
  confidence: string; notes?: string;
}

export default async function IndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  let bridgeData: Etymology[] = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'etymologies.json');
    const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    bridgeData = parsed.bridge || [];
  } catch (e) { console.error('Failed to load etymologies data', e); }

  if (bridgeData.length === 0) {
    bridgeData = [{ id: 'E005', arabicRoot: 'أسى/آسى', arabicForm: 'متأسي', arabicMeaning: 'داوى وعالج', modernWord: 'Medicine', modernMeaning: 'طب وعلاج', targetLanguage: 'لاتينية-إنكليزية', transformationRule: 'س→d / أ→Me', languagePath: 'سريانية-فينيقية→لاتينية→إنكليزية', domain: 'طب', confidence: '🔬 عالي', notes: 'المتأسي هو الطبيب المعالج في العربية القديمة' }];
  }

  const wordOfDay = bridgeData.find(item => item.id === 'E005') || bridgeData[0];

  const getConfidenceBadge = (s: string) => {
    if (s.includes('محتمل')) return { text: t('confidenceProbable'), color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    if (s.includes('عالي') || s.includes('proven')) return { text: t('confidenceProven'), color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
    if (s.includes('استكشافي')) return { text: t('confidenceExploratory'), color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' };
    return { text: t('confidenceSpeculative'), color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' };
  };
  const badge = getConfidenceBadge(wordOfDay.confidence);

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-[#0d0d0d]">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-3xl pointer-events-none translate-y-1/3" />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 flex flex-col gap-16 md:gap-24">

        <section className="text-center max-w-4xl mx-auto flex flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Linguistic DNA Project</span>
          </div>

          <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-zinc-400 mt-2 ${locale === 'ar' ? 'font-arabic font-extrabold leading-tight' : 'font-cinzel'}`}>
            {t('title')}
          </h1>

          <p className={`text-xl md:text-2xl text-amber-500 font-semibold tracking-wide ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
            {t('subtitle')}
          </p>

          <p className="text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed">
            {t('description')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <RootBadge root="ATUM" />
            <RootBadge root="BULL" />
            <RootBadge root="TOR" />
          </div>

          <div className="mt-2 p-6 rounded-2xl bg-[#1a1a1a]/40 border border-[#2a2a2a]/80 max-w-3xl leading-relaxed text-zinc-300 text-sm md:text-base backdrop-blur-md relative overflow-hidden">
            <p className={locale === 'ar' ? 'font-arabic text-right leading-loose' : 'text-center'}>
              {t('heroExplanation')}
            </p>
          </div>

          <QuickSearch etymologies={bridgeData} />
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="5,083" label="Classified Words" color="#22C55E" />
          <StatCard value="96" label="Scientifically Documented" color="#F4A01B" />
          <StatCard value="5" label="Academic Sources" color="#3B82F6" />
          <StatCard value="99.7%" label="CNN Accuracy" color="#EF4444" />
        </section>

        <section className="flex flex-col gap-8 md:gap-12">
          <h2 className={`text-2xl md:text-4xl font-bold text-center text-zinc-100 ${locale === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
            {t('rootsTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                root: 'ATUM', title: t('atumTitle'), principle: t('atumPrinciple'), desc: t('atumDesc'),
                color: 'emerald', energy: 'Inertia', sig: 'A · M · W · N · H · L',
                arabicLetters: ['أ', 'م', 'و', 'ن', 'ه', 'ل'], icon: '◎'
              },
              {
                root: 'BULL', title: t('bullTitle'), principle: t('bullPrinciple'), desc: t('bullDesc'),
                color: 'rose', energy: 'Radiation', sig: 'B · R · F · V · P · W',
                arabicLetters: ['ب', 'ر', 'ف', 'ح', 'ع', 'و'], icon: '◉'
              },
              {
                root: 'TOR', title: t('torTitle'), principle: t('torPrinciple'), desc: t('torDesc'),
                color: 'blue', energy: 'Gravitation', sig: 'T · D · Z · K · G · C',
                arabicLetters: ['ط', 'د', 'ز', 'ك', 'ت', 'ق'], icon: '◎'
              },
            ].map((card) => (
              <div key={card.root} className={`group relative bg-[#1a1a1a]/50 hover:bg-[#1a1a1a] border border-[#2a2a2a] hover:border-${card.color}-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden shadow-xl`}>
                <div className={`absolute -top-16 -right-16 w-32 h-32 rounded-full bg-${card.color}-500/5 group-hover:bg-${card.color}-500/10 transition-colors blur-xl`} />
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/10 border border-${card.color}-500/30 flex items-center justify-center text-${card.color}-400 text-2xl font-bold font-cinzel`}>
                      {card.icon}
                    </div>
                    <span className={`text-[10px] font-mono tracking-widest uppercase text-${card.color}-400 bg-${card.color}-500/5 border border-${card.color}-500/10 px-2 py-1 rounded`}>
                      {card.energy}
                    </span>
                  </div>
                  <h3 className={`text-2xl font-bold text-zinc-100 flex items-baseline gap-2 ${locale === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
                    {card.title}
                    <span className={`w-2.5 h-2.5 rounded-full bg-${card.color}-500 block`} />
                  </h3>
                  <p className={`text-xs font-semibold text-${card.color}-400/90 mt-1 uppercase tracking-wider`}>
                    {card.principle}
                  </p>
                  <p className="text-zinc-400 text-sm mt-4 leading-relaxed">{card.desc}</p>
                  <div className="mt-4 flex gap-2">
                    {card.arabicLetters.map((l, i) => (
                      <span key={i} className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-arabic text-amber-400">
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-[#2a2a2a]/80 flex justify-between items-center text-xs text-zinc-500 group-hover:text-zinc-400">
                  <span>Sound Signature</span>
                  <span className="font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-300">{card.sig}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1a1a] to-zinc-900 border border-[#2a2a2a] rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-amber-500/5 blur-xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('wordOfDay')}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 border rounded-full font-bold ${badge.color}`}>{badge.text}</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-4">
                <h4 className="text-4xl md:text-5xl font-black font-sans tracking-wide text-zinc-100">
                  {wordOfDay.modernWord}
                </h4>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-zinc-500">{t('arabicRoot')}:</span>
                  <span className="text-2xl font-bold font-arabic text-amber-500 bg-amber-500/5 border border-amber-500/15 px-3 py-0.5 rounded">
                    {wordOfDay.arabicRoot} ({wordOfDay.arabicForm})
                  </span>
                </div>
              </div>

              <p className="text-zinc-300 text-base md:text-lg mb-6 leading-relaxed">
                {t('meaning')}: <span className="text-zinc-100 font-medium">{wordOfDay.modernMeaning}</span> — {wordOfDay.arabicMeaning}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/60 border border-zinc-800 p-4 rounded-2xl text-sm mb-6">
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 text-xs uppercase tracking-wider">{t('phoneticRule')}</span>
                  <span className="font-mono text-zinc-300 font-medium">{wordOfDay.transformationRule}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 text-xs uppercase tracking-wider">Language Route</span>
                  <span className="font-mono text-zinc-300 text-xs">{wordOfDay.languagePath}</span>
                </div>
              </div>
            </div>

            {wordOfDay.notes && (
              <div className="text-xs text-zinc-400 border-t border-[#2a2a2a]/80 pt-4 font-sans leading-relaxed">
                <span className="font-bold text-zinc-300 uppercase tracking-wider block mb-1">Linguistic Analysis:</span>
                {wordOfDay.notes}
              </div>
            )}
          </div>

          <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl">
            <h4 className={`text-xl font-bold text-zinc-100 mb-6 ${locale === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
              Quick Links
            </h4>
            <div className="space-y-4 flex-1">
              {[
                { href: `/${locale}/explorer`, label: 'Explorer', desc: 'Browse 5,083 classified words', color: 'text-emerald-400' },
                { href: `/${locale}/patterns`, label: 'Patterns', desc: 'Learn the three root systems', color: 'text-rose-400' },
                { href: `/${locale}/letters`, label: 'Letters', desc: '28 Arabic letters with DNA data', color: 'text-blue-400' },
                { href: `/${locale}/research`, label: 'Research', desc: 'Statistical validation & sources', color: 'text-amber-400' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-800/30 transition-all group">
                  <div className="flex-1">
                    <span className={`text-sm font-bold ${link.color} block`}>{link.label}</span>
                    <span className="text-xs text-zinc-500">{link.desc}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>

      <footer className="border-t border-[#2a2a2a]/60 bg-[#0d0d0d]/40 py-12 mt-16 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className={locale === 'ar' ? 'font-arabic' : 'font-sans'}>
            &copy; 2026 ATUM Project. Every Word Has a Root.
          </span>
          <span className="text-xs text-zinc-600">
            Three electromagnetic roots · 5,083 classified words · 96 scientifically documented
          </span>
        </div>
      </footer>
    </div>
  );
}
