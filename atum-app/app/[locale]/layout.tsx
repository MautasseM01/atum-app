import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Amiri, Cinzel, Source_Serif_4, Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
import NavBar from '@/components/NavBar';

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  variable: '--font-amiri',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-cinzel',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-source-serif',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default async function LocaleLayout({
  children, params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ar' | 'fr')) notFound();

  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${cinzel.variable} ${sourceSerif.variable} h-full antialiased`}>
      <body className={`min-h-full flex flex-col bg-[#0d0d0d] text-zinc-100 ${locale === 'ar' ? 'font-arabic text-lg' : 'font-serif'}`}>
        <NextIntlClientProvider messages={messages}>
          <NavBar locale={locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
