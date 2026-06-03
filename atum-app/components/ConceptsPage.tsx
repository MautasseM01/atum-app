'use client';


import { useParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import SectionHeader from '@/components/SectionHeader';

import Footer from '@/components/Footer';
import {
  type IndexConcept,
  type ConceptGroup,
  type Locale,
  topicLabel,
  pickLocale,
  getRootAccent,
} from '@/lib/concepts';

interface PageProps {
  groups: Array<ConceptGroup & { concepts: IndexConcept[] }>;
}


export default function ConceptsPage({ groups }: PageProps) {
  const router = useRouter();
  const params = useParams();
  const locale = ((params?.locale as string) || 'en') as Locale;
  const t = useTranslations('Concepts');

  return (
    <>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <div style={{ padding: '55px 34px 89px', maxWidth: 1100, margin: '0 auto' }}>
        <SectionHeader
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {groups.map((group, gi) => {
          if (group.concepts.length === 0) return null;
          return (
            <section key={group.id} style={{ marginBottom: 55, animation: `fadeUp 0.6s ease ${gi * 0.1}s both` }}>
              <div style={{ marginBottom: 21, padding: '0 4px' }}>
                <h3 style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  fontSize: 22, color: '#e6edf3',
                  letterSpacing: '1px', marginBottom: 6,
                }}>
                  {group.title[locale]}
                </h3>
                <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.6, maxWidth: 720 }}>
                  {group.description[locale]}
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 21 }}>
                {group.concepts.map((c, ci) => {
                  const accent = getRootAccent(c.relatedRoot);
                  const title = pickLocale(c.title, locale);
                  return (
                    <article
                      key={c.id}
                      onClick={() => router.push(`/${locale}/concepts/${c.id}`)}
                      style={{
                        position: 'relative',
                        padding: '24px 24px 21px',
                        borderRadius: 16,
                        background: 'rgba(22, 27, 34, 0.7)',
                        border: '1px solid rgba(48, 54, 61, 0.5)',
                        cursor: 'pointer',
                        transition: 'all 280ms ease',
                        overflow: 'hidden',
                        animation: `fadeUp 0.6s ease ${(gi * 0.1) + (ci * 0.05)}s both`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = accent;
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(48, 54, 61, 0.5)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                        background: `linear-gradient(90deg, ${accent}88, ${accent}22)`,
                      }} />
                      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: 10, color: accent, fontFamily: "'JetBrains Mono', monospace",
                          letterSpacing: '1px', textTransform: 'uppercase',
                          background: `${accent}11`, padding: '3px 9px', borderRadius: 4,
                          border: `1px solid ${accent}33`,
                        }}>
                          {topicLabel(c.topic, locale)}
                        </span>
                        <span style={{
                          fontSize: 10, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace",
                          background: 'rgba(48, 54, 61, 0.4)', padding: '3px 8px', borderRadius: 4,
                        }}>
                          {c.relatedRoot === 'ALL' ? 'ATUM · BULL · TOR' : c.relatedRoot}
                        </span>
                      </div>
                      <h4 style={{
                        fontFamily: "'Cinzel Decorative', serif",
                        fontSize: 19, color: '#e6edf3',
                        lineHeight: 1.35, marginBottom: 12, letterSpacing: '0.3px',
                      }}>
                        {title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto' }}>
                        {c.relatedWords && c.relatedWords.length > 0 && (
                          <span style={{ fontSize: 12, color: '#8b949e', fontFamily: "'JetBrains Mono', monospace" }}>
                            {c.relatedWords.length} {t('linkedWords')}
                          </span>
                        )}
                        <span style={{ marginLeft: 'auto', fontSize: 13, color: accent, fontWeight: 600 }}>
                          {t('open')} →
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        {groups.every(g => g.concepts.length === 0) && (
          <div style={{ textAlign: 'center', padding: '89px 34px', color: '#484f58' }}>
            <div style={{ fontSize: 55, marginBottom: 21 }}>✦</div>
            <div style={{ fontSize: 18, color: '#e6edf3' }}>{t('empty')}</div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
