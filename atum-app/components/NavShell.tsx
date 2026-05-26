'use client';

import { usePathname, useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import HexGrid from '@/components/HexGrid';

function getPage(pathname: string, locale: string): string {
  const p = pathname.replace(`/${locale}`, '') || '/';
  if (p === '/') return 'home';
  const match = p.match(/^\/([^/?#]+)/);
  return match ? match[1] : 'home';
}

export default function NavShell({ locale, children }: { locale: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = getPage(pathname, locale);

  return (
    <>
      <HexGrid />
      <Navigation currentPage={currentPage} onNavigate={(page) => {
        router.push(`/${locale}${page === 'home' ? '' : `/${page}`}`);
      }} />
      <div style={{ minHeight: '100vh', paddingTop: 80, position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </>
  );
}
