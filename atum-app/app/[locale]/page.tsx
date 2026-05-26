import fs from 'fs';
import path from 'path';
import { getMessages, getTranslations } from 'next-intl/server';
import QuickSearch from '@/components/QuickSearch';
import { Sparkles, Globe, Database, BookOpen, ChevronRight, Activity, Zap, RefreshCw } from 'lucide-react';
import Link from 'next/link';

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

export default async function IndexPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Index' });

  // Read etymologies data
  let bridgeData: Etymology[] = [];
  try {
    const filePath = path.join(process.cwd(), 'data', 'etymologies.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(fileContent);
    bridgeData = parsed.bridge || [];
  } catch (e) {
    console.error("Failed to load etymologies data", e);
  }

  // Fallback if data loading fails or empty
  if (bridgeData.length === 0) {
    bridgeData = [
      {
        id: 'E005',
        arabicRoot: 'أسى/آسى',
        arabicForm: 'متأسي',
        arabicMeaning: 'داوى وعالج',
        modernWord: 'Medicine',
        modernMeaning: 'طب وعلاج',
        targetLanguage: 'لاتينية-إنكليزية',
        transformationRule: 'س→d / أ→Me',
        languagePath: 'سريانية-فينيقية→لاتينية→إنكليزية',
        domain: 'طب',
        confidence: '🔬 عالي',
        notes: 'المتأسي هو الطبيب المعالج في العربية القديمة'
      }
    ];
  }

  // Pick E005 (Medicine) as the Word of the Day
  const wordOfDay = bridgeData.find(item => item.id === 'E005') || bridgeData[0];

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

  const wotdBadoe = getConfidenceBadge(wordOfDay.confidence);

  return (
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-[#0d1117]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-3xl pointer-events-none translate-y-1/3" />

      {/* Header Navigation */}
      <header className="border-b border-zinc-800/60 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-blue-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              A
            </span>
            <span className={`text-2xl font-bold tracking-wider text-zinc-100 uppercase ${locale === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
              {locale === 'ar' ? 'أتوم' : 'ATUM'}
            </span>
          </div>

          {/* Nav Items */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
            <span className="hover:text-zinc-200 cursor-not-allowed transition-colors">Explorer</span>
            <span className="hover:text-zinc-200 cursor-not-allowed transition-colors">Learn</span>
            <span className="hover:text-zinc-200 cursor-not-allowed transition-colors">Letters</span>
            <span className="hover:text-zinc-200 cursor-not-allowed transition-colors">Research</span>
          </nav>

          {/* Locale Switcher */}
          <div className="flex items-center gap-2 border border-zinc-800 rounded-xl px-3 py-1.5 bg-[#161b22]/50">
            <Globe className="w-4 h-4 text-zinc-400" />
            <div className="flex gap-2 text-xs font-semibold">
              <Link href="/en" className={`px-2 py-0.5 rounded-md transition-all ${locale === 'en' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}>
                EN
              </Link>
              <Link href="/ar" className={`px-2 py-0.5 rounded-md transition-all font-arabic ${locale === 'ar' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}>
                عربي
              </Link>
              <Link href="/fr" className={`px-2 py-0.5 rounded-md transition-all ${locale === 'fr' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'}`}>
                FR
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 flex flex-col gap-16 md:gap-24">
        
        {/* Hero Section */}
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

          <p className="text-base md:text-lg text-zinc-400 max-w-2xl leading-relaxed mt-2">
            {t('description')}
          </p>

          <div className="mt-6 p-6 rounded-2xl bg-[#161b22]/40 border border-zinc-800/80 max-w-3xl leading-relaxed text-zinc-300 text-sm md:text-base backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-700/5 to-transparent rounded-bl-full pointer-events-none" />
            <p className={locale === 'ar' ? 'font-arabic text-right leading-loose' : 'text-center'}>
              {t('heroExplanation')}
            </p>
          </div>

          {/* Quick Search */}
          <QuickSearch etymologies={bridgeData} />
        </section>

        {/* Root Cards Section */}
        <section className="flex flex-col gap-8 md:gap-12">
          <h2 className={`text-2xl md:text-4xl font-bold text-center text-zinc-100 ${locale === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
            {t('rootsTitle')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* ATUM CARD */}
            <div className="group relative bg-[#161b22]/50 hover:bg-[#161b22] border border-zinc-800 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden shadow-xl">
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors blur-xl" />
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Activity className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-1 rounded">
                    Inertia
                  </span>
                </div>
                <h3 className={`text-2xl font-bold text-zinc-100 flex items-baseline gap-2 ${locale === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
                  {t('atumTitle')}
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block" />
                </h3>
                <p className={`text-xs font-semibold text-emerald-400/90 mt-1 uppercase tracking-wider ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                  {t('atumPrinciple')}
                </p>
                <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                  {t('atumDesc')}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-zinc-800/80 flex justify-between items-center text-xs text-zinc-500 group-hover:text-zinc-400">
                <span>Sound Signature</span>
                <span className="font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-300">
                  A · M · W · N · H · L
                </span>
              </div>
            </div>

            {/* BULL CARD */}
            <div className="group relative bg-[#161b22]/50 hover:bg-[#161b22] border border-zinc-800 hover:border-rose-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden shadow-xl">
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-rose-500/5 group-hover:bg-rose-500/10 transition-colors blur-xl" />
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-rose-400 bg-rose-500/5 border border-rose-500/10 px-2 py-1 rounded">
                    Radiation
                  </span>
                </div>
                <h3 className={`text-2xl font-bold text-zinc-100 flex items-baseline gap-2 ${locale === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
                  {t('bullTitle')}
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 block" />
                </h3>
                <p className={`text-xs font-semibold text-rose-400/90 mt-1 uppercase tracking-wider ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                  {t('bullPrinciple')}
                </p>
                <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                  {t('bullDesc')}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-zinc-800/80 flex justify-between items-center text-xs text-zinc-500 group-hover:text-zinc-400">
                <span>Sound Signature</span>
                <span className="font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-300">
                  B · R · F · V · P · W
                </span>
              </div>
            </div>

            {/* TOR CARD */}
            <div className="group relative bg-[#161b22]/50 hover:bg-[#161b22] border border-zinc-800 hover:border-blue-500/40 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden shadow-xl">
              <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors blur-xl" />
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <RefreshCw className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 bg-blue-500/5 border border-blue-500/10 px-2 py-1 rounded">
                    Rotation
                  </span>
                </div>
                <h3 className={`text-2xl font-bold text-zinc-100 flex items-baseline gap-2 ${locale === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
                  {t('torTitle')}
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 block" />
                </h3>
                <p className={`text-xs font-semibold text-blue-400/90 mt-1 uppercase tracking-wider ${locale === 'ar' ? 'font-arabic' : 'font-sans'}`}>
                  {t('torPrinciple')}
                </p>
                <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
                  {t('torDesc')}
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-zinc-800/80 flex justify-between items-center text-xs text-zinc-500 group-hover:text-zinc-400">
                <span>Sound Signature</span>
                <span className="font-mono bg-zinc-900 border border-zinc-850 px-2 py-0.5 rounded text-zinc-300">
                  T · D · Z · K · G · C
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* Word of the Day & Stats Row */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Word of the Day Widget */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#161b22] to-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full bg-amber-500/5 blur-xl pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('wordOfDay')}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 border rounded-full font-bold ${wotdBadoe.color}`}>
                  {wotdBadoe.text}
                </span>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-zinc-900/60 border border-zinc-850 p-4 rounded-2xl text-sm mb-6">
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
              <div className="text-xs text-zinc-400 border-t border-zinc-800/80 pt-4 font-sans leading-relaxed">
                <span className="font-bold text-zinc-300 uppercase tracking-wider block mb-1">Linguistic Analysis:</span>
                {wordOfDay.notes}
              </div>
            )}
          </div>

          {/* Stats & Quick Links Box */}
          <div className="bg-[#161b22] border border-zinc-800 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl">
            <h4 className={`text-xl font-bold text-zinc-100 mb-6 ${locale === 'ar' ? 'font-arabic' : 'font-cinzel'}`}>
              ATUM Database Stats
            </h4>

            <div className="space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <Database className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Etymology Database</span>
                  <span className="text-zinc-200 font-bold">{t('statsWords')}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Scientific Validation</span>
                  <span className="text-zinc-200 font-bold">{t('statsDocumented')}</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Academic Foundations</span>
                  <span className="text-zinc-200 font-bold">{t('statsSources')}</span>
                </div>
              </div>

            </div>

            {/* Quick action link */}
            <div className="mt-8 border-t border-zinc-800/80 pt-6">
              <span className="inline-flex items-center gap-2 text-sm text-amber-500 hover:text-amber-400 font-bold group cursor-not-allowed">
                <span>Start Learning</span>
                {locale === 'ar' ? (
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:-translate-x-1 rotate-180" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                )}
              </span>
            </div>

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 bg-[#0d1117]/40 py-12 mt-16 text-center text-sm text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className={locale === 'ar' ? 'font-arabic' : 'font-sans'}>
            &copy; 2026 ATUM Project. Every Word Has a Root.
          </span>
          <span className="text-xs text-zinc-650">
            Powered by next-intl & Tailwind CSS. Inspired by Santos Bonacci etymology research.
          </span>
        </div>
      </footer>
    </div>
  );
}
