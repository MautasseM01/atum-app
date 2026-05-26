'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/explorer', label: 'Explorer', labelAr: 'المستكشف', labelFr: 'Explorateur' },
  { href: '/patterns', label: 'Patterns', labelAr: 'الأنماط', labelFr: 'Motifs' },
  { href: '/letters', label: 'Letters', labelAr: 'الحروف', labelFr: 'Lettres' },
  { href: '/research', label: 'Research', labelAr: 'البحث', labelFr: 'Recherche' },
];

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'عربي' },
  { code: 'fr', label: 'FR' },
];

export default function NavBar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const getLabel = (item: typeof navItems[0]) => {
    if (locale === 'ar') return item.labelAr;
    if (locale === 'fr') return item.labelFr;
    return item.label;
  };

  const isActive = (href: string) => {
    const p = pathname.replace(`/${locale}`, '') || '/';
    return p === href || p.startsWith(href + '/');
  };

  return (
    <header className="border-b border-[#2a2a2a]/60 bg-[#0d0d0d]/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-blue-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            A
          </span>
          <span className={cn('text-2xl font-bold tracking-wider text-zinc-100 uppercase', locale === 'ar' ? 'font-arabic' : 'font-cinzel')}>
            {locale === 'ar' ? 'أتوم' : 'ATUM'}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                isActive(item.href)
                  ? 'bg-zinc-800/60 text-zinc-100'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30'
              )}
            >
              {getLabel(item)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-[#2a2a2a] rounded-xl px-2 py-1.5 bg-[#1a1a1a]/50">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            {locales.map((l) => (
              <Link
                key={l.code}
                href={`/${l.code}`}
                className={cn(
                  'px-2 py-0.5 rounded-md text-xs font-semibold transition-all',
                  locale === l.code ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200',
                  l.code === 'ar' ? 'font-arabic' : ''
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-zinc-400 hover:text-zinc-200">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#2a2a2a]/60 bg-[#0d0d0d] animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'block px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  isActive(item.href) ? 'bg-zinc-800/60 text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
                )}
              >
                {getLabel(item)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
